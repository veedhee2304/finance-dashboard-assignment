/* eslint-disable */
import { useState, useMemo, useEffect, useCallback, useRef, createContext, useContext } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from "recharts";
import {
  TrendingUp, TrendingDown, CreditCard, Wallet, Search, Filter,
  Plus, Edit2, Trash2, Sun, Moon, Eye, Shield,
  ArrowUpRight, ArrowDownRight, X, AlertCircle, BarChart2,
  List, Bell, Settings, Home,
  Lightbulb, ChevronLeft, ChevronRight, SortAsc, SortDesc,
  FileJson, FileText, Target, Zap, Info, CheckCircle, Clock
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const TOKENS = {
  dark: {
    bg:          "#080B12",
    bgSecondary: "#0D1117",
    surface:     "#111827",
    surfaceHover:"#161E2E",
    surfaceAlt:  "#0D1117",
    border:      "rgba(99,179,237,0.08)",
    borderAccent:"rgba(99,179,237,0.2)",
    text:        "#F0F6FF",
    textSub:     "#94A3B8",
    textMuted:   "#4A5568",
    accent:      "#38BDF8",
    accentDim:   "#0EA5E9",
    accentGlow:  "rgba(56,189,248,0.15)",
    success:     "#34D399",
    danger:      "#F87171",
    warning:     "#FBBF24",
    violet:      "#A78BFA",
    teal:        "#2DD4BF",
    overlay:     "rgba(8,11,18,0.85)",
  },
  light: {
    bg:          "#F8FAFF",
    bgSecondary: "#FFFFFF",
    surface:     "#FFFFFF",
    surfaceHover:"#F0F7FF",
    surfaceAlt:  "#F1F5F9",
    border:      "rgba(15,82,186,0.08)",
    borderAccent:"rgba(15,82,186,0.2)",
    text:        "#0F172A",
    textSub:     "#475569",
    textMuted:   "#94A3B8",
    accent:      "#0EA5E9",
    accentDim:   "#0284C7",
    accentGlow:  "rgba(14,165,233,0.1)",
    success:     "#10B981",
    danger:      "#EF4444",
    warning:     "#F59E0B",
    violet:      "#8B5CF6",
    teal:        "#14B8A6",
    overlay:     "rgba(248,250,255,0.85)",
  }
};

const CAT_COLORS = ["#38BDF8","#34D399","#A78BFA","#FBBF24","#F87171","#2DD4BF","#FB923C","#E879F9"];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Housing","Food & Dining","Transport","Shopping","Health","Entertainment","Utilities","Travel","Education","Income","Freelance","Investment"];
const BUDGETS = { "Housing":25000, "Food & Dining":8000, "Transport":3000, "Shopping":6000, "Health":4000, "Entertainment":3000, "Utilities":3000, "Travel":5000, "Education":2000 };

function generateTransactions() {
  const txns = [];
  let id = 1;
  const months = ["2025-01","2025-02","2025-03","2025-04"];
  months.forEach((m, mi) => {
    // Income
    txns.push({ id:id++, date:`${m}-01`, description:"Monthly Salary", category:"Income", amount:92000, type:"income", status:"cleared", note:"Primary employment" });
    if (mi >= 1) txns.push({ id:id++, date:`${m}-${String(10+mi).padStart(2,"0")}`, description:"Freelance - UI Design", category:"Freelance", amount:15000+mi*2000, type:"income", status:"cleared", note:"Side project" });
    if (mi === 2 || mi === 3) txns.push({ id:id++, date:`${m}-15`, description:"Dividend Payout", category:"Investment", amount:3200+mi*400, type:"income", status:"cleared", note:"Portfolio returns" });
    // Fixed expenses
    txns.push({ id:id++, date:`${m}-02`, description:"Apartment Rent", category:"Housing", amount:-(22000), type:"expense", status:"cleared", note:"Monthly rent" });
    txns.push({ id:id++, date:`${m}-03`, description:"Electricity + Water", category:"Utilities", amount:-(1800+mi*100), type:"expense", status:"cleared" });
    txns.push({ id:id++, date:`${m}-05`, description:"Internet Bill", category:"Utilities", amount:-949, type:"expense", status:"cleared" });
    txns.push({ id:id++, date:`${m}-06`, description:"Gym Membership", category:"Health", amount:-1200, type:"expense", status:"cleared" });
    // Variable expenses
    txns.push({ id:id++, date:`${m}-08`, description:"Grocery Run", category:"Food & Dining", amount:-(2800+mi*200), type:"expense", status:"cleared" });
    txns.push({ id:id++, date:`${m}-12`, description:"Restaurant Dinner", category:"Food & Dining", amount:-(1200+mi*100), type:"expense", status:"cleared" });
    txns.push({ id:id++, date:`${m}-14`, description:"Swiggy / Zomato", category:"Food & Dining", amount:-(800+mi*50), type:"expense", status:"cleared" });
    txns.push({ id:id++, date:`${m}-09`, description:"Ola / Uber Rides", category:"Transport", amount:-(600+mi*80), type:"expense", status:"cleared" });
    txns.push({ id:id++, date:`${m}-10`, description:"Amazon Shopping", category:"Shopping", amount:-(3200+mi*400), type:"expense", status:"cleared" });
    txns.push({ id:id++, date:`${m}-16`, description:"Clothing Store", category:"Shopping", amount:-(1800+mi*200), type:"expense", status:"cleared" });
    txns.push({ id:id++, date:`${m}-18`, description:"Netflix + Spotify", category:"Entertainment", amount:-1099, type:"expense", status:"cleared" });
    txns.push({ id:id++, date:`${m}-20`, description:"Weekend Outing", category:"Entertainment", amount:-(900+mi*50), type:"expense", status:"cleared" });
    if (mi % 2 === 0) txns.push({ id:id++, date:`${m}-22`, description:"Medical Checkup", category:"Health", amount:-(2000+mi*100), type:"expense", status:"cleared" });
    if (mi === 1 || mi === 3) txns.push({ id:id++, date:`${m}-24`, description:"Online Course", category:"Education", amount:-2999, type:"expense", status:"cleared" });
    if (mi === 3) txns.push({ id:id++, date:`${m}-25`, description:"Flight Booking", category:"Travel", amount:-8500, type:"expense", status:"pending" });
    if (mi === 2) txns.push({ id:id++, date:`${m}-23`, description:"Weekend Trip", category:"Travel", amount:-4200, type:"expense", status:"cleared" });
  });
  return txns.sort((a,b) => new Date(b.date)-new Date(a.date));
}

const ALL_TRANSACTIONS = generateTransactions();

const BALANCE_HISTORY = [
  { month:"Oct '24", balance:142000, income:92000, expenses:58000 },
  { month:"Nov '24", balance:168000, income:98000, expenses:52000 },
  { month:"Dec '24", balance:151000, income:107000, expenses:71000 },
  { month:"Jan '25", balance:198000, income:92000, expenses:45000 },
  { month:"Feb '25", balance:231000, income:109000, expenses:61000 },
  { month:"Mar '25", balance:268000, income:111200, expenses:48000 },
  { month:"Apr '25", balance:312400, income:110200, expenses:52000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n, short=false) => {
  const abs = Math.abs(n);
  if (short) {
    if (abs >= 100000) return `₹${(abs/100000).toFixed(1)}L`;
    if (abs >= 1000) return `₹${(abs/1000).toFixed(1)}K`;
    return `₹${abs}`;
  }
  return new Intl.NumberFormat("en-IN",{ style:"currency", currency:"INR", maximumFractionDigits:0 }).format(abs);
};
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN",{ day:"2-digit", month:"short", year:"numeric" });
const fmtDateShort = (d) => new Date(d).toLocaleDateString("en-IN",{ day:"2-digit", month:"short" });

// ─── Inject Global CSS ────────────────────────────────────────────────────────
let cssInjected = false;
function injectCSS() {
  if (cssInjected) return;
  cssInjected = true;
  const el = document.createElement("style");
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html { scroll-behavior:smooth; }
    body { font-family:'Manrope',sans-serif; overflow:hidden; }
    ::-webkit-scrollbar { width:5px; height:5px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(56,189,248,0.2); border-radius:4px; }
    ::-webkit-scrollbar-thumb:hover { background:rgba(56,189,248,0.4); }

    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes slideIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
    @keyframes slideRight { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
    @keyframes scaleIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
    @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(56,189,248,0)} 50%{box-shadow:0 0 20px 4px rgba(56,189,248,0.12)} }
    @keyframes barGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
    @keyframes dotBounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
    @keyframes toastSlide { from{opacity:0;transform:translateY(12px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes progressFill { from{width:0%} to{width:var(--target-width)} }
    @keyframes numberTick { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }

    .fd-page { animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
    .fd-card { transition:transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s, border-color 0.2s; }
    .fd-card:hover { transform:translateY(-2px); }
    .fd-btn { cursor:pointer; transition:all 0.15s cubic-bezier(0.22,1,0.36,1); border:none; outline:none; }
    .fd-btn:active { transform:scale(0.96); }
    .fd-btn:focus-visible { outline:2px solid rgba(56,189,248,0.5); outline-offset:2px; }
    .fd-input { transition:border-color 0.2s, box-shadow 0.2s; outline:none; }
    .fd-input:focus { border-color:rgba(56,189,248,0.5)!important; box-shadow:0 0 0 3px rgba(56,189,248,0.1)!important; }
    .fd-row { transition:background 0.12s; cursor:default; }
    .fd-row:hover { background:rgba(56,189,248,0.04)!important; }
    .fd-tab { cursor:pointer; transition:all 0.18s; }
    .fd-sidebar-item { transition:all 0.18s cubic-bezier(0.22,1,0.36,1); cursor:pointer; border-radius:10px; }
    .fd-sidebar-item:hover { background:rgba(56,189,248,0.06)!important; }
    .fd-shimmer { background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.03) 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; }
    .fd-progress-bar { animation:progressFill 1s cubic-bezier(0.22,1,0.36,1) both; transform-origin:left; }
    .fd-number { animation:countUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .fd-glow { animation:glowPulse 3s ease-in-out infinite; }
    .recharts-tooltip-wrapper { z-index:100; }
    .fd-select option { font-family:'Manrope',sans-serif; }

    @media (max-width:1024px) {
      .fd-sidebar { width:64px!important; }
      .fd-sidebar-label { display:none!important; }
      .fd-sidebar-logo-text { display:none!important; }
    }
    @media (max-width:768px) {
      .fd-sidebar { display:none!important; }
      .fd-mobile-nav { display:flex!important; }
      .fd-main-content { padding:16px!important; }
      .fd-stats-grid { grid-template-columns:1fr 1fr!important; }
      .fd-charts-grid { grid-template-columns:1fr!important; }
      .fd-tx-col-hide { display:none!important; }
    }
    @media (max-width:480px) {
      .fd-stats-grid { grid-template-columns:1fr!important; }
    }
  `;
  document.head.appendChild(el);
}

// ─── App Context ──────────────────────────────────────────────────────────────
const AppCtx = createContext({});
const useApp = () => useContext(AppCtx);

// ─── Animated Number ──────────────────────────────────────────────────────────
function AnimatedNumber({ value, formatter = (v) => v, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(0);
  const startTime = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const from = start.current;
    const to = value;
    startTime.current = null;
    const animate = (ts) => {
      if (!startTime.current) startTime.current = ts;
      const progress = Math.min((ts - startTime.current) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplay(from + (to - from) * ease);
      if (progress < 1) raf.current = requestAnimationFrame(animate);
      else { setDisplay(to); start.current = to; }
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return <span>{formatter(display)}</span>;
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function Skeleton({ w="100%", h=16, r=6, style={} }) {
  const { T } = useApp();
  return <div className="fd-shimmer" style={{ width:w, height:h, borderRadius:r, background:T.surfaceAlt, ...style }}/>;
}

// ─── Toast System ─────────────────────────────────────────────────────────────
function ToastContainer({ toasts, removeToast, T }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 18px",
          background: t.type==="success" ? T.success : t.type==="error" ? T.danger : t.type==="warning" ? T.warning : T.accent,
          color:"#fff", borderRadius:12, fontSize:13, fontFamily:"'Manrope',sans-serif", fontWeight:600,
          boxShadow:"0 8px 32px rgba(0,0,0,0.4)", animation:"toastSlide 0.3s cubic-bezier(0.22,1,0.36,1) both",
          maxWidth:320, cursor:"pointer" }} onClick={() => removeToast(t.id)}>
          {t.type==="success"?<CheckCircle size={15}/>:t.type==="error"?<AlertCircle size={15}/>:t.type==="warning"?<AlertCircle size={15}/>:<Info size={15}/>}
          <span style={{ flex:1 }}>{t.msg}</span>
          <X size={13} style={{ opacity:0.7, flexShrink:0 }}/>
        </div>
      ))}
    </div>
  );
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, T }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.borderAccent}`, borderRadius:10, padding:"11px 15px",
      boxShadow:"0 8px 24px rgba(0,0,0,0.3)", fontFamily:"'Manrope',sans-serif" }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:i<payload.length-1?5:0 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:p.color, flexShrink:0 }}/>
          <span style={{ fontSize:12, color:T.textSub }}>{p.name}:</span>
          <span style={{ fontSize:12, fontWeight:700, color:T.text, fontFamily:"'IBM Plex Mono',monospace" }}>
            {typeof p.value === "number" ? fmtINR(p.value, true) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action, T }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:T.accent, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>{subtitle}</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:T.text }}>{title}</div>
      </div>
      {action}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ label, color, T }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 9px", borderRadius:20,
      fontSize:10, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase",
      background:`${color}18`, color:color, border:`1px solid ${color}30` }}>
      {label}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon:Icon, change, color, T, delay=0, loading=false }) {
  const positive = change >= 0;
  if (loading) return (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24 }}>
      <Skeleton h={12} w="60%" style={{ marginBottom:16 }}/>
      <Skeleton h={32} w="75%" style={{ marginBottom:12 }}/>
      <Skeleton h={12} w="50%"/>
    </div>
  );
  return (
    <div className="fd-card fd-number" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24,
      animationDelay:`${delay}ms`, boxShadow:"0 1px 3px rgba(0,0,0,0.2)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${color},transparent)`, opacity:0.6 }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <span style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>{label}</span>
        <div style={{ width:34, height:34, borderRadius:9, background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${color}25` }}>
          <Icon size={15} color={color}/>
        </div>
      </div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:T.text, marginBottom:10, letterSpacing:"-0.02em" }}>
        <AnimatedNumber value={value} formatter={v => fmtINR(v, true)}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        {positive ? <ArrowUpRight size={13} color={T.success}/> : <ArrowDownRight size={13} color={T.danger}/>}
        <span style={{ fontSize:12, color: positive ? T.success : T.danger, fontWeight:700 }}>{Math.abs(change).toFixed(1)}%</span>
        <span style={{ fontSize:12, color:T.textMuted, fontWeight:500 }}>vs last month</span>
      </div>
    </div>
  );
}

// ─── Transaction Modal ────────────────────────────────────────────────────────
function TransactionModal({ tx, onSave, onClose, T }) {
  const [form, setForm] = useState(tx || {
    date: new Date().toISOString().split("T")[0],
    description: "", category:"Food & Dining", amount:"", type:"expense", status:"cleared", note:""
  });
  const [errors, setErrors] = useState({});
  const set = (k,v) => { setForm(f => ({...f,[k]:v})); setErrors(e => ({...e,[k]:null})); };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) e.amount = "Enter valid amount";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const amt = parseFloat(form.amount);
    onSave({ ...form, id: tx?.id || Date.now(), amount: form.type === "expense" ? -Math.abs(amt) : Math.abs(amt) });
  };

  const Field = ({ label, children, error }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", fontSize:11, fontWeight:700, color: error ? T.danger : T.textMuted,
        marginBottom:6, letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}{error ? ` — ${error}` : ""}</label>
      {children}
    </div>
  );

  const inputStyle = (err) => ({
    width:"100%", padding:"10px 13px", background:T.surfaceAlt, borderRadius:9,
    border:`1.5px solid ${err ? T.danger : T.border}`, color:T.text, fontSize:14,
    fontFamily:"'Manrope',sans-serif", transition:"all 0.2s"
  });

  const expCats = ["Food & Dining","Housing","Transport","Shopping","Health","Entertainment","Utilities","Travel","Education","Other"];
  const incCats = ["Income","Freelance","Investment","Other"];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:T.overlay, display:"flex", alignItems:"center", justifyContent:"center",
      backdropFilter:"blur(8px)", animation:"fadeIn 0.2s ease" }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:T.surface, border:`1px solid ${T.borderAccent}`, borderRadius:20, padding:32,
        width:"min(480px,92vw)", maxHeight:"90vh", overflowY:"auto", animation:"scaleIn 0.25s cubic-bezier(0.22,1,0.36,1)",
        boxShadow:"0 24px 64px rgba(0,0,0,0.5)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:T.text }}>{tx ? "Edit Transaction" : "New Transaction"}</div>
            <div style={{ fontSize:12, color:T.textMuted, marginTop:3 }}>{tx ? "Update transaction details" : "Record a new income or expense"}</div>
          </div>
          <button className="fd-btn" onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:T.surfaceAlt, color:T.textSub, display:"flex", alignItems:"center", justifyContent:"center" }}><X size={15}/></button>
        </div>

        {/* Type Toggle */}
        <div style={{ display:"flex", background:T.surfaceAlt, borderRadius:10, padding:3, marginBottom:20 }}>
          {["income","expense"].map(type => (
            <button key={type} className="fd-btn" onClick={() => { set("type",type); set("category", type==="income"?"Income":"Food & Dining"); }}
              style={{ flex:1, padding:"9px 0", borderRadius:8, fontSize:13, fontWeight:700, textTransform:"capitalize",
                fontFamily:"'Manrope',sans-serif",
                background: form.type===type ? (type==="income"?T.success:T.danger) : "transparent",
                color: form.type===type ? "#fff" : T.textMuted }}>
              {type==="income"?"↑ Income":"↓ Expense"}
            </button>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
          <Field label="Date" error={errors.date}>
            <input className="fd-input" type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={inputStyle(errors.date)}/>
          </Field>
          <Field label="Amount (₹)" error={errors.amount}>
            <input className="fd-input" type="number" placeholder="0.00" value={form.amount} onChange={e=>set("amount",e.target.value)} style={inputStyle(errors.amount)} min="0"/>
          </Field>
        </div>
        <Field label="Description" error={errors.description}>
          <input className="fd-input" type="text" placeholder="What was this for?" value={form.description} onChange={e=>set("description",e.target.value)} style={inputStyle(errors.description)}/>
        </Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
          <Field label="Category">
            <select className="fd-input fd-select" value={form.category} onChange={e=>set("category",e.target.value)} style={inputStyle(false)}>
              {(form.type==="income"?incCats:expCats).map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className="fd-input fd-select" value={form.status} onChange={e=>set("status",e.target.value)} style={inputStyle(false)}>
              <option value="cleared">Cleared</option>
              <option value="pending">Pending</option>
            </select>
          </Field>
        </div>
        <Field label="Note (optional)">
          <input className="fd-input" type="text" placeholder="Add a note..." value={form.note||""} onChange={e=>set("note",e.target.value)} style={inputStyle(false)}/>
        </Field>

        <div style={{ display:"flex", gap:10, marginTop:8 }}>
          <button className="fd-btn" onClick={onClose}
            style={{ flex:1, padding:"12px", background:T.surfaceAlt, borderRadius:10, color:T.textSub, fontWeight:600, fontSize:14, fontFamily:"'Manrope',sans-serif" }}>
            Cancel
          </button>
          <button className="fd-btn" onClick={handleSave}
            style={{ flex:2, padding:"12px", borderRadius:10, fontWeight:700, fontSize:14, fontFamily:"'Manrope',sans-serif",
              background:`linear-gradient(135deg, ${T.accent}, ${T.accentDim})`, color:"#fff",
              boxShadow:`0 4px 16px ${T.accentGlow}` }}>
            {tx ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Budget Progress ──────────────────────────────────────────────────────────
function BudgetBar({ cat, spent, budget, T, color }) {
  const pct = Math.min((spent/budget)*100, 100);
  const over = spent > budget;
  const barColor = pct > 90 ? T.danger : pct > 70 ? T.warning : color;
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0 }}/>
          <span style={{ fontSize:13, fontWeight:500, color:T.text }}>{cat}</span>
          {over && <Badge label="Over" color={T.danger} T={T}/>}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:12, fontWeight:700, color:over?T.danger:T.textSub, fontFamily:"'IBM Plex Mono',monospace" }}>{fmtINR(spent,true)}</span>
          <span style={{ fontSize:11, color:T.textMuted }}>/ {fmtINR(budget,true)}</span>
        </div>
      </div>
      <div style={{ height:6, borderRadius:3, background:T.surfaceAlt, overflow:"hidden" }}>
        <div className="fd-progress-bar" style={{ height:"100%", width:`${pct}%`, "--target-width":`${pct}%`,
          borderRadius:3, background:barColor, transition:"width 1s cubic-bezier(0.22,1,0.36,1)" }}/>
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}>
        <span style={{ fontSize:10, color: pct>90?T.danger:T.textMuted, fontWeight:600 }}>{pct.toFixed(0)}% used</span>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, T, dark }) {
  const { role } = useApp();
  const navItems = [
    { id:"overview", label:"Overview", icon:Home },
    { id:"transactions", label:"Transactions", icon:List },
    { id:"analytics", label:"Analytics", icon:BarChart2 },
    { id:"budgets", label:"Budgets", icon:Target },
    { id:"insights", label:"Insights", icon:Lightbulb },
  ];
  return (
    <div className="fd-sidebar" style={{ width:220, background:T.bgSecondary, borderRight:`1px solid ${T.border}`,
      display:"flex", flexDirection:"column", padding:"0", flexShrink:0, position:"relative", zIndex:10 }}>
      {/* Logo */}
      <div style={{ padding:"24px 20px 20px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:`linear-gradient(135deg,${T.accent},${T.teal})`,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Zap size={16} color="#fff"/>
          </div>
          <div className="fd-sidebar-logo-text">
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:T.text, letterSpacing:"-0.02em" }}>Nexus</div>
            <div style={{ fontSize:9, fontWeight:700, color:T.textMuted, letterSpacing:"0.12em", textTransform:"uppercase", marginTop:1 }}>Finance OS</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", padding:"4px 10px 8px" }} className="fd-sidebar-label">
          Navigation
        </div>
        {navItems.map(item => {
          const active = page === item.id;
          return (
            <div key={item.id} className="fd-sidebar-item" onClick={() => setPage(item.id)}
              style={{ display:"flex", alignItems:"center", gap:11, padding:"11px 12px", marginBottom:3,
                background: active ? T.accentGlow : "transparent",
                border: active ? `1px solid ${T.borderAccent}` : "1px solid transparent" }}>
              <item.icon size={17} color={active ? T.accent : T.textMuted} style={{ flexShrink:0 }}/>
              <span className="fd-sidebar-label" style={{ fontSize:13, fontWeight: active ? 700 : 500, color: active ? T.accent : T.textSub }}>
                {item.label}
              </span>
              {active && <div style={{ marginLeft:"auto", width:4, height:4, borderRadius:"50%", background:T.accent }}/>}
            </div>
          );
        })}

        <div style={{ marginTop:16, height:1, background:T.border }}/>
        <div style={{ fontSize:10, fontWeight:700, color:T.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", padding:"12px 10px 8px" }} className="fd-sidebar-label">
          Account
        </div>
        <div className="fd-sidebar-item" style={{ display:"flex", alignItems:"center", gap:11, padding:"11px 12px", marginBottom:3 }}>
          <Settings size={17} color={T.textMuted}/>
          <span className="fd-sidebar-label" style={{ fontSize:13, color:T.textSub }}>Settings</span>
        </div>
      </nav>

      {/* User Profile */}
      <div style={{ padding:"12px 10px", borderTop:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:T.surfaceAlt }}>
          <div style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${T.accent},${T.violet})`,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:12, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif" }}>
            V
          </div>
          <div className="fd-sidebar-logo-text" style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Veedhee</div>
            <div style={{ fontSize:10, color:T.textMuted, display:"flex", alignItems:"center", gap:4 }}>
              {role==="admin"?<Shield size={9} color={T.accent}/>:<Eye size={9} color={T.textMuted}/>}
              <span style={{ textTransform:"capitalize" }}>{role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ page, T, dark, setDark }) {
  const { role, setRole, addToast } = useApp();
  const pageTitles = { overview:"Overview", transactions:"Transactions", analytics:"Analytics", budgets:"Budget Tracker", insights:"AI Insights" };

  const handleRoleChange = (r) => {
    setRole(r);
    addToast({ msg:`Switched to ${r} mode`, type:"info" });
  };

  return (
    <div style={{ padding:"16px 28px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center",
      justifyContent:"space-between", background:T.bgSecondary, flexShrink:0, zIndex:5 }}>
      <div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:T.text, letterSpacing:"-0.01em" }}>
          {pageTitles[page]}
        </div>
        <div style={{ fontSize:11, color:T.textMuted, marginTop:1 }}>
          {new Date().toLocaleDateString("en-IN",{ weekday:"long", day:"numeric", month:"long", year:"numeric" })}
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {/* Role Switcher */}
        <div style={{ display:"flex", alignItems:"center", background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:10, overflow:"hidden" }}>
          {["viewer","admin"].map(r => (
            <button key={r} className="fd-btn" onClick={() => handleRoleChange(r)}
              style={{ padding:"8px 14px", display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700,
                fontFamily:"'Manrope',sans-serif", textTransform:"capitalize",
                background: role===r ? T.accentGlow : "transparent",
                color: role===r ? T.accent : T.textMuted,
                borderRight: r==="viewer" ? `1px solid ${T.border}` : "none" }}>
              {r==="admin"?<Shield size={12}/>:<Eye size={12}/>}
              <span className="fd-tx-col-hide">{r}</span>
            </button>
          ))}
        </div>

        {/* Notification */}
        <button className="fd-btn" style={{ width:36, height:36, borderRadius:9, background:T.surfaceAlt,
          border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.textMuted, position:"relative" }}>
          <Bell size={15}/>
          <div style={{ position:"absolute", top:8, right:8, width:6, height:6, borderRadius:"50%", background:T.danger, border:`1.5px solid ${T.bgSecondary}` }}/>
        </button>

        {/* Dark Mode */}
        <button className="fd-btn" onClick={() => setDark(d => !d)}
          style={{ width:36, height:36, borderRadius:9, background:T.surfaceAlt,
            border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center",
            color:T.textMuted }}>
          {dark ? <Sun size={15}/> : <Moon size={15}/>}
        </button>
      </div>
    </div>
  );
}

