import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../../lambda/utils.mjs'
import { getUploadUrl } from '../../fileStorage/attachmentUtils.mjs'
import { uploadImageUrl } from '../../businessLogic/todos.mjs'

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
    const imageUrl = await getUploadUrl()

    const uploadedImageUrl = await uploadImageUrl(userId, todoId, imageUrl)
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadedImageUrl
      })
    }
  })
