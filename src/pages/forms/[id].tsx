import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FormField } from '../../lib/supabase'

const FIELD_TYPES = [
  {type:'text',label:'Texto corto',icon:'—'},
  {type:'textarea',label:'Texto largo',icon:'≡'},
  {type:'email',label:'Email',icon:'@'},
  {type:'number',label:'Número',icon:'#'},
  {type:'select',label:'Desplegable',icon:'▾'},
  {type:'radio',label:'Opción única',icon:'◉'},
  {type:'checkbox',label:'Múltiple',icon:'☑'},
]

let _id = 0
const uid = () => `field_${++_id}`

export default function FormBuilder() {
  const router = useRouter()
  const { id } = router.query
  const [title, setTitle] = useState('Mi formulario')
  const [fields, setFields] = useState<FormField[]>([
    {id:uid(),type:'text',label:'Nombre completo',placeholder:'Tu nombre',required:true},
    {id:uid(),type:'email',label:'Email',placeholder:'tu@email.com',required:true},
  ])
  const [selected, setSelected] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const addField = (type: string) => {
    const f: FormField = {id:uid(),type:type as any,label:FIELD_TYPES.find(ft=>ft.type===type)?.label||'Campo',placeholder:'',required:false,options:['select','radio','checkbox'].includes(type)?['Opción 1','Opción 2']:undefined}
    setFields([...fields,f]); setSelected(f.id)
  }
  const updateField = (id:string, u:Partial<FormField>) => setFields(fields.map(f=>f.id===id?{...f,...u}:f))
  const removeField = (id:string) => { setFields(fields.filter(f=>f.id!==id)); if(selected===id) setSelected(null) }
  const copyLink = () => { navigator.clipboard.writeText(`${window.location.origin}/f/${id||'demo'}`); setCopied(true); setTimeout(()=>setCopied(false),2000) }
  const handleSave = async () => { setSaving(true); await new Promise(r=>setTimeout(r,800)); setSaving(false); router.push('/dashboard') }

  const sel = fields.find(f=>f.id===selected)

  return (
    <>
      <Head><title>{title} — FormAI Builder</title></Head>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 24px',borderBottom:'1px solid #1f1f1f',background:'var(--gray1)',position:'sticky',top:0,zIndex:50}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <button onClick={()=>router.push('/dashboard')} style={{background:'none',border:'none',color:'#888',fontSize:20,cursor:'pointer'}}>←</button>
          <input value={title} onChange={e=>setTitle(e.target.value)} style={{background:'none',border:'none',color:'var(--white)',fontFamily:'var(--serif)',fontSize:18,fontWeight:700,outline:'none',minWidth:200}} />
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={copyLink} className="btn-ghost" style={{padding:'9px 18px',fontSize:13}}>{copied?'✓ Copiado!':'⇄ Copiar link'}</button>
          <button onClick={handleSave} className="btn-accent" style={{padding:'9px 20px',fontSize:13}}>{saving?'Guardando...':'✓ Guardar'}</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'220px 1fr 280px',height:'calc(100vh - 57px)'}}>
        <div style={{background:'var(--gray1)',borderRight:'1px solid #1f1f1f',padding:16,overflowY:'auto'}}>
          <div style={{fontSize:11,letterSpacing:1,textTransform:'uppercase',color:'#666',fontWeight:600,marginBottom:12}}>Agregar campo</div>
          {FIELD_TYPES.map(ft=>(
            <button key={ft.type} onClick={()=>addField(ft.type)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:8,background:'none',border:'1px solid transparent',color:'#ccc',fontSize:14,cursor:'pointer',textAlign:'left',marginBottom:4}} onMouseOver={e=>e.currentTarget.style.background='#1a1a1a'} onMouseOut={e=>e.currentTarget.style.background='none'}>
              <span style={{width:24,height:24,background:'#1a1a1a',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'var(--accent)'}}>{ft.icon}</span>
              {ft.label}
            </button>
          ))}
        </div>

        <div style={{overflowY:'auto',padding:32,background:'var(--black)'}}>
          <div style={{maxWidth:580,margin:'0 auto'}}>
            <input value={title} onChange={e=>setTitle(e.target.value)} style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:800,background:'none',border:'none',color:'var(--white)',outline:'none',width:'100%',marginBottom:32}} placeholder="Título del formulario" />
            {fields.map(field=>(
              <div key={field.id} className={`builder-field ${selected===field.id?'selected':''}`} onClick={()=>setSelected(field.id)}>
                <span style={{color:'#666',fontSize:18}}>⠿</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:15,marginBottom:2}}>{field.label}</div>
                  <div style={{fontSize:12,color:'#666'}}>{FIELD_TYPES.find(ft=>ft.type===field.type)?.label} {field.required&&<span style={{color:'var(--accent)'}}>*</span>}</div>
                </div>
                <button onClick={e=>{e.stopPropagation();removeField(field.id)}} style={{background:'none',border:'none',color:'#666',fontSize:18,cursor:'pointer'}}>×</button>
              </div>
            ))}
            <button className="add-field-btn" onClick={()=>addField('text')}>+ Agregar campo</button>
            <div style={{marginTop:32,padding:20,background:'var(--gray2)',borderRadius:12,border:'1px solid #2a2a2a'}}>
              <button className="btn-accent" style={{width:'100%',padding:'14px',borderRadius:10,fontSize:15}}>Enviar formulario</button>
              <p style={{textAlign:'center',fontSize:12,color:'#666',marginTop:10}}>Vista previa del botón de envío</p>
            </div>
          </div>
        </div>

        <div style={{background:'var(--gray1)',borderLeft:'1px solid #1f1f1f',padding:20,overflowY:'auto'}}>
          {sel ? (
            <>
              <div style={{fontSize:11,letterSpacing:1,textTransform:'uppercase',color:'#666',fontWeight:600,marginBottom:16}}>Editar campo</div>
              <div className="form-group">
                <label className="form-label">ETIQUETA</label>
                <input className="form-input" value={sel.label} onChange={e=>updateField(sel.id,{label:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">PLACEHOLDER</label>
                <input className="form-input" value={sel.placeholder||''} onChange={e=>updateField(sel.id,{placeholder:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">TIPO</label>
                <select className="form-input" value={sel.type} onChange={e=>updateField(sel.id,{type:e.target.value as any})}>
                  {FIELD_TYPES.map(ft=><option key={ft.type} value={ft.type}>{ft.label}</option>)}
                </select>
              </div>
              {sel.options && (
                <div className="form-group">
                  <label className="form-label">OPCIONES (una por línea)</label>
                  <textarea className="form-input" value={sel.options.join('\n')} onChange={e=>updateField(sel.id,{options:e.target.value.split('\n')})} style={{minHeight:100}} />
                </div>
              )}
              <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',marginTop:8}}>
                <input type="checkbox" checked={sel.required} onChange={e=>updateField(sel.id,{required:e.target.checked})} />
                <span style={{fontSize:14,color:'#ccc'}}>Campo obligatorio</span>
              </label>
            </>
          ) : (
            <div style={{textAlign:'center',padding:'48px 16px'}}>
              <div style={{fontSize:32,marginBottom:12}}>←</div>
              <p style={{fontSize:14,color:'#666'}}>Haz clic en un campo para editarlo</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
