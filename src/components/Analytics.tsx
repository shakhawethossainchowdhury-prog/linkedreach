'use client';
import { CAMPAIGNS, WEEKLY_STATS } from '@/lib/data';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';

const PIE_DATA = [
  { name: 'Connected', value: 335, color: '#0077B5' },
  { name: 'Replied', value: 117, color: '#2ecc71' },
  { name: 'Meeting', value: 23, color: '#f39c12' },
  { name: 'No Response', value: 405, color: '#e0ddd8' },
];

const MONTHLY = [
  { month: 'Jan', invites: 210, connections: 78, replies: 24 },
  { month: 'Feb', invites: 245, connections: 91, replies: 31 },
  { month: 'Mar', invites: 290, connections: 108, replies: 38 },
  { month: 'Apr', invites: 312, connections: 118, replies: 44 },
  { month: 'May', invites: 380, connections: 142, replies: 52 },
  { month: 'Jun', invites: 168, connections: 64, replies: 22 },
];

export default function Analytics() {
  const totalProspects = CAMPAIGNS.reduce((a, c) => a + c.prospects, 0);
  const totalConnected = CAMPAIGNS.reduce((a, c) => a + c.connected, 0);
  const totalReplied = CAMPAIGNS.reduce((a, c) => a + c.replied, 0);

  return (
    <div className="page-body">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Analytics & Reports</h1>
        <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>Performance across all campaigns</p>
      </div>

      {/* KPI ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'Total Invited', value: totalProspects, color: '#0077B5' },
          { label: 'Connected', value: totalConnected, color: '#2ecc71' },
          { label: 'Replied', value: totalReplied, color: '#f39c12' },
          { label: 'Connection Rate', value: `${Math.round((totalConnected/totalProspects)*100)}%`, color: '#9b59b6' },
          { label: 'Reply Rate', value: `${totalConnected > 0 ? Math.round((totalReplied/totalConnected)*100) : 0}%`, color: '#e74c3c' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* MONTHLY TREND */}
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Monthly Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeeb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 6, border: '1px solid #e0ddd8' }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="invites" stroke="#ccc" strokeWidth={2} dot={false} name="Invites" />
              <Line type="monotone" dataKey="connections" stroke="#0077B5" strokeWidth={2} dot={false} name="Connections" />
              <Line type="monotone" dataKey="replies" stroke="#2ecc71" strokeWidth={2} dot={false} name="Replies" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* OUTCOME PIE */}
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Prospect Outcomes</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <PieChart width={160} height={160}>
              <Pie data={PIE_DATA} cx={75} cy={75} innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={0}>
                {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1 }}>
              {PIE_DATA.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }}></div>
                    <span style={{ fontSize: 13, color: '#444' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CAMPAIGN BREAKDOWN TABLE */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Campaign Breakdown</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Prospects</th>
                <th>Connected</th>
                <th>Replied</th>
                <th>Connection %</th>
                <th>Reply %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map(c => (
                <tr key={c.id}>
                  <td><span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span></td>
                  <td>{c.prospects}</td>
                  <td>{c.connected}</td>
                  <td>{c.replied}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: `${c.connectionRate}%` }}></div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{c.connectionRate}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: `${c.replyRate}%`, background: '#2ecc71' }}></div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#2ecc71' }}>{c.replyRate}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${c.status === 'active' ? 'badge-green' : c.status === 'paused' ? 'badge-orange' : c.status === 'draft' ? 'badge-gray' : 'badge-blue'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WEEKLY BARS */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>This Week's Activity</div>
          <button className="btn-ghost btn-sm">⬇ Export CSV</button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={WEEKLY_STATS}>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 13, borderRadius: 6, border: '1px solid #e0ddd8' }} />
            <Bar dataKey="connections" fill="#0077B5" radius={[3,3,0,0]} name="Connections" />
            <Bar dataKey="replies" fill="#2ecc71" radius={[3,3,0,0]} name="Replies" />
            <Bar dataKey="views" fill="#e8f4fd" radius={[3,3,0,0]} name="Profile Views" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
