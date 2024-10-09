import jsonwebtoken from 'jsonwebtoken'

export function getUserId(event) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const decodedJwt = jsonwebtoken.decode(jwtToken)
  return decodedJwt.sub
}
