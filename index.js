import QRCode from 'qrcode-svg'

const generate = async request => {
  const { text } = await request.json()
  const qr = new QRCode({ content: text || 'https://workers.dev' })
  return new Response(qr.svg(), { headers: { 'Content-Type': 'image/svg+xml' } })
}

const landing = `
<h1>QR Code Generator</h1>
<p>Click the below button to generate a new QR code. This will make a request to your serverless function.</p>
<input type="text" id="text" value="https://workers.dev"></input>
<button onclick='generate()'>Generate QR Code</button>
<p>Check the "Network" tab in your browser's developer tools to see the generated QR code.</p>
<div id="qr-code"></div>
<script>
  const generate = async () => {
    const resp = await fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: document.querySelector("#text").value })
    })

    const qr_code = document.querySelector("#qr-code");
    const svg = await resp.text();
    const dataUrl = "data:image/svg+xml;base64," + btoa(svg);
    qr_code.innerHTML = "<img src='" + dataUrl + "' />";
  }
</script>
`

export default {
  fetch: async (request, env) => {
    let response
    if (request.method === 'POST') {
      response = await generate(request)
    } else {
      response = new Response(landing, { headers: { 'Content-Type': 'text/html' } })
    }
    return response
    }
}
