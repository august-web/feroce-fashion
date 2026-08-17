import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminShell, type AdminView } from '../components/admin/AdminShell'
import { AdminOverview } from '../components/admin/AdminOverview'
import { AdminOrders } from '../components/admin/AdminOrders'
import { AdminProducts } from '../components/admin/AdminProducts'
import { AdminCollections, AdminCustomers } from '../components/admin/AdminSecondary'
import { AdminSettings } from '../components/admin/AdminSettings'
import { Button } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { useSeo } from '../lib/seo'

type Access='loading'|'signed-out'|'denied'|'admin'
export function AdminPage(){
 useSeo('Admin','Secure administration for FÉROCE.')
 const[access,setAccess]=useState<Access>('loading');const[view,setView]=useState<AdminView>('overview')
 useEffect(()=>{check();if(!supabase)return;const{data}=supabase.auth.onAuthStateChange(()=>check());return()=>data.subscription.unsubscribe()},[])
 async function check(){if(!supabase){setAccess('signed-out');return}const{data}=await supabase.auth.getSession();if(!data.session){setAccess('signed-out');return}const{data:profile}=await supabase.from('profiles').select('role').eq('id',data.session.user.id).single();setAccess(profile?.role==='admin'?'admin':'denied')}
 async function exit(){if(supabase)await supabase.auth.signOut();setAccess('signed-out')}
 if(access==='admin')return <AdminShell view={view} setView={setView} preview={false} onExit={exit}>{view==='overview'?<AdminOverview/>:view==='orders'?<AdminOrders/>:view==='products'?<AdminProducts/>:view==='collections'?<AdminCollections/>:view==='settings'?<AdminSettings/>:<AdminCustomers/>}</AdminShell>
 if(access==='loading')return <main className="grid min-h-screen place-items-center bg-ink text-white"><span className="text-[9px] uppercase tracking-luxury">Verifying administrator…</span></main>
 if(access==='denied')return <main className="grid min-h-screen place-items-center bg-ink px-5 text-center text-white"><div><ShieldCheck className="mx-auto" size={36} strokeWidth={1}/><h1 className="mt-6 font-display text-5xl">Access restricted.</h1><p className="mt-4 max-w-md text-sm leading-6 text-white/50">This authenticated account does not hold an administrator role. Access is enforced by the database and protected route checks.</p><Link to="/" className="mt-8 inline-block border-b border-white pb-1 text-[9px] uppercase tracking-luxury">Return to storefront</Link></div></main>
 return <AdminLogin onAuthenticated={check}/>
}
function AdminLogin({onAuthenticated}:{onAuthenticated:()=>void}){const[email,setEmail]=useState('');const[password,setPassword]=useState('');const[busy,setBusy]=useState(false);const{notify}=useToast();async function login(e:React.FormEvent){e.preventDefault();if(!supabase)return notify('Secure sign-in is not available yet.');setBusy(true);const{error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);if(error)notify(error.message);else onAuthenticated()}return <main className="grid min-h-screen bg-ink text-white lg:grid-cols-2"><div className="relative hidden lg:block"><img src="/images/atelier.jpg" alt="FÉROCE administration" className="absolute inset-0 h-full w-full object-cover opacity-70"/><div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink"/></div><div className="flex items-center px-6 py-16 sm:px-14 lg:px-20"><div className="mx-auto w-full max-w-md"><Link to="/" className="font-display text-2xl tracking-[.16em]">FÉROCE</Link><div className="mt-16 flex h-11 w-11 items-center justify-center border border-white/20"><LockKeyhole size={18}/></div><p className="mt-7 text-[9px] uppercase tracking-luxury text-white/40">Protected operations</p><h1 className="mt-4 font-display text-5xl">Store command.</h1><p className="mt-4 text-sm leading-6 text-white/50">Authorized access only.</p>{!isSupabaseConfigured&&<div className="mt-6 border border-[#d6b98a]/30 bg-white/5 p-4 text-xs leading-5 text-white/55">Secure sign-in will be activated before launch.</div>}<form onSubmit={login} className="mt-8 space-y-4"><label className="block"><span className="mb-2 block text-[8px] uppercase tracking-widest text-white/50">Admin email</span><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-white/20 bg-transparent p-4 text-sm outline-none focus:border-white"/></label><label className="block"><span className="mb-2 block text-[8px] uppercase tracking-widest text-white/50">Password</span><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-white/20 bg-transparent p-4 text-sm outline-none focus:border-white"/></label><Button disabled={busy} variant="light" className="w-full">{busy?'Verifying…':'Secure sign in'}</Button></form></div></div></main>}
