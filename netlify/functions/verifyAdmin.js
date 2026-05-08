export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }
  try {
    const { password } = JSON.parse(event.body)
    const correct = process.env.ADMIN_PASSWORD
    if (!correct) return { statusCode: 500, body: 'Server misconfigured' }
    if (password !== correct) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Wrong password' }) }
    }
    const token = Buffer.from(`${password}:${process.env.APP_SECRET}`).toString('base64')
    return {
      statusCode: 200,
      body: JSON.stringify({ token })
    }
  } catch {
    return { statusCode: 400, body: 'Bad request' }
  }
}
