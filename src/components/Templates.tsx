'use client';
import { useState } from 'react';
import { TEMPLATES } from '@/lib/data';

const STEP_TEMPLATES: Record<string, { subject: string; body: string }[]> = {
  't1': [
    { subject: 'Visit Profile', body: 'Auto-action: Visit prospect profile' },
    { subject: 'Connection Request', body: 'Hi {{firstName}}, saw that {{company}} is expanding operations. We help manufacturers like you get real-time inventory visibility across sites. Would love to connect.' },
    { subject: 'Welcome Message', body: 'Hi {{firstName}}, thanks for connecting! We have helped similar businesses in {{industry}} streamline their ERP and inventory management. Happy to share a relevant case study if useful.' },
    { subject: 'Follow-up #1', body: 'Hi {{firstName}}, just following up. Many operations teams we work with were managing stock via Excel before it stopped scaling. Curious if that is something {{company}} is working through?' },
    { subject: 'Follow-up #2', body: 'Hi {{firstName}}, last note from my end. If ERP or inventory automation is on your radar for this year, happy to share what we have done for similar businesses. No pressure either way.' },
  ],
};

export default function Templates({ onNav }: { onNav: (k: string) => void }) {
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null);
  const [filter, setFilter] = useState('All');
  const services = ['All', 'ERP', 'Fintech', 'Cloud', 'Shopify', 'Staff Augmentation'];
  const filtered = filter === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.service === filter);
  const steps = selected ? (STEP_TEMPLATES[selected.id] || STEP_TEMPLATES['t1']) : [];

  if (selected) {
    return (
      <div className="page-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button className="btn-ghost btn-sm" onClick={() => setSelected(null)}>← Back</button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selected.name}</h2>
          <span className="tag">{selected.service}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>About this template</div>
              <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{selected.desc}</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
                <div><span style={{ fontSize: 12, color: '#888' }}>Steps: </span><span style={{ fontWeight: 600 }}>{selected.steps}</span></div>
                <div><span style={{ fontSize: 12, color: '#888' }}>Avg use rate: </span><span style={{ fontWeight: 600, color: '#0077B5' }}>{selected.useRate}%</span></div>
              </div>
            </div>

            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Sequence Messages</div>
            {steps.map((step, i) => (
              <div key={i} className="card" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--li-blue)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#0077B5' }}>{step.subject}</span>
                </div>
                <div style={{
                  background: '#f8f7f5', borderRadius: 6, padding: '12px 14px',
                  fontSize: 13, color: '#333', lineHeight: 1.7,
                  borderLeft: '3px solid var(--li-blue)',
                }}>{step.body}</div>
                {i < steps.length - 1 && (
                  <div style={{ fontSize: 12, color: '#888', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    ⏱ Wait 3–5 days before next step
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="card" style={{ position: 'sticky', top: 80 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Variables</div>
              {['{{firstName}}', '{{lastName}}', '{{company}}', '{{industry}}', '{{jobTitle}}'].map(v => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0eeeb' }}>
                  <code style={{ fontSize: 12, background: '#f0eeeb', padding: '2px 8px', borderRadius: 4, color: '#0077B5' }}>{v}</code>
                  <span style={{ fontSize: 12, color: '#888' }}>Auto-filled</span>
                </div>
              ))}
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
                onClick={() => onNav('campaigns')}>
                Use This Template
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Sequence Templates</h1>
          <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>Pre-built outreach sequences for each BS23 service line</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {services.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontWeight: filter === s ? 600 : 400,
              background: filter === s ? 'var(--li-blue)' : '#fff',
              color: filter === s ? '#fff' : '#444',
              border: filter === s ? 'none' : '1px solid #d0cdc8',
            }}>{s}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {filtered.map(t => (
          <div key={t.id} className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
            onClick={() => setSelected(t)}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,119,181,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="tag">{t.service}</span>
              <span style={{ fontSize: 12, color: '#0077B5', fontWeight: 600 }}>{t.useRate}% use rate</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{t.name}</div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5, marginBottom: 14 }}>{t.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#888' }}>
                {Array.from({ length: t.steps }, (_, i) => (
                  <span key={i} style={{ display: 'inline-block', width: 20, height: 4, background: '#0077B5', borderRadius: 2, marginRight: 3, opacity: 0.6 + i * 0.1 }}></span>
                ))}
                {t.steps} steps
              </span>
              <button className="btn-primary btn-sm">Use →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
