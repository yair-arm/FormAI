import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const MOCK_FORMS = [
  { id: '1', title: 'Encuesta de satisfacción', responses_count: 142, is_active: true, created_at: '2025-01-10', slug: 'satisfaccion' },
  { id: '2', title: 'Formulario de onboarding', responses_count: 87, is_active: true, created_at: '2025-01-08', slug: 'onboarding' },
  { id: '3', title: 'Contacto de ventas', responses_count: 23, is_active: false, created_at: '2025-01-05', slug: 'ventas' },
]

export default function Dashboard() {
  const router = useRouter()
  const [forms, setForms] = useState(MOCK_FORMS)
  const [user, setUser] = useState<any>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUser(data.user)
    })
  }, [])

  const handleGenerateForm = async () => {
    if (!aiPrompt.trim()) return
    setGenerating(true)
    try {
      const res = await fetch('/api/generate-form', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ prompt: aiPrompt }) })
      const form = await res.json()
      setForms(prev => [{ id: Date.now().toString(), title: form.title, responses_count: 0, is_active: true, created_at: new Date().toISOString().split('T')[0], slug: form.title.toLowerCase().replace(/\s+/g,'-') }, ...prev])
      setShowNewForm(false)
      setAiPrompt('')
    } catch { alert('Error generando formulario') }
    setGenerating(false)
  }

  const total = forms.reduce((a,f)=>a+f.responses_count,0)
  const active = forms.filter(f=>f.is_active).length

  return (
    <>
      <Head><title>Dashboard — FormAI</title></Head>
      <div className="dashboard">
        <aside className="sidebar">
          <div className="sidebar-logo">Form<span>AI</span></div>
          <button className="sidebar-item active"><span>▦</span> Dashboard</button>
          <button className="sidebar-item" onClick={()=>setShowNewForm(true)}><span>✦</span> Nuevo formulario</button>
          <button className="sidebar-item"><span>◎</span> Respuestas</button>
          <button className="sidebar-item"><span>△</span> Analytics</button>
          <button className="sidebar-item"><span>⇄</span> Integraciones</button>
          <div style={{marginTop:'auto',borderTop:'1px solid #1f1f1f',paddingTop:20}}>
            <button className="sidebar-item" onClick={()=>supabase.auth.signOut().then(()=>router.push('/'))}><span>←</span> Salir</button>
          </div>
        </aside>

        <main className="main-content">
          <div className="flex-between mb-32">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="muted" style={{marginTop:4}}>Bienvenido, {user?.user_metadata?.full_name || user?.email}</p>
            </div>
            <button className="btn-accent" onClick={()=>setShowNewForm(true)}>✦ Crear con IA</button>
          </div>

          <div className="grid-4 mb-32">
            <div className="stat-card"><div className="stat-num accent">{forms.length}</div><div className="stat-label">Formularios</div></div>
            <div className="stat-card"><div className="stat-num">{total}</div><div className="stat-label">Respuestas totales</div></div>
            <div className="stat-card"><div className="stat-num accent">{active}</div><div className="stat-label">Activos</div></div>
            <div className="stat-card"><div className="stat-num">84%</div><div className="stat-label">Tasa completación</div></div>
          </div>

          <div className="ai-box mb-32">
            <div className="ai-box-title">✦ Insight de IA</div>
            <p style={{fontSize:14,color:'#ccc',lineHeight:1.7}}>Tu formulario de onboarding tiene abandono del <strong style={{color:'var(--accent)'}}>23%</strong> en el campo "Teléfono". Considera hacerlo opcional. Pico de respuestas los martes 10am — ideal para enviar recordatorios.</p>
          </div>

          <div className="flex-between mb-16">
            <h2 className="section-title">Mis formularios</h2>
          </div>
          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <table className="table">
              <thead><tr>
                <th style={{paddingLeft:24}}>FORMULARIO</th>
                <th>RESPUESTAS</th><th>ESTADO</th><th>CREADO</th>
                <th style={{paddingRight:24}}>ACCIONES</th>
              </tr></thead>
              <tbody>
                {forms.map(form=>(
                  <tr key={form.id}>
                    <td style={{paddingLeft:24}}>
                      <div style={{fontWeight:500,color:'var(--white)'}}>{form.title}</div>
                      <div style={{fontSize:12,color:'#666',marginTop:2}}>formai.app/f/{form.slug}</div>
                    </td>
                    <td><strong style={{color:'var(--white)'}}>{form.responses_count}</strong></td>
                    <td><span className={`tag ${form.is_active?'tag-green':'tag-gray'}`}>{form.is_active?'● Activo':'○ Pausado'}</span></td>
                    <td>{form.created_at}</td>
                    <td style={{paddingRight:24}}>
                      <div style={{display:'flex',gap:8}}>
                        <button onClick={()=>router.push(`/forms/${form.id}`)} style={{fontSize:13,padding:'6px 14px',borderRadius:100,background:'#2a2a2a',border:'none',color:'var(--white)',cursor:'pointer'}}>Ver</button>
                        <button style={{fontSize:13,padding:'6px 14px',borderRadius:100,background:'rgba(0,229,160,.1)',border:'1px solid rgba(0,229,160,.2)',color:'var(--accent)',cursor:'pointer'}}>Respuestas</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showNewForm && (
        <div className="modal-overlay" onClick={()=>setShowNewForm(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">✦ Crear formulario con IA</div>
            <p className="muted" style={{marginBottom:24}}>Describe qué formulario necesitas</p>
            <div className="form-group">
              <label className="form-label">DESCRIBE TU FORMULARIO</label>
              <textarea className="form-input" placeholder="Ej: Formulario de onboarding para clientes de mi agencia, necesito saber empresa, objetivos y presupuesto..." value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} style={{minHeight:120}} />
            </div>
            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button className="btn-ghost" style={{flex:1,padding:'13px'}} onClick={()=>setShowNewForm(false)}>Cancelar</button>
              <button className="btn-accent" style={{flex:2,padding:'13px',borderRadius:10}} onClick={handleGenerateForm} disabled={generating||!aiPrompt.trim()}>
                {generating?'✦ Generando...':'✦ Generar formulario'}
              </button>
            </div>
            <div style={{marginTop:16}}>
              <div style={{fontSize:12,color:'#666',marginBottom:8}}>Plantillas rápidas:</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {['Encuesta de satisfacción','Formulario de contacto','Onboarding de clientes','Registro a evento','Solicitud de presupuesto'].map(t=>(
                  <button key={t} onClick={()=>setAiPrompt(t)} style={{fontSize:12,padding:'5px 12px',borderRadius:100,background:'#1a1a1a',border:'1px solid #2a2a2a',color:'#ccc',cursor:'pointer'}}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
