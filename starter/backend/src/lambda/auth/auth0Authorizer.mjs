import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDBTCCAe2gAwIBAgIJW+ut8tfGTSwsMA0GCSqGSIb3DQEBCwUAMCAxHjAcBgNV
BAMTFWRldi1kdWt1LnVzLmF1dGgwLmNvbTAeFw0yNDEwMDgwMjEwNDRaFw0zODA2
MTcwMjEwNDRaMCAxHjAcBgNVBAMTFWRldi1kdWt1LnVzLmF1dGgwLmNvbTCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJT/tKI8z6RutCF3m9JrGhmK9ou5
BoYPTGV4g+owDELhANTJXcWDUF8gpqfJdQpe9TkDOoqKIL6wO68PCtqGlSFS0wT4
1qOEDHrcDi+jELINMxNQ41FofF7YMvS+bwDp/v0ILrK3KKKFY0cV2UELtYLEHxOd
w9WiiVxddA3lRqYVr+49daNweEMlQktQR95pGzO0aR2SouMvHBqsqDXQuLyZHuBE
hKrFGxIBRwyKSSsqMk2dWN8VwsyVd42BidjUG+qZW6oGGM4OTv3CLVYZmqXjQdWy
xXznpeJ7678cRCILTSEYUYbk6NRghsGGCMiTRWg6JekKMre8M5iHwV/1Wb0CAwEA
AaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUTG9JfpgjMnvX8OMW3aBf
qTW0frYwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAzuC+YKly7
hfbOpIkasluRLechCX/JoyKsQh0Uov3ymqyB9DnIzQuQ1ujgtWTGAN46g7xN69xR
U0ejS/GAvhphJP3ZG8tBZH8Dj2akEKYetWNv3bt4CBPwdCO8cNXiAk7lbgVLp+cG
VOPrF3ID3DtlpIx2fmvAZEvqd5AX7TIWAYxgCHAlQQt0a7jSxhQFrl1XiOyFvNIO
JRhlU5CMWGhowTvray8hEUDXS0+TwkxwDGyhxT+eD0oHsP3fNECKTx2PHsvc8TxK
+w7W88UanAyEvCmluNI2Rq9GxLI4gb3XyF788cYJ5tdzBIPaJJ5tnr4MG1VLYpeR
gN8Phzm97Tez
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
