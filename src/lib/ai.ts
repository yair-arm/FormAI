export async function generateFormWithAI(prompt: string) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Crea un formulario exactamente como lo pide el usuario. Si pide una prueba, crea preguntas de prueba. Si pide una encuesta, crea preguntas de encuesta. El formulario debe ser específico para: "${prompt}". Usa tipos radio o checkbox para preguntas de opción múltiple. Responde SOLO con JSON válido sin markdown:
{"title":"Título","description":"Descripción","fields":[{"id":"f1","type":"text","label":"Nombre","placeholder":"Tu nombre","required":true},{"id":"f2","type":"email","label":"Email","placeholder":"tu@email.com","required":true}]}`
      }],
      temperature: 0.3
    })
  })
  const data = await res.json()
  if (data.error) throw new Error('Groq error: ' + data.error.message)
  const text = data.choices?.[0]?.message?.content || ''
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Respuesta inválida: ' + clean.slice(0, 200))
  return JSON.parse(match[0])
}