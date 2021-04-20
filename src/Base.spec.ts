import Base from './Base'
import BaseMongoSdkConfig from './Config'

describe('Base', () => {
  test('checking happy path', () => {
    const config: BaseMongoSdkConfig = {
      collection: 'test',
      dbDomain: 'test.test.com',
      dbName: 'default',
      dbPassword: 'password',
      dbUserName: 'username',
    }
    const apiStage = new Base<unknown>(config)
    expect(apiStage).toBeDefined()
  })
})
