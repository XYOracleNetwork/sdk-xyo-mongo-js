import { Collection, MongoClient } from 'mongodb'

import BaseMongoSdkConfig from './Config'
import MongoClientWrapper from './Wrapper'

class BaseMongoSdk<T> {
  private config: BaseMongoSdkConfig

  constructor(config: BaseMongoSdkConfig) {
    this.config = config
  }

  protected get uri() {
    return `mongodb+srv://${this.config.dbUserName}:${this.config.dbPassword}@${this.config.dbDomain}.mongodb.net/${this.config.dbName}?retryWrites=true&w=majority`
  }

  protected async useMongo<R>(func: (client: MongoClient) => Promise<R> | R) {
    const wrapper = MongoClientWrapper.get(this.uri, this.config.maxPoolSize)
    const connection = await wrapper.connect()
    if (connection) {
      try {
        return await func(connection)
      } finally {
        await wrapper.disconnect()
      }
    }
  }

  protected async useCollection<R>(func: (collection: Collection<T>) => Promise<R> | R) {
    return await this.useMongo<R>(async (client: MongoClient) => {
      return await func(client.db(this.config.dbName).collection<T>(this.config.collection))
    })
  }
}

export default BaseMongoSdk
