import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todosAccess = new TodoAccess()

export async function getTodosPerUser(userId) {
    return todosAccess.getTodosPerUserId(userId)
}

// export async function getAllGroups() {
//   return todosAccess.getAllGroups()
// }

export async function createTodo(createTodoRequest, userId) {
  const todoId = uuid.v4()
  const currentDate = new Date()
  const createdAt = currentDate.toISOString()

  return await todosAccess.createTodo({
    todoId: todoId,
    userId: userId,
    createdAt: createdAt,
    ...createTodoRequest
  })
}
