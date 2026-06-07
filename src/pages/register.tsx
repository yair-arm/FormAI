import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <>
      <Head><title>Crear cuenta — FormAI</title></Head>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
        <div style={{width:'100%',maxWidth:420}}>
          <div className="logo" style={{textAlign:'center',marginBottom:36,fontSize:22}}>Form<span>AI</span></div>
          <div className="card">
            <h1 style={{fontFamily:'var(--serif)',fontSize:24,fontWeight:800,letterSpacing:-.5,marginBottom:6}}>Crear cuenta gratis</h1>
            <p className="muted" style={{marginBottom:28}}>Sin tarjeta de crédito necesaria</p>
            {error && <div style={{background:'rgba(255,77,109,.1)',border:'1px solid rgba(255,77,109,.2)',borderRadius:10,padding:'12px 14px',fontSize:14,color:'#ff4d6d',marginBottom:20}}>{error}</div>}
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">NOMBRE</label>
                <input className="form-input" type="text" placeholder="Tu nombre" value={name} onChange={e=>setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input className="form-input" type="email" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">CONTRASEÑA</label>
                <input className="form-input" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} />
              </div>
              <button type="submit" className="btn-accent" style={{width:'100%',padding:'14px',borderRadius:10,fontSize:15,marginTop:8}} disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
              </button>
            </form>
            <p style={{textAlign:'center',marginTop:20,fontSize:14,color:'#888'}}>¿Ya tienes cuenta? <a href="/login" style={{color:'var(--accent)'}}>Entrar</a></p>
          </div>
        </div>
      </div>
    </>
  )
}
