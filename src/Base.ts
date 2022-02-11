import { assertEx } from '@xylabs/sdk-js'
import { Collection, Filter, FindCursor, MongoClient, OptionalId, OptionalUnlessRequiredId, WithId } from 'mongodb'

import { BaseMongoSdkConfig } from './Config'
import { MongoClientWrapper } from './Wrapper'

export class BaseMongoSdk<T> {
  public config: BaseMongoSdkConfig

  constructor(config: BaseMongoSdkConfig) {
    this.config = config
  }

  public get uri() {
    return (
      this.config.dbConnectionString ??
      `mongodb+srv://${this.config.dbUserName}:${this.config.dbPassword}@${this.config.dbDomain}.mongodb.net/${this.config.dbName}?retryWrites=true&w=majority`
    )
  }

  public async useMongo<R>(func: (client: MongoClient) => Promise<R> | R) {
    const wrapper = MongoClientWrapper.get(this.uri, this.config.maxPoolSize)
    const connection = await wrapper.connect()
    assertEx(connection, 'Connection failed')
    try {
      return await func(connection)
    } finally {
      await wrapper.disconnect()
    }
  }

  public async useCollection<R>(func: (collection: Collection<T>) => Promise<R> | R) {
    return await this.useMongo<R>(async (client: MongoClient) => {
      return await func(client.db(this.config.dbName).collection<T>(this.config.collection))
    })
  }

  public async findOne(filter: Filter<T>) {
    const result = await this.useCollection<WithId<T> | null>(async (collection: Collection<T>) => {
      return await collection.findOne(filter)
    })
    return result
  }

  public async find(filter: Filter<T>) {
    const result = await this.useCollection<FindCursor<WithId<T>>>(async (collection: Collection<T>) => {
      return await collection.find(filter)
    })
    return result
  }

  public async insertOne(item: OptionalUnlessRequiredId<T>) {
    return await this.useCollection(async (collection: Collection<T>) => {
      const result = await collection.insertOne(item)
      if (result.acknowledged) {
        return result.insertedId
      } else {
        throw Error('Insert Failed')
      }
    })
  }

  public async insertMany(items: OptionalId<T>[]) {
    return await this.useCollection(async (collection: Collection<T>) => {
      const result = await collection.bulkWrite(
        items.map((document: OptionalId<T>) => {
          return { insertOne: { document } }
        })
      )
      if (result.isOk()) {
        return result.getInsertedIds()
      } else {
        throw Error('Insert Failed')
      }
    })
  }

  public async updateOne(filter: Filter<T>, fields: T) {
    return await this.useCollection(async (collection: Collection<T>) => {
      const result = await collection.updateOne(filter, { $set: fields }, { upsert: false })
      if (result.acknowledged) {
        return result
      } else {
        throw Error('Update Failed')
      }
    })
  }

  public async upsertOne(filter: Filter<T>, item: T) {
    const { ...fields } = item
    return await this.useCollection(async (collection: Collection<T>) => {
      const result = await collection.updateOne(filter, { $set: fields }, { upsert: true })
      if (result.acknowledged) {
        return result
      } else {
        throw Error('Upsert Failed')
      }
    })
  }
}
