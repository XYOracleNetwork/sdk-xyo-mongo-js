import { assertEx } from '@xylabs/sdk-js'
import { Collection, MongoClient } from 'mongodb'

import BaseMongoSdkConfig from './Config'
import MongoClientWrapper from './Wrapper'

class BaseMongoSdk<T> {
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
}

export default BaseMongoSdk
