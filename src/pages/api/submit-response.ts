import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { form_id, data } = req.body
  if (!form_id || !data) return res.status(400).json({ error: 'Faltan datos' })
  try {
    await supabase.from('form_responses').insert({ form_id, data, created_at: new Date().toISOString() })
    res.status(200).json({ success: true })
  } catch { res.status(200).json({ success: true }) }
}
