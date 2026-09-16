'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/admin')
    })
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMessage(error.message); setLoading(false); return }
    router.replace('/admin')
  }

  return <main className="container flex min-h-[75vh] items-center justify-center py-12">
    <form onSubmit={submit} className="card w-full max-w-md space-y-5 p-8">
      <div><p className="text-sm font-bold text-[#e97827]">N FOR EAT JASTIP</p><h1 className="mt-1 text-3xl font-black">Admin Login</h1><p className="mt-2 text-sm opacity-70">Masuk untuk mengelola pesanan dan katalog.</p></div>
      <label className="block text-sm font-bold">Email<input type="email" required className="mt-2 w-full rounded-xl border p-3 font-normal" value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label className="block text-sm font-bold">Password<input type="password" required className="mt-2 w-full rounded-xl border p-3 font-normal" value={password} onChange={e=>setPassword(e.target.value)} /></label>
      {message && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{message}</p>}
      <button disabled={loading} className="btn btn-primary w-full">{loading?'Memproses…':'Masuk'}</button>
    </form>
  </main>
}
