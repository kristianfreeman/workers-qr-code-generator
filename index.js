const qr = require('qr-image')

const generate = async request => {
  const { text } = await request.json()
  const headers = { 'Content-Type': 'image/png' }
  const qr_png = qr.imageSync(text || 'https://workers.dev')
  return new Response(qr_png, { headers })
}

const landing = `
<h1>QR Code Generator</h1>
<p>Click the below button to generate a new QR code. This will make a request to your serverless function.</p>
<input type="text" id="text" value="https://workers.dev"></input>
<button onclick='generate()'>Generate QR Code</button>
<p>Check the "Network" tab in your browser's developer tools to see the generated QR code.</p>
<script>
  function generate() {
    fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: document.querySelector("#text").value })
    })
  }
</script>
`

async function handleRequest(request) {
  let response
  if (request.method === 'POST') {
    response = await generate(request)
  } else {
    response = new Response(landing, { headers: { 'Content-Type': 'text/html' } })
  }
  return response
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
