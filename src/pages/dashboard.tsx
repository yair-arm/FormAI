import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [forms, setForms] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else {
        setUser(data.user)
        loadForms(data.user.id)
      }
    })
  }, [])

  const loadForms = async (userId: string) => {
    const { data } = await supabase
      .from('forms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setForms(data || [])
    setLoading(false)
  }

  const handleGenerateForm = async () => {
  if (!aiPrompt.trim()) return
  setGenerating(true)
  try {
    const res = await fetch('/api/generate-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: aiPrompt })
    })
    const form = await res.json()
    if (!form.title) throw new Error('La IA no devolvió un formulario válido')
    const slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
    const { data, error } = await supabase.from('forms').insert({
      user_id: user.id,
      title: form.title,
      description: form.description || '',
      fields: form.fields || [],
      slug,
      is_active: true
    }).select().single()
    if (error) throw new Error(error.message)
    setForms(prev => [data, ...prev])
    setShowNewForm(false)
    setAiPrompt('')
    router.push(`/forms/${data.id}`)
  } catch (e: any) {
    alert('Error: ' + e.message)
  }
  setGenerating(false)
}

  const total = forms.reduce((a, f) => a + (f.responses_count || 0), 0)
  const active = forms.filter(f => f.is_active).length

  return (
    <>
      <Head><title>Dashboard — FormAI</title></Head>
      <div className="dashboard">
        <aside className="sidebar">
          <div className="sidebar-logo">Form<span>AI</span></div>
          <button className="sidebar-item active"><span>▦</span> Dashboard</button>
          <button className="sidebar-item" onClick={() => setShowNewForm(true)}><span>✦</span> Nuevo formulario</button>
          <button className="sidebar-item"><span>◎</span> Respuestas</button>
          <button className="sidebar-item"><span>△</span> Analytics</button>
          <button className="sidebar-item"><span>⇄</span> Integraciones</button>
          <div style={{ marginTop: 'auto', borderTop: '1px solid #1f1f1f', paddingTop: 20 }}>
            <button className="sidebar-item" onClick={() => supabase.auth.signOut().then(() => router.push('/'))}><span>←</span> Salir</button>
          </div>
        </aside>

        <main className="main-content">
          <div className="flex-between mb-32">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="muted" style={{ marginTop: 4 }}>Bienvenido, {user?.user_metadata?.full_name || user?.email}</p>
            </div>
            <button className="btn-accent" onClick={() => setShowNewForm(true)}>✦ Crear con IA</button>
          </div>

          <div className="grid-4 mb-32">
            <div className="stat-card"><div className="stat-num accent">{forms.length}</div><div className="stat-label">Formularios</div></div>
            <div className="stat-card"><div className="stat-num">{total}</div><div className="stat-label">Respuestas totales</div></div>
            <div className="stat-card"><div className="stat-num accent">{active}</div><div className="stat-label">Activos</div></div>
            <div className="stat-card"><div className="stat-num">—</div><div className="stat-label">Tasa completación</div></div>
          </div>

          <div className="flex-between mb-16">
            <h2 className="section-title">Mis formularios</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Cargando...</div>
          ) : forms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'var(--gray2)', borderRadius: 14, border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Sin formularios todavía</h3>
              <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Crea tu primer formulario con IA en menos de 1 minuto</p>
              <button className="btn-accent" onClick={() => setShowNewForm(true)}>✦ Crear mi primer formulario</button>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="table">
                <thead><tr>
                  <th style={{ paddingLeft: 24 }}>FORMULARIO</th>
                  <th>RESPUESTAS</th><th>ESTADO</th><th>CREADO</th>
                  <th style={{ paddingRight: 24 }}>ACCIONES</th>
                </tr></thead>
                <tbody>
                  {forms.map(form => (
                    <tr key={form.id}>
                      <td style={{ paddingLeft: 24 }}>
                        <div style={{ fontWeight: 500, color: 'var(--white)' }}>{form.title}</div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>formai.app/f/{form.slug}</div>
                      </td>
                      <td><strong style={{ color: 'var(--white)' }}>{form.responses_count || 0}</strong></td>
                      <td><span className={`tag ${form.is_active ? 'tag-green' : 'tag-gray'}`}>{form.is_active ? '● Activo' : '○ Pausado'}</span></td>
                      <td>{form.created_at?.split('T')[0]}</td>
                      <td style={{ paddingRight: 24 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => router.push(`/forms/${form.id}`)} style={{ fontSize: 13, padding: '6px 14px', borderRadius: 100, background: '#2a2a2a', border: 'none', color: 'var(--white)', cursor: 'pointer' }}>Ver</button>
                          <button style={{ fontSize: 13, padding: '6px 14px', borderRadius: 100, background: 'rgba(0,229,160,.1)', border: '1px solid rgba(0,229,160,.2)', color: 'var(--accent)', cursor: 'pointer' }}>Respuestas</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {showNewForm && (
        <div className="modal-overlay" onClick={() => setShowNewForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">✦ Crear formulario con IA</div>
            <p className="muted" style={{ marginBottom: 24 }}>Describe qué formulario necesitas</p>
            <div className="form-group">
              <label className="form-label">DESCRIBE TU FORMULARIO</label>
              <textarea className="form-input" placeholder="Ej: Formulario de onboarding para clientes de mi agencia..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} style={{ minHeight: 120 }} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, padding: '13px' }} onClick={() => setShowNewForm(false)}>Cancelar</button>
              <button className="btn-accent" style={{ flex: 2, padding: '13px', borderRadius: 10 }} onClick={handleGenerateForm} disabled={generating || !aiPrompt.trim()}>
                {generating ? '✦ Generando...' : '✦ Generar formulario'}
              </button>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Plantillas rápidas:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Encuesta de satisfacción', 'Formulario de contacto', 'Onboarding de clientes', 'Registro a evento', 'Solicitud de presupuesto'].map(t => (
                  <button key={t} onClick={() => setAiPrompt(t)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 100, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#ccc', cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}