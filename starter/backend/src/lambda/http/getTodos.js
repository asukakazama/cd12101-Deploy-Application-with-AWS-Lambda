import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../../lambda/utils.mjs'
import { getTodosPerUser } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('getTodos event ==========> ', event)

    const userId = getUserId(event)
    console.log('userId ==========> ', userId)
    const todosItems = await getTodosPerUser(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todosItems
      })
    }
  })