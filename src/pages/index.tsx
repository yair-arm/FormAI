import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Landing() {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>FormAI — Formularios inteligentes con IA</title>
        <meta name="description" content="Crea formularios con IA, analiza respuestas al instante. Sin código. Gratis." />
      </Head>

      <nav className="nav">
        <div className="logo" style={{fontSize:20}}>Form<span>AI</span></div>
        <div style={{display:'flex',gap:24,fontSize:14,color:'#888'}}>
          <a href="#features">Características</a>
          <a href="#pricing">Precios</a>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button className="btn-ghost" style={{fontSize:14}} onClick={() => router.push('/login')}>Entrar</button>
          <button className="btn-accent" style={{fontSize:14}} onClick={() => router.push('/register')}>Empezar gratis</button>
        </div>
      </nav>

      <div className="hero-section">
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px)',backgroundSize:'60px 60px',pointerEvents:'none'}}/>
        <div style={{position:'absolute',top:'5%',left:'50%',transform:'translateX(-50%)',width:700,height:400,background:'radial-gradient(ellipse,rgba(0,229,160,.06) 0%,transparent 65%)',pointerEvents:'none'}}/>

        <div style={{display:'inline-flex',alignItems:'center',gap:8,border:'1px solid #2a2a2a',borderRadius:100,padding:'6px 16px',fontSize:13,color:'#888',marginBottom:36}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:'var(--accent)',display:'inline-block'}}/>
          Beta pública — gratis para siempre
        </div>

        <h1 className="hero-h1">Formularios que<br/>piensan <span className="accent">por ti</span></h1>
        <p style={{fontSize:19,color:'#888',maxWidth:520,lineHeight:1.7,marginBottom:40,fontWeight:300}}>
          Describe lo que necesitas. La IA crea el formulario, analiza respuestas y te da insights accionables. Sin código.
        </p>

        <div style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center'}}>
          <button className="btn-accent" style={{fontSize:16,padding:'15px 36px',borderRadius:100}} onClick={() => router.push('/register')}>
            Crear mi formulario gratis →
          </button>
          <button className="btn-ghost" style={{fontSize:16,padding:'15px 36px'}} onClick={() => router.push('/register')}>
            Ver demo
          </button>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:1,background:'#1a1a1a',border:'1px solid #1a1a1a',borderRadius:20,overflow:'hidden',maxWidth:640,width:'100%',marginTop:64}}>
          {[{num:'3 min',label:'tiempo promedio de creación'},{num:'+47%',label:'más tasa de completación'},{num:'$0',label:'para empezar hoy'}].map(s=>(
            <div key={s.label} style={{background:'var(--black)',padding:'26px 20px',textAlign:'center'}}>
              <div style={{fontFamily:'var(--serif)',fontSize:34,fontWeight:800,letterSpacing:-1,color:'var(--accent)'}}>{s.num}</div>
              <div style={{fontSize:12,color:'#888',marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" className="section">
        <div style={{fontSize:12,letterSpacing:2,textTransform:'uppercase',color:'var(--accent)',fontWeight:600,marginBottom:12}}>Características</div>
        <h2 style={{fontFamily:'var(--serif)',fontSize:44,fontWeight:800,letterSpacing:-1.5,marginBottom:40}}>Todo lo que necesitas</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:'#1a1a1a',border:'1px solid #1a1a1a',borderRadius:20,overflow:'hidden'}}>
          {[
            {icon:'✦',t:'Generación con IA',d:'Describe tu caso de uso. La IA crea campos, validaciones y lógica automáticamente.'},
            {icon:'◎',t:'Análisis semántico',d:'Agrupa respuestas, detecta sentimiento y extrae insights sin revisión manual.'},
            {icon:'⇄',t:'Integraciones',d:'Conecta con Google Sheets, Notion, Slack. Webhook para todo lo demás.'},
            {icon:'△',t:'Reportes automáticos',d:'Resúmenes diarios con tendencias y recomendaciones generadas por IA.'},
            {icon:'⊕',t:'Lógica condicional',d:'Muestra u oculta campos según respuestas anteriores. Flujos personalizados.'},
            {icon:'◈',t:'Seguro y privado',d:'Encriptación en tránsito y reposo. Tus datos son solo tuyos.'},
          ].map(f=>(
            <div key={f.t} style={{background:'var(--black)',padding:'32px 28px'}}>
              <div style={{width:42,height:42,borderRadius:12,background:'rgba(0,229,160,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,marginBottom:18}}>{f.icon}</div>
              <div style={{fontFamily:'var(--serif)',fontSize:17,fontWeight:700,marginBottom:8}}>{f.t}</div>
              <div style={{fontSize:14,color:'#888',lineHeight:1.7}}>{f.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" className="section">
        <div style={{fontSize:12,letterSpacing:2,textTransform:'uppercase',color:'var(--accent)',fontWeight:600,marginBottom:12}}>Precios</div>
        <h2 style={{fontFamily:'var(--serif)',fontSize:44,fontWeight:800,letterSpacing:-1.5,marginBottom:40}}>Empieza gratis. Escala cuando crezcas.</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20}}>
          {[
            {name:'Gratis',price:'0',period:'para siempre',popular:false,features:['3 formularios','100 respuestas/mes','Análisis básico','Exportar CSV'],cta:'Empezar gratis'},
            {name:'Pro',price:'29',period:'por mes',popular:true,features:['Formularios ilimitados','10,000 respuestas/mes','IA completa','Reportes automáticos','Integraciones ilimitadas'],cta:'Empezar con Pro'},
            {name:'Business',price:'99',period:'por mes',popular:false,features:['Todo lo del Pro','Respuestas ilimitadas','SSO','Soporte prioritario','SLA garantizado'],cta:'Contactar ventas'},
          ].map(p=>(
            <div key={p.name} style={{background:p.popular?'var(--white)':'var(--gray2)',border:p.popular?'none':'1px solid #2a2a2a',borderRadius:20,padding:36,position:'relative'}}>
              {p.popular&&<div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'var(--accent)',color:'var(--black)',fontSize:11,fontWeight:700,padding:'4px 14px',borderRadius:100,whiteSpace:'nowrap'}}>MÁS POPULAR</div>}
              <div style={{fontSize:13,letterSpacing:1,textTransform:'uppercase',fontWeight:600,color:p.popular?'#555':'#888',marginBottom:12}}>{p.name}</div>
              <div style={{fontFamily:'var(--serif)',fontSize:52,fontWeight:800,letterSpacing:-2,color:p.popular?'#0a0a0a':'var(--white)',marginBottom:4}}><sup style={{fontSize:22,verticalAlign:'top',marginTop:10}}>$</sup>{p.price}</div>
              <div style={{fontSize:13,color:p.popular?'#888':'#666',marginBottom:24}}>{p.period}</div>
              <ul style={{listStyle:'none',marginBottom:28}}>
                {p.features.map(f=>(
                  <li key={f} style={{fontSize:14,display:'flex',alignItems:'center',gap:8,color:p.popular?'#333':'#ccc',padding:'6px 0',borderBottom:`1px solid ${p.popular?'#eee':'#1a1a1a'}`}}>
                    <span style={{color:'var(--accent)',fontWeight:700}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={()=>router.push('/register')} style={{width:'100%',padding:'14px',borderRadius:100,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'var(--body)',border:'none',background:p.popular?'var(--black)':'#2a2a2a',color:'var(--white)'}}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:'60px 40px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{background:'var(--white)',borderRadius:28,padding:72,textAlign:'center'}}>
          <h2 style={{fontFamily:'var(--serif)',fontSize:52,fontWeight:800,letterSpacing:-2,color:'var(--black)',marginBottom:16}}>Tu primer formulario<br/>en 3 minutos.</h2>
          <p style={{fontSize:17,color:'#666',fontWeight:300,maxWidth:440,margin:'0 auto 36px'}}>Sin tarjeta de crédito. Sin código. Gratis para siempre.</p>
          <button className="btn-accent" style={{fontSize:17,padding:'17px 44px',borderRadius:100}} onClick={()=>router.push('/register')}>Crear cuenta gratis →</button>
        </div>
      </div>

      <footer style={{borderTop:'1px solid #1a1a1a',padding:'36px 40px',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13,color:'#888',maxWidth:1100,margin:'0 auto'}}>
        <div className="logo" style={{fontSize:17}}>Form<span>AI</span></div>
        <div>© 2025 FormAI — Hecho con IA</div>
      </footer>
    </>
  )
}
