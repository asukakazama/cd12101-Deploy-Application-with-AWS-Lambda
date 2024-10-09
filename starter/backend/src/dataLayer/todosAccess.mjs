import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    todosCreatedAtIndex = process.env.CreatedAtIndex
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    this.todosCreatedAtIndex = todosCreatedAtIndex
  }

  async getTodosPerUserId(userId) {
    console.log(`Getting all todos per user ${userId}`)

    const result = await this.dynamoDbClient.query({
        TableName: this.todosTable,
        IndexName: this.todosCreatedAtIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    })
  
    return result.Items
  }

  async createTodo(todo) {
    console.log(`Creating a todo ${todo.id} with user ${todo.userId}`)

    await this.dynamoDbClient.put({
        TableName: this.todosTable,
        Item: todo
    })

    return todo
  }

  async updateTodo(todo, userId, todoId) {
    console.log(`Updating a todo ${todoId}`)

    const result = await this.getTodos(userId, todoId)
    if (result.length === 0) throw new Error('No record found')

    const updatedItem = {
        ...result[0],
        ...todo,
        done: true
    }

    await this.dynamoDbClient.put({
        TableName: this.todosTable,
        Item: updatedItem
    })

    return updatedItem
  }

  async deleteTodo(userId, todoId) {
    console.log(`Deleting a todo ${todoId}`)

    const result = await this.getTodos(userId, todoId)
    if (result.length === 0) throw new Error('No record found')

    await this.dynamoDbClient.delete({
        TableName: this.todosTable,
        Key: {
            userId: userId,
            todoId: todoId
        }
    })
  }

  async uploadImageUrl(userId, todoId, imageId, bucketName) {
    console.log(`Uploading an image ${imageId}`)

    const result = await this.getTodos(userId, todoId)
    if (result.length === 0) throw new Error('No record found')
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

    const updatedItem = {
        ...result[0],
        attachmentUrl: attachmentUrl
    }

    await this.dynamoDbClient.put({
        TableName: this.todosTable,
        Item: updatedItem
    })

    return attachmentUrl
  }

  async getTodos(userId, todoId) {
    const result = await this.dynamoDbClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId and todoId = :todoId',
        ExpressionAttributeValues: {
            ':userId': userId,
            ':todoId': todoId
        }
    })

    return result.Items
  }
}
