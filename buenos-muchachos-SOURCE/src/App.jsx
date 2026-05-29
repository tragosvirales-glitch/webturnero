import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cntxzjjanaupwlzwdjpy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNudHh6amphbmF1cHdsendkanB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDMyNjAsImV4cCI6MjA5NTU3OTI2MH0.92WnUQ_j9xLVJGVpg0cx6c581GCx4g6v7RCZ3gfSXlg";
const RESEND_KEY = "re_4P1geKkt_ERNvJWJoYgTurAYJFxyjCdau";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PROFESIONALES = [
  { id:"lisandro",  nombre:"Lisandro", sucursal:"cervantes", sucursalNombre:"Cervantes 170", email:"nachogamelay89@gmail.com",   pass:"1234", dias:[2,3,4,5,6], tel:"5493436237310", waKey:"3095890" },
  { id:"deb_cerv",  nombre:"Debora",   sucursal:"cervantes", sucursalNombre:"Cervantes 170", email:"debora@buenosmuchachos.com", pass:"1234", dias:[2,4,6],     tel:"5493436237310", waKey:"3095890" },
  { id:"javier",    nombre:"Javier",   sucursal:"alameda",   sucursalNombre:"Alameda 507",   email:"javier@buenosmuchachos.com", pass:"1234", dias:[2,3,4,5,6], tel:"5493436237310", waKey:"3095890" },
  { id:"axel",      nombre:"Axel",     sucursal:"alameda",   sucursalNombre:"Alameda 507",   email:"axel@buenosmuchachos.com",   pass:"1234", dias:[2,3,4,5,6], tel:"5493436237310", waKey:"3095890" },
  { id:"deb_alam",  nombre:"Debora",   sucursal:"alameda",   sucursalNombre:"Alameda 507",   email:"debora@buenosmuchachos.com", pass:"1234", dias:[3,5],       tel:"5493436237310", waKey:"3095890" },
];

const SUCURSALES = [
  { id:"cervantes", nombre:"Cervantes 170" },
  { id:"alameda",   nombre:"Alameda 507" },
];

const SERVICIOS = [
  { id:"corte_adulto",  nombre:"Corte Cabello Adulto",       precio:19000, cat:"DESTACADO" },
  { id:"barba",         nombre:"Barba",                      precio:19000, cat:"BARBERÍA" },
  { id:"barba_vapor",   nombre:"Barba + Afeitado con Vapor", precio:19500, cat:"BARBERÍA", desc:"Arreglo + afeitado a vapor + depilación + limpieza y serum facial" },
  { id:"barba_premium", nombre:"Barba Premium",              precio:21000, cat:"BARBERÍA", desc:"Arreglo + afeitado a vapor + depilación + limpieza y serum facial" },
  { id:"combo_barba",   nombre:"Corte + Barba",              precio:26800, cat:"COMBOS" },
  { id:"combo_vapor",   nombre:"Corte + Barba con Vapor",    precio:28900, cat:"COMBOS" },
  { id:"combo_premium", nombre:"Combo Premium",              precio:31500, cat:"COMBOS", desc:"Corte + barba con vapor + limpieza, depilado y serum facial" },
  { id:"corte_premium", nombre:"Corte Premium",              precio:21000, cat:"CORTE" },
  { id:"corte_nino",    nombre:"Corte Cabello Niño",         precio:19000, cat:"PELUQUERÍA" },
];

const MANANA = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00"];
const TARDE  = ["15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00"];
const HORARIOS = [...MANANA,...TARDE];
const DS    = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const fmtPrecio = n => "$" + n.toLocaleString("es-AR");
const fmtFecha  = iso => { if(!iso) return ""; const d=new Date(iso+"T12:00:00"); return `${DS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`; };
const todayISO  = () => new Date().toISOString().split("T")[0];

// Hora actual en HH:MM
const nowHHMM = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
};

// Devuelve true si el horario ya pasó para la fecha dada
const horarioPasado = (fechaISO, hora) => {
  const hoy = todayISO();
  if (fechaISO < hoy) return true;
  if (fechaISO > hoy) return false;
  return hora <= nowHHMM();
};

// Devuelve true si el turno puede marcarse completado (pasó 1 min de la hora)
const puedeCompletar = (fechaISO, hora) => {
  const hoy = todayISO();
  if (fechaISO < hoy) return true;
  if (fechaISO > hoy) return false;
  const [hh, mm] = hora.split(":").map(Number);
  const turnoMin = hh * 60 + mm;
  const n = new Date();
  const ahoraMin = n.getHours() * 60 + n.getMinutes();
  return ahoraMin >= turnoMin + 1;
};

