import type { NextApiRequest, NextApiResponse } from 'next'
import { generateFormWithAI } from '../../lib/ai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'Prompt requerido' })
  try {
    const form = await generateFormWithAI(prompt)
    res.status(200).json(form)
  } catch { res.status(500).json({ error: 'Error generando formulario' }) }
}
