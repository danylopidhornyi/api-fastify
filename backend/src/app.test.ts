import { buildApp } from './app.js'

const test = async () => {
  const app = await buildApp()

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  console.log('status code: ', response.statusCode)
  console.log('body: ', response.body)
}

test()
