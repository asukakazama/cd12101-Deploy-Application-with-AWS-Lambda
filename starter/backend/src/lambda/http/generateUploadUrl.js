import * as uuid from 'uuid'

import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../../lambda/utils.mjs'
import { getUploadUrl } from '../../fileStorage/attachmentUtils.mjs'
import { uploadImageUrl } from '../../businessLogic/todos.mjs'

const bucketName = process.env.IMAGES_S3_BUCKET

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
    const imageId = uuid.v4()
    const imageUrl = await getUploadUrl(imageId)

    const uploadUrl = await uploadImageUrl(userId, todoId, imageId, bucketName)
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  })
