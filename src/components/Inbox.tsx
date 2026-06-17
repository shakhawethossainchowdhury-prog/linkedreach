'use client';
import { useState } from 'react';
import { MESSAGES } from '@/lib/data';

export default function Inbox() {
  const [messages, setMessages] = useState(MESSAGES);
  const [active, setActive] = useState(MESSAGES[0]);
  const [reply, setReply] = useState('');

  function selectMsg(m: typeof MESSAGES[0]) {
    setActive(m);
    setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, unread: false } : msg));
  }

  function sendReply() {
    if (!reply.trim()) return;
    const updated = {
      ...active,
      thread: [...active.thread, { role: 'out' as const, text: reply, time: 'Just now' }],
      preview: reply,
      unread: false,
    };
    setActive(updated);
    setMessages(prev => prev.map(m => m.id === active.id ? updated : m));
    setReply('');
  }

  const unreadCount = messages.filter(m => m.unread).length;

  return (
    <div className="page-body" style={{ padding: 0 }}>
      <div style={{ display: 'flex', height: 'calc(100vh - 56px)' }}>
        {/* LEFT PANE */}
        <div className="inbox-sidebar">
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #e0ddd8', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Inbox</div>
            {unreadCount > 0 && <div style={{ fontSize: 12, color: '#e53e3e', marginTop: 2 }}>{unreadCount} unread</div>}
            <input className="input-field" placeholder="Search conversations..." style={{ marginTop: 10, fontSize: 13 }} />
          </div>
          {messages.map(m => (
            <div key={m.id} className={`inbox-item ${active.id === m.id ? 'active-inbox' : ''}`} onClick={() => selectMsg(m)}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div className="avatar" style={{ fontSize: 11 }}>{m.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: m.unread ? 700 : 600, fontSize: 14, color: '#1d1d1d' }}>{m.from}</span>
                    <span style={{ fontSize: 11, color: '#888' }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 1 }}>{m.company}</div>
                  <div style={{
                    fontSize: 12, color: m.unread ? '#1d1d1d' : '#888', marginTop: 3,
                    fontWeight: m.unread ? 600 : 400,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{m.preview}</div>
                </div>
                {m.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0077B5', flexShrink: 0, marginTop: 4 }}></div>}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT PANE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0ddd8', background: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="avatar">{active.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{active.from}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{active.company}</div>
            </div>
            <span className="badge badge-green">🔥 Hot Lead</span>
            <button className="btn-primary btn-sm">📅 Book Meeting</button>
          </div>

          {/* Thread */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, background: '#f8f7f5' }}>
            {active.thread.map((t, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: t.role === 'out' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-end' }}>
                {t.role === 'in' && <div className="avatar" style={{ fontSize: 11 }}>{active.avatar}</div>}
                <div>
                  <div className={`msg-bubble ${t.role === 'out' ? 'msg-out' : 'msg-in'}`}>{t.text}</div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 4, textAlign: t.role === 'out' ? 'right' : 'left' }}>{t.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Compose */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e0ddd8', background: '#fff' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <textarea
                className="input-field"
                placeholder="Write your reply..."
                rows={2}
                value={reply}
                onChange={e => setReply(e.target.value)}
                style={{ resize: 'none', flex: 1 }}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply(); }}
              />
              <button className="btn-primary" onClick={sendReply} style={{ alignSelf: 'flex-end' }}>
                Send ↑
              </button>
            </div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 6 }}>Ctrl+Enter to send</div>
          </div>
        </div>
      </div>
    </div>
  );
}
