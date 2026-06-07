export async function generateFormWithAI(prompt: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Eres experto en diseño de formularios. El usuario quiere: "${prompt}"
Responde SOLO con JSON válido (sin markdown ni backticks ni explicaciones):
{"title":"Título","description":"Descripción","fields":[{"id":"field_1","type":"text","label":"Nombre","placeholder":"Tu nombre","required":true}]}
Tipos válidos: text, email, number, select, textarea, radio, checkbox.
Para select/radio/checkbox agrega "options":["op1","op2"].
Crea entre 3 y 7 campos relevantes.`
          }]
        }],
        generationConfig: { 
          temperature: 0.3,
          responseMimeType: "application/json"
        }
      })
    }
  )
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const clean = text.replace(/```json|```/g, '').trim()
  try { return JSON.parse(clean) }
  catch { 
    const m = clean.match(/\{[\s\S]+\}/)
    if (m) return JSON.parse(m[0])
    throw new Error('Gemini no devolvió JSON válido: ' + clean.slice(0, 100))
  }
}