/* ── CSS ─────────────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
    html,body{background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;color:#fff;min-height:100vh;overscroll-behavior:none;}
    ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#111;} ::-webkit-scrollbar-thumb{background:#D32F2F;border-radius:2px;}
    input,select{outline:none;-webkit-appearance:none;appearance:none;} input::placeholder{color:#444;}
    input[type=date]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:.5;}
    button{-webkit-appearance:none;appearance:none;cursor:pointer;}
    button:active{transform:scale(0.97);}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
    .fade{animation:fadeUp .35s ease both;}
    .dot{width:8px;height:8px;border-radius:50%;background:#D32F2F;animation:pulse 1.4s infinite;}
  `}</style>
);

/* ── INPUT ───────────────────────────────────────────────────────────── */
const Inp = ({label,value,onChange,placeholder,type="text",onKeyDown}) => (
  <div style={{marginBottom:14}}>
    <label style={{display:"block",fontSize:11,color:"#666",letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown}
      style={{width:"100%",background:"#111",border:"1px solid #2a2a2a",borderRadius:10,padding:"13px 16px",color:"#fff",fontSize:14,transition:"border .2s"}}
      onFocus={e=>e.target.style.borderColor="#D32F2F"} onBlur={e=>e.target.style.borderColor="#2a2a2a"}/>
  </div>
);

/* ── STEP BAR ────────────────────────────────────────────────────────── */
const STEPS = ["Profesional","Servicio","Fecha","Hora","Confirmar"];
function StepBar({paso}) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28}}>
      {STEPS.map((s,i) => {
        const done=i+1<paso, active=i+1===paso;
        return (
          <div key={s} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:48}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:done?"#D32F2F":"transparent",border:`1.5px solid ${done||active?"#D32F2F":"#2a2a2a"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:done?"#fff":active?"#D32F2F":"#333",transition:"all .3s"}}>
                {done?"✓":i+1}
              </div>
              <span style={{fontSize:9,marginTop:3,letterSpacing:.5,color:active?"#D32F2F":done?"#555":"#2a2a2a",textTransform:"uppercase"}}>{s}</span>
            </div>
            {i<STEPS.length-1&&<div style={{width:16,height:1,background:done?"#D32F2F":"#1e1e1e",marginBottom:14,transition:"all .3s"}}/>}
          </div>
        );
      })}
    </div>
  );
}

/* ── CALENDARIO ──────────────────────────────────────────────────────── */
function Calendario({prof, fecha, onSelect}) {
  const hoy = new Date();
  const [mv, setMv] = useState({y:hoy.getFullYear(), m:hoy.getMonth()});
  const diasEnMes = new Date(mv.y, mv.m+1, 0).getDate();
  const start = new Date(mv.y, mv.m, 1).getDay();
  const puedePrev = mv.y > hoy.getFullYear() || mv.m > hoy.getMonth();

  const iso = (d) => `${mv.y}-${String(mv.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const isDisp = (d) => {
    const isoD = iso(d);
    const dt = new Date(mv.y, mv.m, d);
    if (!prof.dias.includes(dt.getDay())) return false;
    // Solo bloquear días estrictamente anteriores a hoy
    const hoy = new Date();
    const diaCalendario = new Date(mv.y, mv.m, d);
    const hoyMediodia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    if (diaCalendario < hoyMediodia) return false;
    // Si es hoy, disponible si hay al menos una hora futura
    if (isoD === todayISO()) {
      return HORARIOS.some(h => !horarioPasado(isoD, h));
    }
    return true;
  };

  return (
    <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:"1px solid #1a1a1a"}}>
        <button onClick={()=>{if(!puedePrev)return;const d=new Date(mv.y,mv.m-1,1);setMv({y:d.getFullYear(),m:d.getMonth()});}}
          style={{background:"transparent",border:"1px solid #2a2a2a",borderRadius:8,width:34,height:34,color:puedePrev?"#fff":"#2a2a2a",cursor:puedePrev?"pointer":"default",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <span style={{fontWeight:700,fontSize:15,letterSpacing:.5}}>{MESES[mv.m]} {mv.y}</span>
        <button onClick={()=>{const d=new Date(mv.y,mv.m+1,1);setMv({y:d.getFullYear(),m:d.getMonth()});}}
          style={{background:"transparent",border:"1px solid #2a2a2a",borderRadius:8,width:34,height:34,color:"#fff",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"10px 6px 8px"}}>
        {DS.map(d=><div key={d} style={{textAlign:"center",padding:"4px 0",fontSize:10,color:"#444",fontWeight:700,letterSpacing:.5}}>{d.toUpperCase()}</div>)}
        {Array(start).fill(null).map((_,i)=><div key={"e"+i}/>)}
        {Array(diasEnMes).fill(null).map((_,i)=>{
          const d=i+1, isoD=iso(d), disp=isDisp(d), sel=fecha===isoD, esHoy=isoD===todayISO();
          return (
            <div key={d} onClick={()=>disp&&onSelect(isoD)}
              style={{textAlign:"center",padding:"8px 2px",fontSize:13,cursor:disp?"pointer":"default",color:sel?"#fff":disp?"#e0e0e0":"#2a2a2a",background:sel?"#D32F2F":"transparent",borderRadius:8,fontWeight:sel||esHoy?700:400,position:"relative",transition:"background .15s",margin:"1px",minHeight:34,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {d}
              {esHoy&&!sel&&<div style={{width:3,height:3,borderRadius:"50%",background:"#D32F2F",position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)"}}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ── WHATSAPP CALLMEBOT ──────────────────────────────────────────────── */
const enviarWhatsApp = async (prof, turno, serv, fmtFechaStr) => {
  try {
    const mensaje = `✂️ *BUENOS MUCHACHOS*\nNuevo turno reservado:\n\n👤 Cliente: ${turno.cliente_nombre}\n💈 Servicio: ${serv.nombre}\n📅 Fecha: ${fmtFechaStr}\n🕐 Hora: ${turno.hora}hs\n📍 Sucursal: ${prof.sucursalNombre}${turno.cliente_telefono ? "\n📞 Tel: " + turno.cliente_telefono : ""}`;
    await fetch("/api/notificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telefono: prof.tel, apiKey: prof.waKey, mensaje })
    });
  } catch(e) { console.error("WA error:", e); }
};

/* ── RESERVA ─────────────────────────────────────────────────────────── */
function Reserva() {
  const [paso, setPaso] = useState(1);
  const [prof, setProf]   = useState(null);
  const [serv, setServ]   = useState(null);
  const [fecha, setFecha] = useState(null);
  const [hora, setHora]   = useState(null);
  const [ocupadas, setOcupadas] = useState([]);
  const [cli, setCli] = useState({nombre:"",email:"",tel:""});
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  useEffect(()=>{
    if(prof&&fecha){
      sb.from("turnos").select("hora,estado").eq("profesional_id",prof.id).eq("fecha",fecha)
        .then(({data})=>{
          const ocup = (data||[]).filter(t=>t.estado!=="cancelado").map(t=>t.hora);
          setOcupadas(ocup);
        });
    }
  },[prof,fecha]);

  const confirmar = async () => {
    if(!cli.nombre.trim()){setErr("Ingresá tu nombre para continuar");return;}
    if(!cli.tel.trim()){setErr("Ingresá tu teléfono para continuar");return;}
    setLoading(true); setErr("");
    const t = {
      cliente_nombre:cli.nombre, cliente_email:cli.email||null, cliente_telefono:cli.tel||null,
      sucursal_id:prof.sucursal, profesional_id:prof.id, profesional_nombre:prof.nombre,
      servicio_id:serv.id, servicio_nombre:serv.nombre, precio:serv.precio, precio_original:serv.precio,
      fecha, hora, estado:"pendiente"
    };
    const {error} = await sb.from("turnos").insert(t);
    if(error){console.error(error);setErr("Error al guardar. Intentá de nuevo.");setLoading(false);return;}
    // WhatsApp al peluquero
    await enviarWhatsApp(prof, t, serv, fmtFecha(fecha));

    try {
      await fetch("https://api.resend.com/emails",{
        method:"POST",
        headers:{"Authorization":`Bearer ${RESEND_KEY}`,"Content-Type":"application/json"},
        body:JSON.stringify({
          from:"Buenos Muchachos <onboarding@resend.dev>",
          to:["nachogamelay89@gmail.com"],
          reply_to:prof.email,
          subject:`✂️ Nuevo turno — ${cli.nombre} a las ${hora}hs`,
          html:`<div style="font-family:Arial,sans-serif;background:#0a0a0a;color:#fff;max-width:500px;margin:0 auto;border-radius:16px;overflow:hidden">
            <div style="background:#D32F2F;padding:24px;text-align:center">
              <p style="margin:0;font-size:11px;letter-spacing:3px;color:#ffaaaa;text-transform:uppercase">Buenos Muchachos</p>
              <h1 style="margin:6px 0 0;font-size:22px;letter-spacing:2px">Nuevo turno</h1>
            </div>
            <div style="padding:28px">
              <p style="color:#888;font-size:14px;margin:0 0 20px">Hola <strong style="color:#fff">${prof.nombre}</strong>, te llegó un nuevo turno:</p>
              <div style="background:#111;border-radius:12px;padding:20px;margin-bottom:16px">
                <table style="width:100%;border-collapse:collapse">
                  <tr><td style="padding:8px 0;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Cliente</td><td style="padding:8px 0;font-weight:700;font-size:15px;text-align:right">${cli.nombre}</td></tr>
                  ${cli.tel?`<tr><td style="padding:8px 0;color:#666;font-size:12px">Teléfono</td><td style="padding:8px 0;text-align:right">${cli.tel}</td></tr>`:""}
                  <tr><td style="padding:8px 0;color:#666;font-size:12px">Servicio</td><td style="padding:8px 0;text-align:right">${serv.nombre}</td></tr>
                  <tr><td style="padding:8px 0;color:#666;font-size:12px">Fecha</td><td style="padding:8px 0;text-align:right">${fmtFecha(fecha)}</td></tr>
                  <tr><td style="padding:8px 0;color:#666;font-size:12px">Hora</td><td style="padding:8px 0;text-align:right;font-size:28px;font-weight:900;color:#D32F2F;line-height:1">${hora}hs</td></tr>
                  <tr><td style="padding:8px 0;color:#666;font-size:12px">Sucursal</td><td style="padding:8px 0;text-align:right">${prof.sucursalNombre}</td></tr>
                </table>
              </div>
              <div style="background:#111;border-radius:12px;padding:16px;text-align:center">
                <p style="color:#666;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px">Precio</p>
                <p style="font-size:22px;font-weight:700;margin:0">${fmtPrecio(serv.precio)}</p>
                <p style="color:#4CAF50;font-size:12px;margin:4px 0 0">Pago presencial · 10% OFF en efectivo</p>
              </div>
            </div>
          </div>`
        })
      });
    } catch(e){console.error(e);}
    setLoading(false); setOk(true);
  };

  if(ok) return (
    <div className="fade" style={{textAlign:"center",padding:"40px 0"}}>
      <div style={{width:72,height:72,borderRadius:"50%",background:"#0d2a0d",border:"2px solid #4CAF50",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 20px"}}>✓</div>
      <h2 style={{fontSize:22,fontWeight:900,margin:"0 0 6px"}}>¡Turno confirmado!</h2>
      <p style={{color:"#666",margin:"0 0 28px",fontSize:14}}>Te esperamos, {cli.nombre}</p>
      <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:16,padding:20,maxWidth:320,margin:"0 auto 28px",textAlign:"left"}}>
        {[["Sucursal",prof.sucursalNombre],["Profesional",prof.nombre],["Servicio",serv.nombre],["Fecha",fmtFecha(fecha)],["Hora",hora+"hs"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #1a1a1a"}}>
            <span style={{color:"#555",fontSize:13}}>{k}</span><span style={{fontSize:13}}>{v}</span>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0"}}>
          <span style={{color:"#555",fontSize:13}}>Precio</span>
          <div style={{textAlign:"right"}}>
            <span style={{fontSize:15,fontWeight:700}}>{fmtPrecio(serv.precio)}</span>
            <p style={{color:"#4CAF50",fontSize:11,margin:"2px 0 0"}}>10% OFF en efectivo</p>
          </div>
        </div>
      </div>
      <button onClick={()=>window.location.reload()} style={{background:"#D32F2F",color:"#fff",border:"none",borderRadius:12,padding:"14px 32px",fontWeight:700,fontSize:14,cursor:"pointer"}}>Reservar otro turno</button>
    </div>
  );

  const cats = [...new Set(SERVICIOS.map(s=>s.cat))];

  return (
    <div className="fade">
      <StepBar paso={paso}/>

      {paso===1&&(
        <div>
          <h2 style={{fontSize:19,fontWeight:900,marginBottom:4,textAlign:"center"}}>¿Con quién querés cortarte?</h2>
          <p style={{color:"#555",textAlign:"center",fontSize:13,marginBottom:20}}>Elegí tu profesional y sucursal</p>
          {SUCURSALES.map(suc=>(
            <div key={suc.id} style={{marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:4,height:14,background:"#D32F2F",borderRadius:2}}/>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:"#D32F2F",textTransform:"uppercase"}}>{suc.nombre}</span>
              </div>
              {PROFESIONALES.filter(p=>p.sucursal===suc.id).map(p=>{
                const sel=prof?.id===p.id;
                return (
                  <div key={p.id} onClick={()=>{setProf(p);setFecha(null);setHora(null);}}
                    style={{background:sel?"#140000":"#0f0f0f",border:`1px solid ${sel?"#D32F2F":"#1e1e1e"}`,borderRadius:12,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:7,transition:"all .2s"}}>
                    <div style={{width:42,height:42,borderRadius:"50%",background:sel?"#D32F2F":"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:sel?"#fff":"#D32F2F",flexShrink:0,transition:"all .2s"}}>{p.nombre[0]}</div>
                    <div style={{flex:1}}>
                      <p style={{fontWeight:700,fontSize:14,margin:"0 0 2px"}}>{p.nombre}</p>
                      <p style={{fontSize:11,color:"#555",margin:0}}>{p.dias.map(d=>DS[d]).join(" · ")}</p>
                    </div>
                    <div style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${sel?"#D32F2F":"#333"}`,background:sel?"#D32F2F":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>{sel&&"✓"}</div>
                  </div>
                );
              })}
            </div>
          ))}
          <button onClick={()=>{if(prof)setPaso(2);}} style={{width:"100%",background:prof?"#D32F2F":"#1a1a1a",color:prof?"#fff":"#444",border:"none",borderRadius:12,padding:"15px",fontWeight:700,fontSize:14,cursor:prof?"pointer":"default",transition:"all .2s",marginTop:4}}>Continuar →</button>
        </div>
      )}

      {paso===2&&(
        <div>
          <h2 style={{fontSize:19,fontWeight:900,marginBottom:4,textAlign:"center"}}>¿Qué servicio?</h2>
          <div style={{background:"#0a1f0a",border:"1px solid #1a3a1a",borderRadius:10,padding:"10px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
            <span>💚</span>
            <p style={{fontSize:12,color:"#4CAF50",margin:0}}>10% de descuento abonando en efectivo</p>
          </div>
          {cats.map(cat=>(
            <div key={cat} style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                <div style={{width:4,height:13,background:"#D32F2F",borderRadius:2}}/>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#D32F2F"}}>{cat}</span>
              </div>
              {SERVICIOS.filter(s=>s.cat===cat).map(s=>{
                const sel=serv?.id===s.id;
                return (
                  <div key={s.id} onClick={()=>setServ(s)}
                    style={{background:sel?"#140000":"#0f0f0f",border:`1px solid ${sel?"#D32F2F":"#1e1e1e"}`,borderRadius:11,padding:"11px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,marginBottom:6,transition:"all .2s"}}>
                    <div style={{flex:1}}>
                      <p style={{fontWeight:600,fontSize:13,margin:"0 0 2px"}}>{s.nombre}</p>
                      {s.desc&&<p style={{fontSize:11,color:"#555",margin:0,lineHeight:1.4}}>{s.desc}</p>}
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <p style={{fontWeight:700,fontSize:14,margin:0}}>{fmtPrecio(s.precio)}</p>
                      <p style={{fontSize:10,color:"#4CAF50",margin:"2px 0 0"}}>Ef: {fmtPrecio(Math.round(s.precio*.9))}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:6}}>
            <button onClick={()=>setPaso(1)} style={{background:"#0f0f0f",color:"#666",border:"1px solid #1e1e1e",borderRadius:12,padding:"15px 18px",cursor:"pointer",fontSize:14}}>←</button>
            <button onClick={()=>{if(serv)setPaso(3);}} style={{flex:1,background:serv?"#D32F2F":"#1a1a1a",color:serv?"#fff":"#444",border:"none",borderRadius:12,padding:"15px",fontWeight:700,fontSize:14,cursor:serv?"pointer":"default",transition:"all .2s"}}>Continuar →</button>
          </div>
        </div>
      )}

      {paso===3&&(
        <div>
          <h2 style={{fontSize:19,fontWeight:900,marginBottom:4,textAlign:"center"}}>¿Qué día?</h2>
          <p style={{color:"#555",textAlign:"center",fontSize:13,marginBottom:16}}>{prof.nombre} · {prof.sucursalNombre}</p>
          <Calendario prof={prof} fecha={fecha} onSelect={(iso)=>{setFecha(iso);setHora(null);}}/>
          {fecha&&<p style={{textAlign:"center",color:"#D32F2F",fontSize:13,marginTop:10,fontWeight:600}}>{fmtFecha(fecha)}</p>}
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={()=>setPaso(2)} style={{background:"#0f0f0f",color:"#666",border:"1px solid #1e1e1e",borderRadius:12,padding:"15px 18px",cursor:"pointer",fontSize:14}}>←</button>
            <button onClick={()=>{if(fecha)setPaso(4);}} style={{flex:1,background:fecha?"#D32F2F":"#1a1a1a",color:fecha?"#fff":"#444",border:"none",borderRadius:12,padding:"15px",fontWeight:700,fontSize:14,cursor:fecha?"pointer":"default",transition:"all .2s"}}>Continuar →</button>
          </div>
        </div>
      )}

      {paso===4&&(
        <div>
          <h2 style={{fontSize:19,fontWeight:900,marginBottom:4,textAlign:"center"}}>¿A qué hora?</h2>
          <p style={{color:"#555",textAlign:"center",fontSize:13,marginBottom:20}}>{fmtFecha(fecha)} · {prof.nombre}</p>
          {[["MAÑANA",MANANA],["TARDE",TARDE]].map(([label,hs])=>(
            <div key={label} style={{marginBottom:18}}>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#444",marginBottom:8}}>{label}</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
                {hs.map(h=>{
                  const pasado = horarioPasado(fecha, h);
                  const ocup = ocupadas.includes(h);
                  const noDisp = pasado || ocup;
                  const sel = hora===h;
                  return (
                    <div key={h} onClick={()=>!noDisp&&setHora(h)}
                      style={{background:noDisp?"#080808":sel?"#D32F2F":"#0f0f0f",border:`1px solid ${noDisp?"#111":sel?"#D32F2F":"#1e1e1e"}`,borderRadius:10,padding:"11px 4px",cursor:noDisp?"not-allowed":"pointer",textAlign:"center",opacity:noDisp?.3:1,transition:"all .15s"}}>
                      <p style={{margin:0,fontSize:12,fontWeight:sel?700:400,color:noDisp?"#222":"#fff"}}>{h}</p>
                      {ocup&&!pasado&&<p style={{margin:"2px 0 0",fontSize:8,color:"#333"}}>ocupado</p>}
                      {pasado&&<p style={{margin:"2px 0 0",fontSize:8,color:"#333"}}>pasado</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setPaso(3)} style={{background:"#0f0f0f",color:"#666",border:"1px solid #1e1e1e",borderRadius:12,padding:"15px 18px",cursor:"pointer",fontSize:14}}>←</button>
            <button onClick={()=>{if(hora)setPaso(5);}} style={{flex:1,background:hora?"#D32F2F":"#1a1a1a",color:hora?"#fff":"#444",border:"none",borderRadius:12,padding:"15px",fontWeight:700,fontSize:14,cursor:hora?"pointer":"default",transition:"all .2s"}}>Continuar →</button>
          </div>
        </div>
      )}

      {paso===5&&(
        <div>
          <h2 style={{fontSize:19,fontWeight:900,marginBottom:4,textAlign:"center"}}>Tus datos</h2>
          <p style={{color:"#555",textAlign:"center",fontSize:13,marginBottom:20}}>Casi listo, completá tu información</p>
          <Inp label="Nombre y apellido *" value={cli.nombre} onChange={e=>setCli({...cli,nombre:e.target.value})} placeholder="Juan García"/>
          <Inp label="Email (opcional)" value={cli.email} onChange={e=>setCli({...cli,email:e.target.value})} placeholder="juan@email.com"/>
          <Inp label="Teléfono *" value={cli.tel} onChange={e=>setCli({...cli,tel:e.target.value})} placeholder="11 1234-5678"/>
          <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:14,padding:16,marginBottom:14,marginTop:2}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#444",marginBottom:10}}>RESUMEN</p>
            {[["Sucursal",prof.sucursalNombre],["Profesional",prof.nombre],["Servicio",serv.nombre],["Fecha",fmtFecha(fecha)],["Hora",hora+"hs"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #141414"}}>
                <span style={{color:"#555",fontSize:12}}>{k}</span><span style={{fontSize:12}}>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 0"}}>
              <span style={{color:"#555",fontSize:12}}>Precio</span>
              <div style={{textAlign:"right"}}>
                <span style={{fontWeight:700,fontSize:15}}>{fmtPrecio(serv.precio)}</span>
                <p style={{color:"#4CAF50",fontSize:10,margin:"2px 0 0"}}>Pago presencial · 10% OFF efectivo</p>
              </div>
            </div>
          </div>
          {err&&<div style={{background:"#1a0000",border:"1px solid #D32F2F44",borderRadius:10,padding:"10px 14px",marginBottom:10}}><p style={{color:"#ff6b6b",fontSize:13,margin:0}}>{err}</p></div>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setPaso(4)} style={{background:"#0f0f0f",color:"#666",border:"1px solid #1e1e1e",borderRadius:12,padding:"15px 18px",cursor:"pointer",fontSize:14}}>←</button>
            <button onClick={confirmar} disabled={loading} style={{flex:1,background:loading?"#1a1a1a":"#D32F2F",color:"#fff",border:"none",borderRadius:12,padding:"15px",fontWeight:700,fontSize:14,cursor:loading?"default":"pointer",transition:"all .2s"}}>
              {loading?"Confirmando...":"✓ Confirmar turno"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── LOGIN ───────────────────────────────────────────────────────────── */
function Login({onLogin}) {
  const [usuario, setUsuario] = useState("");
  const [pass, setPass]       = useState("");
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const intentar = () => {
    const u = usuario.trim();
    const pw = pass.trim();
    if(!u||!pw) return;
    setLoading(true); setErr("");
    if(u==="admin"&&pw==="admin1234"){onLogin("admin",null);return;}
    const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    const p = PROFESIONALES.find(p=>norm(p.nombre)===norm(u)&&p.pass===pw);
    if(p){onLogin("peluquero",p);return;}
    setErr("Usuario o contraseña incorrectos");
    setLoading(false);
  };

  const onKey = e => { if(e.key==="Enter") intentar(); };

  return (
    <div className="fade" style={{maxWidth:340,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <p style={{fontSize:10,letterSpacing:3,color:"#444",textTransform:"uppercase",marginBottom:6}}>Acceso profesionales</p>
        <h2 style={{fontSize:19,fontWeight:900,margin:0}}>Iniciar sesión</h2>
      </div>
      <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:16,padding:22}}>
        <Inp label="Usuario" value={usuario} onChange={e=>setUsuario(e.target.value)} placeholder="Nombre" onKeyDown={onKey}/>
        <Inp label="Contraseña" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••" type="password" onKeyDown={onKey}/>
        {err&&<div style={{background:"#1a0000",border:"1px solid #D32F2F44",borderRadius:10,padding:"10px 14px",marginBottom:12}}><p style={{color:"#ff6b6b",fontSize:13,margin:0}}>{err}</p></div>}
        <button onClick={intentar} disabled={loading} style={{width:"100%",background:loading?"#1a1a1a":"#D32F2F",color:"#fff",border:"none",borderRadius:10,padding:"14px",fontWeight:700,fontSize:14,cursor:"pointer",marginTop:2,transition:"all .2s"}}>
          {loading?"Verificando...":"Ingresar →"}
        </button>
      </div>
    </div>
  );
}

/* ── PANEL PELUQUERO ─────────────────────────────────────────────────── */
function PanelPeluquero({prof,onLogout}) {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(todayISO());
  const [tick, setTick] = useState(0);

  // Tick cada 30 seg para re-evaluar puedeCompletar
  useEffect(()=>{
    const iv = setInterval(()=>setTick(t=>t+1), 30000);
    return ()=>clearInterval(iv);
  },[]);

  const cargar = async () => {
    setLoading(true);
    const {data}=await sb.from("turnos").select("*").eq("profesional_id",prof.id).eq("fecha",fecha).order("hora");
    setTurnos(data||[]); setLoading(false);
  };

  useEffect(()=>{cargar();},[prof.id,fecha]);
  useEffect(()=>{
    const ch=sb.channel("prof-"+prof.id)
      .on("postgres_changes",{event:"*",schema:"public",table:"turnos",filter:`profesional_id=eq.${prof.id}`},()=>cargar())
      .subscribe();
    return ()=>sb.removeChannel(ch);
  },[prof.id]);

  const cambiar = async(id, estado) => {
    await sb.from("turnos").update({estado}).eq("id",id);
    cargar();
  };

  const pendientes = turnos.filter(t=>t.estado==="pendiente").length;

  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"#D32F2F",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:900,color:"#fff",flexShrink:0}}>{prof.nombre[0]}</div>
          <div>
            <h2 style={{fontSize:16,fontWeight:900,margin:"0 0 1px"}}>{prof.nombre}</h2>
            <p style={{fontSize:11,color:"#555",margin:0}}>{prof.sucursalNombre}</p>
          </div>
        </div>
        <button onClick={onLogout} style={{background:"transparent",border:"1px solid #1e1e1e",borderRadius:10,color:"#555",padding:"7px 12px",cursor:"pointer",fontSize:12}}>Salir</button>
      </div>

      {pendientes>0&&(
        <div style={{background:"#140000",border:"1px solid #D32F2F44",borderRadius:11,padding:"11px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <div className="dot"/>
          <p style={{fontSize:13,color:"#fff",margin:0}}><strong>{pendientes} turno{pendientes>1?"s":""} pendiente{pendientes>1?"s":""}</strong> para hoy</p>
        </div>
      )}

      <div style={{marginBottom:18}}>
        <p style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#444",marginBottom:7}}>VER DÍA</p>
        <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)}
          style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:"10px 14px",color:"#fff",fontSize:13,cursor:"pointer",width:"100%"}}/>
      </div>

      {loading?(
        <div style={{textAlign:"center",padding:36}}><p style={{color:"#444"}}>Cargando...</p></div>
      ):turnos.length===0?(
        <div style={{textAlign:"center",padding:36}}>
          <p style={{fontSize:30,marginBottom:8}}>📭</p>
          <p style={{color:"#444",fontSize:14}}>Sin turnos para {fmtFecha(fecha)}</p>
        </div>
      ):(
        <div style={{display:"grid",gap:10}}>
          {turnos.map(t=>{
            const puede = puedeCompletar(t.fecha, t.hora);
            return (
              <div key={t.id} style={{background:"#0f0f0f",border:`1px solid ${t.estado==="completado"?"#1a3a1a":t.estado==="cancelado"?"#2a0000":"#1e1e1e"}`,borderRadius:13,padding:15}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                      <p style={{fontWeight:700,fontSize:15,margin:0}}>{t.cliente_nombre}</p>
                      <span style={{fontSize:9,padding:"2px 7px",borderRadius:20,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",background:t.estado==="completado"?"#0d2a0d":t.estado==="cancelado"?"#1a0000":"#1a1400",color:t.estado==="completado"?"#4CAF50":t.estado==="cancelado"?"#f44336":"#FFD700"}}>
                        {t.estado}
                      </span>
                    </div>
                    {t.cliente_telefono&&<p style={{fontSize:12,color:"#555",margin:"0 0 3px"}}>📞 {t.cliente_telefono}</p>}
                    <p style={{fontSize:13,color:"#bbb",margin:"0 0 2px"}}>{t.servicio_nombre}</p>
                    <p style={{fontSize:12,color:"#555",margin:0}}>{fmtPrecio(t.precio)}</p>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,marginLeft:14}}>
                    <p style={{fontSize:24,fontWeight:900,color:"#D32F2F",margin:"0 0 1px",lineHeight:1}}>{t.hora}</p>
                    <p style={{fontSize:10,color:"#444",margin:0}}>hs</p>
                  </div>
                </div>

                {t.estado==="pendiente"&&(
                  <div style={{display:"grid",gap:7}}>
                    {/* Acciones */}
                    <div style={{display:"flex",gap:7}}>
                      <button onClick={()=>puede&&cambiar(t.id,"completado")}
                        style={{flex:1,background:puede?"#0d2a0d":"#0a0a0a",border:`1px solid ${puede?"#4CAF5066":"#1a1a1a"}`,borderRadius:9,color:puede?"#4CAF50":"#333",padding:"9px",fontSize:12,cursor:puede?"pointer":"not-allowed",fontWeight:700,transition:"all .2s"}}>
                        {puede?"✓ Completado":"⏳ Esperar"}
                      </button>
                      <button onClick={()=>cambiar(t.id,"cancelado")}
                        style={{flex:1,background:"#1a0000",border:"1px solid #D32F2F44",borderRadius:9,color:"#D32F2F",padding:"9px",fontSize:12,cursor:"pointer",fontWeight:700}}>
                        ✕ Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── PANEL ADMIN ─────────────────────────────────────────────────────── */
function PanelAdmin({onLogout}) {
  const [turnos, setTurnos] = useState([]);
  const [f, setF] = useState({fecha:todayISO(), prof:"", suc:""});
  const [showBorrar, setShowBorrar] = useState(false);
  const [passAdmin, setPassAdmin] = useState("");
  const [borrandoMsg, setBorrandoMsg] = useState("");

  const cargar = async()=>{
    let q=sb.from("turnos").select("*").order("fecha").order("hora");
    if(f.fecha) q=q.eq("fecha",f.fecha);
    if(f.prof)  q=q.eq("profesional_id",f.prof);
    if(f.suc)   q=q.eq("sucursal_id",f.suc);
    const {data}=await q; setTurnos(data||[]);
  };

  useEffect(()=>{cargar();},[f]);
  useEffect(()=>{
    const ch=sb.channel("admin-rt").on("postgres_changes",{event:"*",schema:"public",table:"turnos"},()=>cargar()).subscribe();
    return ()=>sb.removeChannel(ch);
  },[]);

  const borrarTodo = async () => {
    if(passAdmin!=="Nacho07"){setBorrandoMsg("Contraseña incorrecta");return;}
    setBorrandoMsg("Borrando...");
    const {error} = await sb.from("turnos").delete().neq("id","00000000-0000-0000-0000-000000000000");
    if(error){setBorrandoMsg("Error al borrar");return;}
    setBorrandoMsg("✓ Todos los datos fueron borrados");
    setPassAdmin("");
    setTimeout(()=>{setShowBorrar(false);setBorrandoMsg("");cargar();},2000);
  };

  // Stats del día filtrado
  const completados = turnos.filter(t=>t.estado==="completado");
  const pendientes  = turnos.filter(t=>t.estado==="pendiente");

  // Todos los slots disponibles para el día filtrado
  const slotsLibres = [];
  if(f.fecha){
    const turnosDelDia = turnos.filter(t=>t.estado!=="cancelado").map(t=>t.profesional_id+"_"+t.hora);
    PROFESIONALES.forEach(p=>{
      const dt = new Date(f.fecha+"T12:00:00");
      if(!p.dias.includes(dt.getDay())) return;
      HORARIOS.forEach(h=>{
        if(horarioPasado(f.fecha,h)) return;
        const key = p.id+"_"+h;
        if(!turnosDelDia.includes(key)){
          slotsLibres.push({prof:p, hora:h});
        }
      });
    });
  }

  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:900,margin:"0 0 1px"}}>Panel Admin</h2>
          <p style={{fontSize:11,color:"#555",margin:0}}>Vista general</p>
        </div>
        <button onClick={onLogout} style={{background:"transparent",border:"1px solid #1e1e1e",borderRadius:10,color:"#555",padding:"7px 12px",cursor:"pointer",fontSize:12}}>Salir</button>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
        {[["Turnos",turnos.length,"#fff"],["Pendientes",pendientes.length,"#FFD700"],["Completados",completados.length,"#4CAF50"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:11,padding:"12px 10px",textAlign:"center"}}>
            <p style={{fontSize:9,color:"#444",margin:"0 0 5px",letterSpacing:1,textTransform:"uppercase"}}>{l}</p>
            <p style={{fontSize:20,fontWeight:900,margin:0,color:c}}>{v}</p>
          </div>
        ))}
      </div>



      {/* Filtros */}
      <div style={{display:"grid",gap:7,marginBottom:16}}>
        <input type="date" value={f.fecha} onChange={e=>setF({...f,fecha:e.target.value})}
          style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:"10px 14px",color:"#fff",fontSize:12,width:"100%"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          <select value={f.suc} onChange={e=>setF({...f,suc:e.target.value})}
            style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:"10px 10px",color:"#fff",fontSize:12}}>
            <option value="">Todas las suc.</option>
            {SUCURSALES.map(s=><option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
          <select value={f.prof} onChange={e=>setF({...f,prof:e.target.value})}
            style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:10,padding:"10px 10px",color:"#fff",fontSize:12}}>
            <option value="">Todos</option>
            {PROFESIONALES.map(p=><option key={p.id} value={p.id}>{p.nombre} · {p.sucursalNombre.split(" ")[0]}</option>)}
          </select>
        </div>
      </div>

      {/* Turnos */}
      {turnos.length>0&&(
        <div style={{marginBottom:20}}>
          <p style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#444",marginBottom:10}}>TURNOS</p>
          <div style={{display:"grid",gap:7}}>
            {turnos.map(t=>{
              const p=PROFESIONALES.find(x=>x.id===t.profesional_id);
              return (
                <div key={t.id} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:11,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:700,fontSize:13,margin:"0 0 2px"}}>{t.cliente_nombre}</p>
                    <p style={{fontSize:11,color:"#555",margin:"0 0 3px"}}>{t.servicio_nombre} · {p?.nombre} · {p?.sucursalNombre}</p>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:9,padding:"2px 7px",borderRadius:20,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",background:t.estado==="completado"?"#0d2a0d":t.estado==="cancelado"?"#1a0000":"#1a1400",color:t.estado==="completado"?"#4CAF50":t.estado==="cancelado"?"#f44336":"#FFD700"}}>{t.estado}</span>

                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                    <p style={{fontWeight:900,fontSize:16,color:"#D32F2F",margin:"0 0 1px",lineHeight:1}}>{t.hora}</p>
                    <p style={{fontSize:10,color:"#444",margin:0}}>{t.fecha}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Turnos disponibles */}
      {f.fecha&&slotsLibres.length>0&&(
        <div style={{marginBottom:20}}>
          <p style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#444",marginBottom:10}}>HORARIOS DISPONIBLES — {fmtFecha(f.fecha).toUpperCase()}</p>
          <div style={{display:"grid",gap:6}}>
            {slotsLibres.map((s,i)=>(
              <div key={i} style={{background:"#0a1a0a",border:"1px solid #1a3a1a",borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontWeight:600,fontSize:13,margin:"0 0 1px",color:"#fff"}}>{s.prof.nombre}</p>
                  <p style={{fontSize:11,color:"#555",margin:0}}>{s.prof.sucursalNombre}</p>
                </div>
                <span style={{fontSize:15,fontWeight:700,color:"#4CAF50"}}>{s.hora}hs</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Borrar datos */}
      <div style={{borderTop:"1px solid #1a1a1a",paddingTop:18,marginTop:8}}>
        {!showBorrar?(
          <button onClick={()=>setShowBorrar(true)} style={{width:"100%",background:"transparent",border:"1px solid #2a0000",borderRadius:10,color:"#D32F2F",padding:"11px",fontSize:13,cursor:"pointer",fontWeight:600}}>
            🗑 Borrar todos los datos
          </button>
        ):(
          <div style={{background:"#0f0f0f",border:"1px solid #D32F2F44",borderRadius:12,padding:16}}>
            <p style={{fontSize:13,color:"#ff6b6b",marginBottom:12,fontWeight:600}}>⚠️ Esta acción borra todos los turnos permanentemente</p>
            <Inp label="Contraseña de administrador" value={passAdmin} onChange={e=>setPassAdmin(e.target.value)} placeholder="••••••" type="password" onKeyDown={e=>e.key==="Enter"&&borrarTodo()}/>
            {borrandoMsg&&<p style={{fontSize:13,color:borrandoMsg.includes("✓")?"#4CAF50":"#ff6b6b",marginBottom:10}}>{borrandoMsg}</p>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setShowBorrar(false);setPassAdmin("");setBorrandoMsg("");}} style={{flex:1,background:"#111",border:"1px solid #2a2a2a",borderRadius:9,color:"#888",padding:"11px",fontSize:13,cursor:"pointer"}}>Cancelar</button>
              <button onClick={borrarTodo} style={{flex:1,background:"#D32F2F",border:"none",borderRadius:9,color:"#fff",padding:"11px",fontSize:13,cursor:"pointer",fontWeight:700}}>Borrar todo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── APP ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [vista, setVista] = useState("home");
  const [tipo, setTipo]   = useState(null);
  const [prof, setProf]   = useState(null);

  const login  = (t,p) => { setTipo(t); setProf(p); setVista("panel"); };
  const logout = ()    => { setTipo(null); setProf(null); setVista("home"); };

  return (
    <>
      <G/>
      <div style={{minHeight:"100vh",background:"#080808"}}>
        <header style={{background:"#0f0f0f",borderBottom:"1px solid #1a1a1a",padding:"0 16px",height:54,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
          <div onClick={()=>{if(tipo)logout();else setVista("home");}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:8,background:"#D32F2F",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✂️</div>
            <div>
              <p style={{margin:0,fontSize:12,fontWeight:900,letterSpacing:2,lineHeight:1}}>BUENOS MUCHACHOS</p>
              <p style={{margin:0,fontSize:9,color:"#444",letterSpacing:1}}>BARBERÍA</p>
            </div>
          </div>
          {vista==="reservar"&&(
            <button onClick={()=>setVista("home")} style={{background:"transparent",border:"1px solid #1e1e1e",borderRadius:8,color:"#666",padding:"6px 12px",cursor:"pointer",fontSize:12}}>← Inicio</button>
          )}
        </header>

        <main style={{maxWidth:480,margin:"0 auto",padding:"20px 14px 80px"}}>
          {vista==="home"&&(
            <div>
              <div className="fade" style={{textAlign:"center",padding:"28px 0 32px"}}>
                <div style={{width:60,height:60,borderRadius:14,background:"#D32F2F",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}>✂️</div>
                <h1 style={{fontSize:24,fontWeight:900,margin:"0 0 6px",letterSpacing:.5}}>Reservá tu turno</h1>
                <p style={{color:"#555",fontSize:13,margin:0}}>Elegí el profesional, servicio, día y hora</p>
              </div>
              <button onClick={()=>setVista("reservar")}
                style={{width:"100%",background:"#D32F2F",color:"#fff",border:"none",borderRadius:13,padding:"16px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:32,letterSpacing:.5}}>
                ✂️ Reservar turno
              </button>
              <div style={{borderTop:"1px solid #111",paddingTop:28}}>
                <Login onLogin={login}/>
              </div>
            </div>
          )}
          {vista==="reservar"&&<Reserva/>}
          {vista==="panel"&&tipo==="peluquero"&&<PanelPeluquero prof={prof} onLogout={logout}/>}
          {vista==="panel"&&tipo==="admin"&&<PanelAdmin onLogout={logout}/>}
        </main>
      </div>
    </>
  );
}
