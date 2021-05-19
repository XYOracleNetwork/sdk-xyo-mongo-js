interface BaseMongoSdkConfig {
  collection: string
  dbDomain: string
  dbName: string
  dbPassword: string
  dbUserName: string
  maxPoolSize?: number
}

export default BaseMongoSdkConfig