// ─── Mobile Nav ───────────────────────────────────────────────────────────────
function MobileNav({ page, setPage, T }) {
  const items = [
    { id:"overview", icon:Home },{ id:"transactions", icon:List },
    { id:"analytics", icon:BarChart2 },{ id:"budgets", icon:Target },{ id:"insights", icon:Lightbulb },
  ];
  return (
    <div className="fd-mobile-nav" style={{ display:"none", background:T.bgSecondary,
      borderTop:`1px solid ${T.border}`, padding:"8px 16px", justifyContent:"space-around",
      position:"fixed", bottom:0, left:0, right:0, zIndex:100 }}>
      {items.map(item => {
        const active = page===item.id;
        return (
          <button key={item.id} className="fd-btn" onClick={() => setPage(item.id)}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"8px 12px", borderRadius:10,
              background: active ? T.accentGlow : "transparent", color: active ? T.accent : T.textMuted }}>
            <item.icon size={18}/>
          </button>
        );
      })}
    </div>
  );
}

// ─── OVERVIEW PAGE ────────────────────────────────────────────────────────────
function OverviewPage({ transactions, T, loading }) {
  const income = transactions.filter(t=>t.type==="income").reduce((a,t)=>a+t.amount,0);
  const expenses = Math.abs(transactions.filter(t=>t.type==="expense").reduce((a,t)=>a+t.amount,0));
  const balance = income - expenses;
  const pending = transactions.filter(t=>t.status==="pending").reduce((a,t)=>a+Math.abs(t.amount),0);

  const recentTx = transactions.slice(0,6);

  return (
    <div className="fd-page">
      {/* Stats */}
      <div className="fd-stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
        <StatCard label="Net Balance" value={balance} icon={Wallet} change={16.8} color={T.accent} T={T} loading={loading} delay={0}/>
        <StatCard label="Total Income" value={income} icon={TrendingUp} change={9.3} color={T.success} T={T} loading={loading} delay={60}/>
        <StatCard label="Total Expenses" value={expenses} icon={CreditCard} change={-4.2} color={T.danger} T={T} loading={loading} delay={120}/>
        <StatCard label="Pending" value={pending} icon={Clock} change={0} color={T.warning} T={T} loading={loading} delay={180}/>
      </div>

      <div className="fd-charts-grid" style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:16, marginBottom:16 }}>
        {/* Balance Trend */}
        <div className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24,
          boxShadow:"0 1px 3px rgba(0,0,0,0.15)", animation:"fadeUp 0.4s 0.1s cubic-bezier(0.22,1,0.36,1) both" }}>
          <SectionHeader title="Balance Trend" subtitle="7-Month History" T={T}/>
          {loading ? <Skeleton h={200}/> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={BALANCE_HISTORY} margin={{ top:4, right:4, bottom:0, left:0 }}>
                <defs>
                  <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.accent} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={T.accent} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize:10, fill:T.textMuted, fontFamily:"'Manrope',sans-serif" }} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>`₹${v/1000}K`} tick={{ fontSize:10, fill:T.textMuted, fontFamily:"'Manrope',sans-serif" }} axisLine={false} tickLine={false} width={48}/>
                <Tooltip content={<ChartTooltip T={T}/>}/>
                <Area type="monotone" dataKey="balance" name="Balance" stroke={T.accent} strokeWidth={2.5} fill="url(#balGrad)" dot={{ r:3.5, fill:T.accent, strokeWidth:0 }} activeDot={{ r:5, fill:T.accent }}/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Spending Ring */}
        <div className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24,
          boxShadow:"0 1px 3px rgba(0,0,0,0.15)", animation:"fadeUp 0.4s 0.15s cubic-bezier(0.22,1,0.36,1) both" }}>
          <SectionHeader title="By Category" subtitle="Spending Split" T={T}/>
          {loading ? <Skeleton h={160}/> : (() => {
            const catMap = {};
            transactions.filter(t=>t.type==="expense").forEach(t => { catMap[t.category]=(catMap[t.category]||0)+Math.abs(t.amount); });
            const catData = Object.entries(catMap).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,6);
            return (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={catData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {catData.map((_,i)=><Cell key={i} fill={CAT_COLORS[i%CAT_COLORS.length]}/>)}
                    </Pie>
                    <Tooltip formatter={v=>fmtINR(v)} contentStyle={{ background:T.surface, border:`1px solid ${T.borderAccent}`, borderRadius:8, fontSize:12, fontFamily:"'Manrope',sans-serif", color:T.text }}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", flexDirection:"column", gap:7, marginTop:4 }}>
                  {catData.slice(0,4).map((d,i)=>(
                    <div key={d.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:CAT_COLORS[i], flexShrink:0 }}/>
                        <span style={{ fontSize:12, color:T.textSub }}>{d.name}</span>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:T.text, fontFamily:"'IBM Plex Mono',monospace" }}>{fmtINR(d.value,true)}</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24,
        boxShadow:"0 1px 3px rgba(0,0,0,0.15)", animation:"fadeUp 0.4s 0.2s cubic-bezier(0.22,1,0.36,1) both" }}>
        <SectionHeader title="Recent Transactions" subtitle="Latest Activity" T={T}
          action={<Badge label="View All" color={T.accent} T={T}/>}/>
        {loading ? [1,2,3,4].map(i=>(
          <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
            <Skeleton w={36} h={36} r={9}/>
            <div style={{ flex:1 }}><Skeleton h={12} w="60%" style={{ marginBottom:6 }}/><Skeleton h={10} w="40%"/></div>
            <Skeleton w={60} h={16}/>
          </div>
        )) : recentTx.map((tx,i)=>(
          <div key={tx.id} className="fd-row" style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 8px",
            borderBottom: i<recentTx.length-1 ? `1px solid ${T.border}` : "none", borderRadius:8 }}>
            <div style={{ width:38, height:38, borderRadius:10, background: tx.type==="income"?`${T.success}15`:`${T.danger}15`,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {tx.type==="income"?<TrendingUp size={15} color={T.success}/>:<TrendingDown size={15} color={T.danger}/>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tx.description}</div>
              <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>{fmtDateShort(tx.date)} · {tx.category}</div>
            </div>
            {tx.status==="pending" && <Badge label="Pending" color={T.warning} T={T}/>}
            <div style={{ fontSize:14, fontWeight:700, fontFamily:"'IBM Plex Mono',monospace", color:tx.amount>0?T.success:T.danger, flexShrink:0 }}>
              {tx.amount>0?"+":""}{fmtINR(tx.amount,true)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TRANSACTIONS PAGE ────────────────────────────────────────────────────────
function TransactionsPage({ transactions, setTransactions, T }) {
  const { role, addToast } = useApp();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCats, setFilterCats] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(1);
  const [groupBy, setGroupBy] = useState("none");
  const [showFilters, setShowFilters] = useState(false);
  const [amtRange, setAmtRange] = useState({ min:"", max:"" });
  const [dateRange, setDateRange] = useState({ from:"", to:"" });
  const PER_PAGE = 15;

  const allCats = useMemo(() => [...new Set(transactions.map(t=>t.category))].sort(),[transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()) || t.note?.toLowerCase().includes(search.toLowerCase()));
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    if (filterCats.length) list = list.filter(t => filterCats.includes(t.category));
    if (filterStatus !== "all") list = list.filter(t => t.status === filterStatus);
    if (amtRange.min) list = list.filter(t => Math.abs(t.amount) >= parseFloat(amtRange.min));
    if (amtRange.max) list = list.filter(t => Math.abs(t.amount) <= parseFloat(amtRange.max));
    if (dateRange.from) list = list.filter(t => t.date >= dateRange.from);
    if (dateRange.to) list = list.filter(t => t.date <= dateRange.to);
    list.sort((a,b) => {
      let av=a[sortKey], bv=b[sortKey];
      if (sortKey==="amount"){av=Math.abs(av);bv=Math.abs(bv);}
      return sortDir==="asc" ? (av<bv?-1:av>bv?1:0) : (av>bv?-1:av<bv?1:0);
    });
    return list;
  }, [transactions, search, filterType, filterCats, filterStatus, sortKey, sortDir, amtRange, dateRange]);

  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleSave = (tx) => {
    setTransactions(prev => {
      const idx = prev.findIndex(t=>t.id===tx.id);
      if (idx>=0) { const n=[...prev]; n[idx]=tx; return n; }
      return [tx,...prev];
    });
    addToast({ msg: modal==="add"?"Transaction added successfully":"Transaction updated", type:"success" });
    setModal(null);
  };
  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t=>t.id!==id));
    addToast({ msg:"Transaction removed", type:"error" });
  };

  const exportCSV = () => {
    const h = "Date,Description,Category,Type,Amount,Status,Note";
    const rows = filtered.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount},${t.status},"${t.note||""}"`);
    const blob = new Blob([[h,...rows].join("\n")],{type:"text/csv"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`nexus_transactions_${Date.now()}.csv`; a.click();
    addToast({ msg:`Exported ${filtered.length} transactions as CSV`, type:"success" });
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`nexus_transactions_${Date.now()}.json`; a.click();
    addToast({ msg:`Exported ${filtered.length} transactions as JSON`, type:"success" });
  };

  const toggleCat = (cat) => setFilterCats(prev => prev.includes(cat) ? prev.filter(c=>c!==cat) : [...prev,cat]);
  const clearFilters = () => { setSearch(""); setFilterType("all"); setFilterCats([]); setFilterStatus("all"); setAmtRange({min:"",max:""}); setDateRange({from:"",to:""}); };
  const activeFilters = [filterType!=="all",filterCats.length>0,filterStatus!=="all",amtRange.min||amtRange.max,dateRange.from||dateRange.to].filter(Boolean).length;

  const SortHeader = ({ k, label, hide=false }) => (
    <div className="fd-tab" onClick={() => { if(sortKey===k) setSortDir(d=>d==="asc"?"desc":"asc"); else {setSortKey(k);setSortDir("desc");} }}
      style={{ display:"flex", alignItems:"center", gap:4, cursor:"pointer", userSelect:"none",
        fontSize:11, fontWeight:700, color:sortKey===k?T.accent:T.textMuted, letterSpacing:"0.08em", textTransform:"uppercase" }}
      className={`fd-tab ${hide?"fd-tx-col-hide":""}`}>
      {label}
      {sortKey===k ? (sortDir==="asc"?<SortAsc size={12}/>:<SortDesc size={12}/>) : <span style={{width:12}}/>}
    </div>
  );

  return (
    <div className="fd-page">
      {/* Toolbar */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ flex:1, minWidth:220, position:"relative" }}>
          <Search size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:T.textMuted, pointerEvents:"none" }}/>
          <input className="fd-input" placeholder="Search description, category, note…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
            style={{ width:"100%", padding:"10px 13px 10px 38px", background:T.surface, border:`1px solid ${T.border}`,
              borderRadius:10, color:T.text, fontSize:13, fontFamily:"'Manrope',sans-serif" }}/>
          {search && <button className="fd-btn" onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"transparent", color:T.textMuted }}><X size={13}/></button>}
        </div>

        {/* Type Quick Filter */}
        <div style={{ display:"flex", background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, overflow:"hidden" }}>
          {[["all","All"],["income","Income"],["expense","Expense"]].map(([v,l]) => (
            <button key={v} className="fd-btn" onClick={()=>{setFilterType(v);setPage(1);}}
              style={{ padding:"9px 14px", fontSize:12, fontWeight:700, fontFamily:"'Manrope',sans-serif",
                background: filterType===v ? T.accentGlow : "transparent",
                color: filterType===v ? T.accent : T.textMuted,
                borderRight: v!=="expense"?`1px solid ${T.border}`:"none" }}>
              {l}
            </button>
          ))}
        </div>

        {/* Filter Toggle */}
        <button className="fd-btn" onClick={()=>setShowFilters(f=>!f)}
          style={{ padding:"9px 14px", display:"flex", alignItems:"center", gap:7, fontSize:12, fontWeight:700,
            fontFamily:"'Manrope',sans-serif", background: showFilters ? T.accentGlow : T.surface,
            border:`1px solid ${showFilters ? T.borderAccent : T.border}`, borderRadius:10,
            color: showFilters ? T.accent : T.textMuted }}>
          <Filter size={13}/> Filters {activeFilters>0 && <span style={{ background:T.accent, color:"#fff", borderRadius:20, padding:"1px 6px", fontSize:10 }}>{activeFilters}</span>}
        </button>

        {/* Export */}
        <div style={{ display:"flex", gap:6 }}>
          <button className="fd-btn" onClick={exportCSV}
            style={{ padding:"9px 13px", display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600,
              fontFamily:"'Manrope',sans-serif", background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, color:T.textSub }}>
            <FileText size={13}/><span className="fd-tx-col-hide">CSV</span>
          </button>
          <button className="fd-btn" onClick={exportJSON}
            style={{ padding:"9px 13px", display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600,
              fontFamily:"'Manrope',sans-serif", background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, color:T.textSub }}>
            <FileJson size={13}/><span className="fd-tx-col-hide">JSON</span>
          </button>
        </div>

        {role==="admin" && (
          <button className="fd-btn" onClick={()=>setModal("add")}
            style={{ padding:"9px 16px", display:"flex", alignItems:"center", gap:7, fontSize:13, fontWeight:700,
              fontFamily:"'Manrope',sans-serif", background:`linear-gradient(135deg,${T.accent},${T.accentDim})`,
              borderRadius:10, color:"#fff", boxShadow:`0 4px 14px ${T.accentGlow}` }}>
            <Plus size={14}/> Add
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div style={{ background:T.surface, border:`1px solid ${T.borderAccent}`, borderRadius:14, padding:20, marginBottom:16,
          animation:"fadeUp 0.25s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Status</div>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="fd-input fd-select"
                style={{ width:"100%", padding:"8px 11px", background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:13, fontFamily:"'Manrope',sans-serif" }}>
                <option value="all">All Statuses</option>
                <option value="cleared">Cleared</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Min Amount</div>
              <input type="number" placeholder="₹ 0" value={amtRange.min} onChange={e=>setAmtRange(p=>({...p,min:e.target.value}))}
                className="fd-input" style={{ width:"100%", padding:"8px 11px", background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:13, fontFamily:"'Manrope',sans-serif" }}/>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Max Amount</div>
              <input type="number" placeholder="₹ ∞" value={amtRange.max} onChange={e=>setAmtRange(p=>({...p,max:e.target.value}))}
                className="fd-input" style={{ width:"100%", padding:"8px 11px", background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:13, fontFamily:"'Manrope',sans-serif" }}/>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Date From</div>
              <input type="date" value={dateRange.from} onChange={e=>setDateRange(p=>({...p,from:e.target.value}))}
                className="fd-input" style={{ width:"100%", padding:"8px 11px", background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:13, fontFamily:"'Manrope',sans-serif" }}/>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Date To</div>
              <input type="date" value={dateRange.to} onChange={e=>setDateRange(p=>({...p,to:e.target.value}))}
                className="fd-input" style={{ width:"100%", padding:"8px 11px", background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:13, fontFamily:"'Manrope',sans-serif" }}/>
            </div>
          </div>
          <div style={{ marginTop:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Categories</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {allCats.map(cat => (
                <button key={cat} className="fd-btn" onClick={()=>toggleCat(cat)}
                  style={{ padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:600, fontFamily:"'Manrope',sans-serif",
                    background: filterCats.includes(cat) ? T.accentGlow : T.surfaceAlt,
                    border:`1px solid ${filterCats.includes(cat) ? T.borderAccent : T.border}`,
                    color: filterCats.includes(cat) ? T.accent : T.textSub }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {activeFilters > 0 && (
            <button className="fd-btn" onClick={clearFilters}
              style={{ marginTop:14, padding:"8px 16px", fontSize:12, fontWeight:700, fontFamily:"'Manrope',sans-serif",
                background:"transparent", border:`1px solid ${T.danger}30`, borderRadius:8, color:T.danger }}>
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16,
        overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.15)", animation:"fadeUp 0.4s 0.05s cubic-bezier(0.22,1,0.36,1) both" }}>
        {/* Table Header */}
        <div style={{ display:"grid", gridTemplateColumns:"120px 1fr 120px 90px 110px 110px 70px",
          padding:"12px 20px", background:T.surfaceAlt, borderBottom:`1px solid ${T.border}`, alignItems:"center", gap:8 }}>
          <SortHeader k="date" label="Date"/>
          <SortHeader k="description" label="Description"/>
          <SortHeader k="category" label="Category" hide/>
          <SortHeader k="type" label="Type" hide/>
          <SortHeader k="status" label="Status" hide/>
          <SortHeader k="amount" label="Amount"/>
          {role==="admin" && <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:"0.08em", textTransform:"uppercase" }}>Actions</div>}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding:"56px 24px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:T.text, marginBottom:8 }}>No transactions found</div>
            <div style={{ fontSize:13, color:T.textMuted }}>Try adjusting your filters or search query</div>
            {activeFilters > 0 && (
              <button className="fd-btn" onClick={clearFilters}
                style={{ marginTop:16, padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:700, fontFamily:"'Manrope',sans-serif",
                  background:T.accentGlow, border:`1px solid ${T.borderAccent}`, color:T.accent }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : paginated.map((tx, i) => (
          <div key={tx.id} className="fd-row" style={{ display:"grid",
            gridTemplateColumns:"120px 1fr 120px 90px 110px 110px 70px",
            padding:"14px 20px", borderBottom: i<paginated.length-1?`1px solid ${T.border}`:"none",
            alignItems:"center", gap:8 }}>
            <span style={{ fontSize:12, color:T.textMuted, fontFamily:"'IBM Plex Mono',monospace" }}>{fmtDateShort(tx.date)}</span>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tx.description}</div>
              {tx.note && <div style={{ fontSize:11, color:T.textMuted, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tx.note}</div>}
            </div>
            <span className="fd-tx-col-hide"><Badge label={tx.category} color={T.accent} T={T}/></span>
            <span className="fd-tx-col-hide">
              <Badge label={tx.type} color={tx.type==="income"?T.success:T.danger} T={T}/>
            </span>
            <span className="fd-tx-col-hide">
              <Badge label={tx.status} color={tx.status==="cleared"?T.success:T.warning} T={T}/>
            </span>
            <span style={{ fontSize:14, fontWeight:800, fontFamily:"'IBM Plex Mono',monospace", color:tx.amount>0?T.success:T.danger }}>
              {tx.amount>0?"+":""}{fmtINR(tx.amount,true)}
            </span>
            {role==="admin" && (
              <div style={{ display:"flex", gap:6 }}>
                <button className="fd-btn" onClick={()=>setModal(tx)}
                  style={{ width:28, height:28, borderRadius:7, background:T.surfaceAlt, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.textMuted }}>
                  <Edit2 size={12}/>
                </button>
                <button className="fd-btn" onClick={()=>handleDelete(tx.id)}
                  style={{ width:28, height:28, borderRadius:7, background:`${T.danger}10`, border:`1px solid ${T.danger}25`, display:"flex", alignItems:"center", justifyContent:"center", color:T.danger }}>
                  <Trash2 size={12}/>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14 }}>
        <span style={{ fontSize:12, color:T.textMuted }}>
          Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of <strong style={{color:T.text}}>{filtered.length}</strong> transactions
        </span>
        {totalPages > 1 && (
          <div style={{ display:"flex", gap:6 }}>
            <button className="fd-btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
              style={{ width:32, height:32, borderRadius:8, background:T.surface, border:`1px solid ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center", color:page===1?T.textMuted:T.text, cursor:page===1?"not-allowed":"pointer" }}>
              <ChevronLeft size={14}/>
            </button>
            {Array.from({length:Math.min(totalPages,5)},(_,i)=>i+1).map(p=>(
              <button key={p} className="fd-btn" onClick={()=>setPage(p)}
                style={{ width:32, height:32, borderRadius:8, fontSize:12, fontWeight:700, fontFamily:"'Manrope',sans-serif",
                  background: page===p ? T.accent : T.surface, border:`1px solid ${page===p?T.accent:T.border}`,
                  color: page===p?"#fff":T.text, cursor:"pointer" }}>{p}</button>
            ))}
            <button className="fd-btn" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{ width:32, height:32, borderRadius:8, background:T.surface, border:`1px solid ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center", color:page===totalPages?T.textMuted:T.text, cursor:page===totalPages?"not-allowed":"pointer" }}>
              <ChevronRight size={14}/>
            </button>
          </div>
        )}
      </div>

      {modal && <TransactionModal tx={modal==="add"?null:modal} onSave={handleSave} onClose={()=>setModal(null)} T={T}/>}
    </div>
  );
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
function AnalyticsPage({ transactions, T }) {
  const [chartType, setChartType] = useState("area");
  const catMap = {};
  transactions.filter(t=>t.type==="expense").forEach(t => { catMap[t.category]=(catMap[t.category]||0)+Math.abs(t.amount); });
  const catData = Object.entries(catMap).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);

  const monthlyMap = {};
  transactions.forEach(t => {
    const m = t.date.slice(0,7);
    if (!monthlyMap[m]) monthlyMap[m] = { month:new Date(m+"-01").toLocaleDateString("en-IN",{month:"short",year:"2-digit"}), income:0, expenses:0, net:0 };
    if (t.type==="income") monthlyMap[m].income+=t.amount;
    else { monthlyMap[m].expenses+=Math.abs(t.amount); }
    monthlyMap[m].net = monthlyMap[m].income - monthlyMap[m].expenses;
  });
  const monthlyData = Object.values(monthlyMap).sort((a,b)=>a.month>b.month?1:-1);

  const totalIncome = transactions.filter(t=>t.type==="income").reduce((a,t)=>a+t.amount,0);
  const totalExpenses = Math.abs(transactions.filter(t=>t.type==="expense").reduce((a,t)=>a+t.amount,0));

  return (
    <div className="fd-page">
      <div className="fd-charts-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Monthly Income vs Expenses */}
        <div className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24,
          gridColumn:"1/-1", boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.accent, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>Monthly Analysis</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:T.text }}>Income vs Expenses</div>
            </div>
            <div style={{ display:"flex", background:T.surfaceAlt, borderRadius:10, padding:3, gap:2 }}>
              {[["area","Area"],["bar","Bar"],["line","Line"]].map(([v,l])=>(
                <button key={v} className="fd-btn" onClick={()=>setChartType(v)}
                  style={{ padding:"7px 13px", borderRadius:8, fontSize:11, fontWeight:700, fontFamily:"'Manrope',sans-serif",
                    background: chartType===v ? T.surface : "transparent",
                    color: chartType===v ? T.accent : T.textMuted,
                    boxShadow: chartType===v ? "0 1px 4px rgba(0,0,0,0.2)" : "none" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            {chartType==="bar" ? (
              <BarChart data={monthlyData} margin={{top:0,right:4,bottom:0,left:0}} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:10,fill:T.textMuted,fontFamily:"'Manrope',sans-serif"}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>`₹${v/1000}K`} tick={{fontSize:10,fill:T.textMuted,fontFamily:"'Manrope',sans-serif"}} axisLine={false} tickLine={false} width={46}/>
                <Tooltip content={<ChartTooltip T={T}/>}/>
                <Legend wrapperStyle={{fontSize:11,fontFamily:"'Manrope',sans-serif",color:T.textSub}}/>
                <Bar dataKey="income" name="Income" fill={T.success} radius={[4,4,0,0]}/>
                <Bar dataKey="expenses" name="Expenses" fill={T.danger} radius={[4,4,0,0]}/>
              </BarChart>
            ) : chartType==="line" ? (
              <LineChart data={monthlyData} margin={{top:4,right:4,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:10,fill:T.textMuted,fontFamily:"'Manrope',sans-serif"}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>`₹${v/1000}K`} tick={{fontSize:10,fill:T.textMuted,fontFamily:"'Manrope',sans-serif"}} axisLine={false} tickLine={false} width={46}/>
                <Tooltip content={<ChartTooltip T={T}/>}/>
                <Legend wrapperStyle={{fontSize:11,fontFamily:"'Manrope',sans-serif",color:T.textSub}}/>
                <Line type="monotone" dataKey="income" name="Income" stroke={T.success} strokeWidth={2.5} dot={{r:4,fill:T.success,strokeWidth:0}} activeDot={{r:6}}/>
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke={T.danger} strokeWidth={2.5} dot={{r:4,fill:T.danger,strokeWidth:0}} activeDot={{r:6}}/>
                <Line type="monotone" dataKey="net" name="Net" stroke={T.accent} strokeWidth={2} strokeDasharray="5 5" dot={false}/>
              </LineChart>
            ) : (
              <AreaChart data={monthlyData} margin={{top:4,right:4,bottom:0,left:0}}>
                <defs>
                  <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.success} stopOpacity={0.2}/><stop offset="95%" stopColor={T.success} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.danger} stopOpacity={0.2}/><stop offset="95%" stopColor={T.danger} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:10,fill:T.textMuted,fontFamily:"'Manrope',sans-serif"}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>`₹${v/1000}K`} tick={{fontSize:10,fill:T.textMuted,fontFamily:"'Manrope',sans-serif"}} axisLine={false} tickLine={false} width={46}/>
                <Tooltip content={<ChartTooltip T={T}/>}/>
                <Legend wrapperStyle={{fontSize:11,fontFamily:"'Manrope',sans-serif",color:T.textSub}}/>
                <Area type="monotone" dataKey="income" name="Income" stroke={T.success} strokeWidth={2} fill="url(#incGrad)"/>
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke={T.danger} strokeWidth={2} fill="url(#expGrad)"/>
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Category Bars */}
        <div className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24, boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }}>
          <SectionHeader title="Expense Categories" subtitle="Distribution" T={T}/>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData} layout="vertical" margin={{top:0,right:16,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false}/>
              <XAxis type="number" tickFormatter={v=>`₹${v/1000}K`} tick={{fontSize:10,fill:T.textMuted,fontFamily:"'Manrope',sans-serif"}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" width={90} tick={{fontSize:11,fill:T.textSub,fontFamily:"'Manrope',sans-serif"}} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip T={T}/>}/>
              <Bar dataKey="value" name="Spent" radius={[0,4,4,0]}>
                {catData.map((_,i)=><Cell key={i} fill={CAT_COLORS[i%CAT_COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income Sources */}
        <div className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24, boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }}>
          <SectionHeader title="Income Sources" subtitle="Breakdown" T={T}/>
          {(() => {
            const incMap = {};
            transactions.filter(t=>t.type==="income").forEach(t=>{incMap[t.category]=(incMap[t.category]||0)+t.amount;});
            const incData = Object.entries(incMap).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
            return (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={incData} cx="50%" cy="50%" outerRadius={65} dataKey="value" paddingAngle={3} strokeWidth={0}
                      label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}
                      labelLine={false}>
                      {incData.map((_,i)=><Cell key={i} fill={[T.success,T.accent,T.teal][i%3]}/>)}
                    </Pie>
                    <Tooltip formatter={v=>fmtINR(v)} contentStyle={{ background:T.surface, border:`1px solid ${T.borderAccent}`, borderRadius:8, fontSize:12, fontFamily:"'Manrope',sans-serif", color:T.text }}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:8 }}>
                  {incData.map((d,i)=>(
                    <div key={d.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:[T.success,T.accent,T.teal][i%3] }}/>
                        <span style={{ fontSize:12, color:T.textSub }}>{d.name}</span>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:13, fontWeight:700, color:T.text, fontFamily:"'IBM Plex Mono',monospace" }}>{fmtINR(d.value,true)}</div>
                        <div style={{ fontSize:10, color:T.textMuted }}>{((d.value/totalIncome)*100).toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ─── BUDGETS PAGE ─────────────────────────────────────────────────────────────
function BudgetsPage({ transactions, T }) {
  const { role, addToast } = useApp();
  const [budgets, setBudgets] = useState(() => {
    try { const s = localStorage.getItem("fd_budgets"); return s ? JSON.parse(s) : BUDGETS; } catch { return BUDGETS; }
  });
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");

  useEffect(() => { try { localStorage.setItem("fd_budgets", JSON.stringify(budgets)); } catch {} }, [budgets]);

  // Current month spending
  const currentMonth = new Date().toISOString().slice(0,7);
  const monthTx = transactions.filter(t => t.date.startsWith("2025-04")); // use Apr as "current"
  const spendingMap = {};
  monthTx.filter(t=>t.type==="expense").forEach(t => { spendingMap[t.category]=(spendingMap[t.category]||0)+Math.abs(t.amount); });

  const totalBudget = Object.values(budgets).reduce((a,v)=>a+v,0);
  const totalSpent = Object.entries(budgets).reduce((a,[k])=>a+(spendingMap[k]||0),0);
  const overBudgetCats = Object.entries(budgets).filter(([k,v])=>(spendingMap[k]||0)>v).length;

  const saveEdit = (cat) => {
    const v = parseFloat(editVal);
    if (isNaN(v) || v <= 0) return;
    setBudgets(p=>({...p,[cat]:v}));
    setEditing(null);
    addToast({ msg:`Budget for ${cat} updated to ${fmtINR(v,true)}`, type:"success" });
  };

  return (
    <div className="fd-page">
      {/* Summary */}
      <div className="fd-stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:20 }}>
        {[
          { label:"Total Budget", value:totalBudget, color:T.accent, icon:Target },
          { label:"Total Spent", value:totalSpent, color:T.warning, icon:CreditCard },
          { label:"Remaining", value:totalBudget-totalSpent, color:totalBudget-totalSpent>0?T.success:T.danger, icon:Wallet },
        ].map((s,i)=>(
          <div key={i} className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24,
            animation:`fadeUp 0.4s ${i*60}ms cubic-bezier(0.22,1,0.36,1) both`, boxShadow:"0 1px 3px rgba(0,0,0,0.15)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${s.color},transparent)`, opacity:0.7 }}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>{s.label}</span>
              <s.icon size={15} color={s.color}/>
            </div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:T.text, letterSpacing:"-0.02em" }}>
              <AnimatedNumber value={s.value} formatter={v=>fmtINR(v,true)}/>
            </div>
          </div>
        ))}
      </div>

      {overBudgetCats > 0 && (
        <div style={{ background:`${T.danger}10`, border:`1px solid ${T.danger}25`, borderRadius:12, padding:"14px 18px", marginBottom:20,
          display:"flex", alignItems:"center", gap:12, animation:"fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both" }}>
          <AlertCircle size={16} color={T.danger}/>
          <span style={{ fontSize:13, color:T.danger, fontWeight:600 }}>
            {overBudgetCats} {overBudgetCats===1?"category has":"categories have"} exceeded budget this month. Review your spending.
          </span>
        </div>
      )}

      <div className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24,
        boxShadow:"0 1px 3px rgba(0,0,0,0.15)", animation:"fadeUp 0.4s 0.1s cubic-bezier(0.22,1,0.36,1) both" }}>
        <SectionHeader title="Monthly Budget Tracker" subtitle="April 2025"
          action={role==="admin"&&<Badge label="Click to edit" color={T.accent} T={T}/>} T={T}/>
        {Object.entries(budgets).map(([cat, budget], i) => {
          const spent = spendingMap[cat] || 0;
          if (editing === cat) return (
            <div key={cat} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, padding:"12px 14px", background:T.accentGlow, borderRadius:10, border:`1px solid ${T.borderAccent}` }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.text, flex:1 }}>{cat}</span>
              <input type="number" value={editVal} onChange={e=>setEditVal(e.target.value)}
                autoFocus className="fd-input"
                style={{ width:120, padding:"7px 11px", background:T.surfaceAlt, border:`1px solid ${T.borderAccent}`, borderRadius:8, color:T.text, fontSize:13, fontFamily:"'IBM Plex Mono',monospace" }}
                onKeyDown={e=>{if(e.key==="Enter")saveEdit(cat);if(e.key==="Escape")setEditing(null);}}/>
              <button className="fd-btn" onClick={()=>saveEdit(cat)}
                style={{ padding:"7px 14px", background:T.accent, borderRadius:8, color:"#fff", fontSize:12, fontWeight:700, fontFamily:"'Manrope',sans-serif" }}>Save</button>
              <button className="fd-btn" onClick={()=>setEditing(null)}
                style={{ padding:"7px", background:T.surfaceAlt, borderRadius:8, color:T.textMuted }}><X size={13}/></button>
            </div>
          );
          return (
            <div key={cat} onClick={()=>role==="admin"&&(setEditing(cat),setEditVal(String(budget)))}
              style={{ cursor: role==="admin" ? "pointer" : "default", borderRadius:8, padding:"4px 0",
                transition:"background 0.15s" }}>
              <BudgetBar cat={cat} spent={spent} budget={budget} T={T} color={CAT_COLORS[i%CAT_COLORS.length]}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── INSIGHTS PAGE ────────────────────────────────────────────────────────────
function InsightsPage({ transactions, T }) {
  const income = transactions.filter(t=>t.type==="income").reduce((a,t)=>a+t.amount,0);
  const expenses = Math.abs(transactions.filter(t=>t.type==="expense").reduce((a,t)=>a+t.amount,0));
  const savingsRate = income>0 ? ((income-expenses)/income)*100 : 0;
  const catMap = {};
  transactions.filter(t=>t.type==="expense").forEach(t=>{ catMap[t.category]=(catMap[t.category]||0)+Math.abs(t.amount); });
  const sortedCats = Object.entries(catMap).sort((a,b)=>b[1]-a[1]);
  const topCat = sortedCats[0];
  const avgExpense = transactions.filter(t=>t.type==="expense").length ?
    expenses / transactions.filter(t=>t.type==="expense").length : 0;

  const insights = [
    { icon:"💎", title:"Savings Rate", value:`${savingsRate.toFixed(1)}%`, sub: savingsRate>=20 ? "Excellent! Above the recommended 20% benchmark." : "Below recommended 20%. Consider reducing discretionary spending.", color: savingsRate>=20?T.success:T.warning, level: savingsRate>=20?"good":"warn" },
    { icon:"🏆", title:"Top Expense", value:topCat?topCat[0]:"—", sub:`₹${topCat?topCat[1].toLocaleString("en-IN"):0} spent — ${topCat?((topCat[1]/expenses)*100).toFixed(1):0}% of total expenses.`, color:T.danger, level:"info" },
    { icon:"📊", title:"Avg Transaction", value:fmtINR(avgExpense,true), sub:`Across ${transactions.filter(t=>t.type==="expense").length} expense transactions this period.`, color:T.accent, level:"info" },
    { icon:"💰", title:"Net Surplus", value:fmtINR(income-expenses,true), sub:`After all expenses. ${((income-expenses)/income*100).toFixed(1)}% of gross income retained.`, color:T.teal, level:"good" },
  ];

  const recommendations = [
    { title:"Housing Efficiency", desc:`Rent at ${fmtINR(catMap["Housing"]||0,true)} represents ${((catMap["Housing"]||0)/income*100).toFixed(1)}% of income. Financial best practice recommends keeping this below 30%.`, icon:"🏠", color:T.accent },
    { title:"Build an Emergency Fund", desc:`With a ${savingsRate.toFixed(0)}% savings rate, you could accumulate 3–6 months of expenses (${fmtINR(expenses*4,true)}) as an emergency cushion within a year.`, icon:"🛡️", color:T.success },
    { title:"Investment Opportunity", desc:`Your freelance income of ${fmtINR(transactions.filter(t=>t.category==="Freelance").reduce((a,t)=>a+t.amount,0),true)} can be strategically directed into SIPs or index funds.`, icon:"📈", color:T.violet },
    { title:"Food Spending Review", desc:`${fmtINR(catMap["Food & Dining"]||0,true)} on food this period. Meal prepping and reducing delivery orders could save ${fmtINR((catMap["Food & Dining"]||0)*0.3,true)} monthly.`, icon:"🍽️", color:T.warning },
  ];

  return (
    <div className="fd-page">
      {/* Insight Cards */}
      <div className="fd-stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
        {insights.map((ins,i)=>(
          <div key={i} className="fd-card" style={{ background:T.surface, border:`1px solid ${ins.color}25`, borderRadius:16, padding:22,
            animation:`fadeUp 0.4s ${i*60}ms cubic-bezier(0.22,1,0.36,1) both`, boxShadow:"0 1px 3px rgba(0,0,0,0.15)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:ins.color, opacity:0.7 }}/>
            <div style={{ fontSize:24, marginBottom:12 }}>{ins.icon}</div>
            <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>{ins.title}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:ins.color, marginBottom:8 }}>{ins.value}</div>
            <div style={{ fontSize:12, color:T.textMuted, lineHeight:1.6 }}>{ins.sub}</div>
          </div>
        ))}
      </div>

      {/* Spending Heatmap-style table */}
      <div className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24, marginBottom:16,
        boxShadow:"0 1px 3px rgba(0,0,0,0.15)", animation:"fadeUp 0.4s 0.2s cubic-bezier(0.22,1,0.36,1) both" }}>
        <SectionHeader title="Spending Intensity" subtitle="Category Analysis" T={T}/>
        {sortedCats.map(([cat, spent], i) => {
          const budget = BUDGETS[cat] || spent;
          const pct = Math.min((spent/expenses)*100, 100);
          const color = CAT_COLORS[i % CAT_COLORS.length];
          return (
            <div key={cat} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderBottom: i<sortedCats.length-1?`1px solid ${T.border}`:"none" }}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:color }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{cat}</span>
                  <span style={{ fontSize:12, fontWeight:700, color, fontFamily:"'IBM Plex Mono',monospace" }}>{fmtINR(spent,true)}</span>
                </div>
                <div style={{ height:5, borderRadius:3, background:T.surfaceAlt }}>
                  <div className="fd-progress-bar" style={{ height:"100%", width:`${pct}%`, "--target-width":`${pct}%`, borderRadius:3, background:color }}/>
                </div>
              </div>
              <div style={{ width:44, textAlign:"right" }}>
                <span style={{ fontSize:11, fontWeight:700, color:T.textMuted }}>{pct.toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="fd-card" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:24,
        boxShadow:"0 1px 3px rgba(0,0,0,0.15)", animation:"fadeUp 0.4s 0.25s cubic-bezier(0.22,1,0.36,1) both" }}>
        <SectionHeader title="Smart Recommendations" subtitle="Personalized Insights" T={T}/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {recommendations.map((rec,i)=>(
            <div key={i} style={{ background:T.surfaceAlt, borderRadius:12, padding:18, border:`1px solid ${T.border}`,
              transition:"border-color 0.2s, transform 0.2s", cursor:"default" }}
              className="fd-card">
              <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{rec.icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:6 }}>{rec.title}</div>
                  <div style={{ fontSize:12, color:T.textMuted, lineHeight:1.7 }}>{rec.desc}</div>
                </div>
              </div>
              <div style={{ marginTop:12, height:2, borderRadius:1, background:`linear-gradient(90deg,${rec.color},transparent)`, opacity:0.6 }}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("overview");
  const [role, setRole] = useState("viewer");
  const [transactions, setTransactions] = useState(ALL_TRANSACTIONS);
  const [toasts, setToasts] = useState([]);

  const T = dark ? TOKENS.dark : TOKENS.light;

  // Inject CSS once
  useEffect(() => {
    injectCSS();
  }, []);

  // Toast handler
  const addToast = (toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppCtx.Provider value={{ role, setRole, addToast, T }}>
      <div style={{ display: "flex", height: "100vh", background: T.bg }}>

        {/* Sidebar */}
        <Sidebar page={page} setPage={setPage} T={T} dark={dark} />

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          
          <Header page={page} T={T} dark={dark} setDark={setDark} />

          <div className="fd-main-content" style={{ flex: 1, overflow: "auto", padding: 24 }}>

            {page === "overview" && (
              <OverviewPage transactions={transactions} T={T} />
            )}

            {page === "transactions" && (
              <TransactionsPage
                transactions={transactions}
                setTransactions={setTransactions}
                T={T}
              />
            )}

            {page === "analytics" && (
              <AnalyticsPage transactions={transactions} T={T} />
            )}

            {page === "budgets" && (
              <BudgetsPage transactions={transactions} T={T} />
            )}

            {page === "insights" && (
              <InsightsPage transactions={transactions} T={T} />
            )}

          </div>
        </div>

        {/* Mobile Nav */}
        <MobileNav page={page} setPage={setPage} T={T} />

        {/* Toasts */}
        <ToastContainer toasts={toasts} removeToast={removeToast} T={T} />

      </div>
    </AppCtx.Provider>
  );
}