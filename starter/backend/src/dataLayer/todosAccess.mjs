import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    userIdIndex = process.env.USER_ID_INDEX
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    this.userIdIndex = userIdIndex
  }

//   async getAllGroups() {
//     console.log('Getting all groups')

//     const result = await this.dynamoDbClient.scan({
//       TableName: this.todosTable
//     })
//     return result.Items
//   }

  async getTodosPerUserId(userId) {
    console.log(`Getting all todos per user ${userId}`)

    const result = await this.dynamoDbClient.query({
      TableName: this.todosTable,
      IndexName: this.userIdIndex,
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
}
