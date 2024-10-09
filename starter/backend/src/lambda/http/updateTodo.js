import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../../lambda/utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const updateTodoRequest = JSON.parse(event.body)
    const updatedItem = await updateTodo(updateTodoRequest, userId, todoId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        updatedItem
      })
    }
  })
