import { useState } from 'react'
import Head from 'next/head'
import type { FormField } from '../../lib/supabase'

const MOCK_FORM = {
  id:'demo',title:'Formulario de contacto',description:'Completa este formulario y te contactaremos pronto.',
  fields:[
    {id:'1',type:'text',label:'Nombre completo',placeholder:'Tu nombre',required:true},
    {id:'2',type:'email',label:'Email',placeholder:'tu@email.com',required:true},
    {id:'3',type:'select',label:'Motivo de contacto',placeholder:'',required:true,options:['Ventas','Soporte','Alianzas','Otro']},
    {id:'4',type:'textarea',label:'Mensaje',placeholder:'Cuéntanos más...',required:false},
  ] as FormField[]
}

export default function PublicForm() {
  const [values, setValues] = useState<Record<string,any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})

  const validate = () => {
    const e: Record<string,string> = {}
    MOCK_FORM.fields.forEach(f=>{ if(f.required&&!values[f.id]) e[f.id]='Este campo es obligatorio' })
    setErrors(e); return Object.keys(e).length===0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); if(!validate()) return
    setSubmitting(true)
    await fetch('/api/submit-response',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({form_id:MOCK_FORM.id,data:values})}).catch(()=>{})
    await new Promise(r=>setTimeout(r,600))
    setSubmitted(true); setSubmitting(false)
  }

  const renderField = (field: FormField) => {
    const err = errors[field.id]
    const base = {width:'100%',background:'#111',border:`1px solid ${err?'#ff4d6d':'#2a2a2a'}`,borderRadius:10,padding:'12px 14px',fontSize:15,color:'var(--white)',fontFamily:'var(--body)',outline:'none'} as React.CSSProperties
    if(field.type==='textarea') return <textarea style={{...base,minHeight:100,resize:'vertical'}} placeholder={field.placeholder} value={values[field.id]||''} onChange={e=>setValues({...values,[field.id]:e.target.value})} />
    if(field.type==='select') return <select style={base} value={values[field.id]||''} onChange={e=>setValues({...values,[field.id]:e.target.value})}><option value="">Selecciona una opción</option>{field.options?.map(o=><option key={o} value={o}>{o}</option>)}</select>
    if(field.type==='radio') return <div style={{display:'flex',flexDirection:'column',gap:10}}>{field.options?.map(o=><label key={o} style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:15,color:'#ccc'}}><input type="radio" name={field.id} value={o} checked={values[field.id]===o} onChange={()=>setValues({...values,[field.id]:o})} />{o}</label>)}</div>
    return <input type={field.type} style={base} placeholder={field.placeholder} value={values[field.id]||''} onChange={e=>setValues({...values,[field.id]:e.target.value})} />
  }

  if(submitted) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{textAlign:'center',maxWidth:440}}>
        <div style={{fontSize:52,marginBottom:20}}>✦</div>
        <h1 style={{fontFamily:'var(--serif)',fontSize:32,fontWeight:800,letterSpacing:-1,marginBottom:12,color:'var(--accent)'}}>¡Enviado!</h1>
        <p style={{fontSize:17,color:'#888',lineHeight:1.7}}>Gracias por completar el formulario. Te contactaremos pronto.</p>
      </div>
    </div>
  )

  return (
    <>
      <Head><title>{MOCK_FORM.title} — FormAI</title></Head>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
        <div style={{width:'100%',maxWidth:560}}>
          <h1 style={{fontFamily:'var(--serif)',fontSize:32,fontWeight:800,letterSpacing:-1,marginBottom:8}}>{MOCK_FORM.title}</h1>
          <p style={{fontSize:16,color:'#888',lineHeight:1.7,marginBottom:32}}>{MOCK_FORM.description}</p>
          <div className="card">
            <form onSubmit={handleSubmit}>
              {MOCK_FORM.fields.map(field=>(
                <div key={field.id} style={{marginBottom:24}}>
                  <label style={{display:'block',fontSize:13,fontWeight:600,color:'#888',letterSpacing:.3,marginBottom:8}}>
                    {field.label.toUpperCase()}{field.required&&<span style={{color:'var(--accent)',marginLeft:4}}>*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.id]&&<div style={{fontSize:12,color:'#ff4d6d',marginTop:5}}>{errors[field.id]}</div>}
                </div>
              ))}
              <button type="submit" className="btn-accent" style={{width:'100%',padding:'15px',borderRadius:10,fontSize:16,marginTop:8}} disabled={submitting}>
                {submitting?'Enviando...':'Enviar →'}
              </button>
            </form>
          </div>
          <div style={{textAlign:'center',marginTop:16,fontSize:12,color:'#444'}}>Creado con <a href="/" style={{color:'var(--accent)'}}>FormAI</a></div>
        </div>
      </div>
    </>
  )
}
