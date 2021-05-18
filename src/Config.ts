interface BaseMongoSdkConfig {
  collection: string
  dbDomain: string
  dbName: string
  dbPassword: string
  dbUserName: string
  poolSize?: number
}

export default BaseMongoSdkConfig
