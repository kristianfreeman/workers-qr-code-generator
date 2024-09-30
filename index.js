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
<img id="qr"></img>
<script>
  function generate() {
    fetch(window.location.pathname, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: document.querySelector("#text").value })
    })
    .then(response => response.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.onloadend = function () {
        document.querySelector("#qr").src = reader.result; // Update the image source with the newly generated QR code
      }
      reader.readAsDataURL(blob);
    })
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
