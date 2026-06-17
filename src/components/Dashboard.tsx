'use client';
import { CAMPAIGNS, WEEKLY_STATS } from '@/lib/data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard({ onNav }: { onNav: (k: string) => void }) {
  const active = CAMPAIGNS.filter(c => c.status === 'active');
  const totalProspects = CAMPAIGNS.reduce((a, c) => a + c.prospects, 0);
  const totalConnected = CAMPAIGNS.reduce((a, c) => a + c.connected, 0);
  const totalReplied = CAMPAIGNS.reduce((a, c) => a + c.replied, 0);
  const avgConnection = totalProspects > 0 ? Math.round((totalConnected / totalProspects) * 100) : 0;

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1d1d1d', margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>Good morning, Shakhawet. Here is your outreach overview.</p>
        </div>
        <button className="btn-primary" onClick={() => onNav('campaigns')}>+ New Campaign</button>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Prospects', value: totalProspects, sub: 'across all campaigns', color: '#0077B5' },
          { label: 'Connected', value: totalConnected, sub: `${avgConnection}% avg rate`, color: '#2ecc71' },
          { label: 'Replied', value: totalReplied, sub: `${totalConnected > 0 ? Math.round((totalReplied/totalConnected)*100) : 0}% reply rate`, color: '#f39c12' },
          { label: 'Active Campaigns', value: active.length, sub: `${CAMPAIGNS.length} total`, color: '#9b59b6' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#1d1d1d', marginTop: 4 }}>{s.label}</div>
            <div className="stat-label">{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
        {/* WEEKLY ACTIVITY CHART */}
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: '#1d1d1d' }}>Weekly Activity</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={WEEKLY_STATS} barGap={2}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 6, border: '1px solid #e0ddd8' }} />
              <Bar dataKey="connections" fill="#0077B5" radius={[3,3,0,0]} name="Connections" />
              <Bar dataKey="replies" fill="#2ecc71" radius={[3,3,0,0]} name="Replies" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#0077B5', display: 'inline-block' }}></span> Connections
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#2ecc71', display: 'inline-block' }}></span> Replies
            </div>
          </div>
        </div>

        {/* PROTECTION STATUS */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#1d1d1d' }}>LinkedIn Protection</div>
            <span className="badge badge-green">⛨ Active</span>
          </div>
          {[
            { label: 'Daily connection limit', value: 28, max: 30, color: '#2ecc71' },
            { label: 'Messages sent today', value: 45, max: 80, color: '#0077B5' },
            { label: 'Profile views', value: 62, max: 100, color: '#9b59b6' },
          ].map(q => (
            <div key={q.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#444' }}>{q.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1d' }}>{q.value} / {q.max}</span>
              </div>
              <div className="quota-bar-wrap">
                <div className="quota-bar-fill" style={{ width: `${(q.value/q.max)*100}%`, background: q.color }}></div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: '#888', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#2ecc71' }}>✓</span>
            Human behavior simulation ON — random delays active
          </div>
        </div>
      </div>

      {/* ACTIVE CAMPAIGNS */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#1d1d1d' }}>Active Campaigns</div>
          <button className="btn-ghost btn-sm" onClick={() => onNav('campaigns')}>View all</button>
        </div>
        {active.map(c => (
          <div key={c.id} className="campaign-row">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ecc71', flexShrink: 0 }}></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1d1d1d' }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{c.target}</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 70 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#0077B5' }}>{c.connectionRate}%</div>
              <div style={{ fontSize: 11, color: '#888' }}>connect</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 70 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#2ecc71' }}>{c.replyRate}%</div>
              <div style={{ fontSize: 11, color: '#888' }}>reply</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 70 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1d1d1d' }}>{c.prospects}</div>
              <div style={{ fontSize: 11, color: '#888' }}>prospects</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
