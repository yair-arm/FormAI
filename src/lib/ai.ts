export async function generateFormWithAI(prompt: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Crea un formulario para: "${prompt}". 
Responde ÚNICAMENTE con este JSON, sin texto adicional, sin markdown:
{"title":"Nombre del formulario","description":"Descripción","fields":[{"id":"f1","type":"text","label":"Nombre","placeholder":"Tu nombre","required":true},{"id":"f2","type":"email","label":"Email","placeholder":"tu@email.com","required":true}]}`
          }]
        }]
      })
    }
  )
  const data = await res.json()
  
  if (data.error) throw new Error('Gemini error: ' + data.error.message)
  
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
  
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Respuesta de IA: ' + clean.slice(0, 200))
  
  return JSON.parse(match[0])
}