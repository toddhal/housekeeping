// Serverless function to send SMS via Twilio. Keeps credentials off the
// client. Trigger via fetch('/.netlify/functions/sendSms', { method: 'POST',
// body: JSON.stringify({ to: '+15555551234', message: 'Hi' }) }).

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const { to, message } = payload
  if (!to || !message) {
    return { statusCode: 400, body: 'Missing "to" or "message"' }
  }

  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER

  if (!sid || !token || !from) {
    // Not configured yet — succeed quietly so the client UX still works.
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, stubbed: true }),
    }
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`
  const body = new URLSearchParams({ To: to, From: from, Body: message })
  const auth = Buffer.from(`${sid}:${token}`).toString('base64')

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
    const data = await res.json()
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify(data) }
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, sid: data.sid }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) }
  }
}
