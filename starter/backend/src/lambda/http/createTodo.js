import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../../lambda/utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)
    console.log('createTodo request body ==========> ', newTodo)

    const userId = getUserId(event)
    const newItem = await createTodo(newTodo, userId)
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        newItem
      })
    }
  })
