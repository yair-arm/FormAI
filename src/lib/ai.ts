export async function generateFormWithAI(prompt: string) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Eres experto en diseño de formularios. El usuario quiere: "${prompt}"
Responde SOLO con JSON válido (sin markdown ni backticks):
{
  "title": "Título del formulario",
  "description": "Descripción breve",
  "fields": [
    {"id":"field_1","type":"text","label":"Nombre","placeholder":"Tu nombre","required":true}
  ]
}
Tipos válidos: text, email, number, select, textarea, radio, checkbox.
Para select/radio/checkbox agrega "options":["op1","op2"].
Crea entre 3 y 7 campos relevantes para el caso de uso.`
      }]
    })
  })
  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  try { return JSON.parse(text) }
  catch { const m = text.match(/\{[\s\S]+\}/); if (m) return JSON.parse(m[0]); throw new Error('Error IA') }
}

export async function generateInsightsWithAI(responses: any[], formTitle: string) {
  if (!responses.length) return null
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Analiza ${responses.length} respuestas del formulario "${formTitle}".
Muestra: ${JSON.stringify(responses.slice(0,20))}
Responde SOLO con JSON válido:
{"summary":"resumen en 1 oración","insights":["insight1","insight2","insight3"],"topAnswer":"tendencia principal","recommendation":"recomendación concreta"}`
      }]
    })
  })
  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  try { return JSON.parse(text) }
  catch { const m = text.match(/\{[\s\S]+\}/); if (m) return JSON.parse(m[0]); return null }
}
