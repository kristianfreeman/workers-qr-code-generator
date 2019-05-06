const qr = require('qr-image')

const generate = async request => {
  const { text } = await request.json()
  const headers = { 'Content-Type': 'image/png' }
  const qr_png = qr.imageSync(text || 'https://workers.dev')
  return new Response(qr_png, { headers })
}

async function handleRequest(request) {
  let response
  if (request.method === 'POST') {
    response = await generate(request)
  } else {
    response = new Response('Expected POST', { status: 500 })
  }
  return response
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
