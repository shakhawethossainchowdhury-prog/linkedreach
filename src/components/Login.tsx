'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit() {
    setError('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name } }
      })
      if (error) setError(error.message)
      else setError('Account created! You can now log in.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f3f2ef',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ width: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: '#0077B5', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 24, marginBottom: 12
          }}>L</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1d1d1d' }}>LinkedReach</div>
          <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>BS23 Internal Outreach Tool</div>
        </div>

        {/* Card */}
        <div className="card">
          {/* Tab toggle */}
          <div style={{ display: 'flex', marginBottom: 24, background: '#f3f2ef', borderRadius: 8, padding: 4 }}>
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 6, border: 'none',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? '#0077B5' : '#666',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s'
                }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {mode === 'signup' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                Full Name
              </label>
              <input className="input-field" placeholder="Shakhawet Hossain"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Work Email
            </label>
            <input className="input-field" type="email" placeholder="you@bs23.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: '#444', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Password
            </label>
            <input className="input-field" type="password" placeholder="Min 6 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 13,
              background: error.includes('created') ? '#e6f4ea' : '#fce8e8',
              color: error.includes('created') ? '#1a5c2a' : '#c62828',
              border: `1px solid ${error.includes('created') ? '#a8d5b5' : '#f5c0c0'}`
            }}>{error}</div>
          )}

          <button className="btn-primary" onClick={handleSubmit}
            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: 15, opacity: loading ? 0.7 : 1 }}
            disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#888' }}>
            Internal use only · Brain Station 23
          </div>
        </div>
      </div>
    </div>
  )
}