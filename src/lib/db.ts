import { createClient } from './supabase'

// ─── CAMPAIGNS ───────────────────────────────

export async function getCampaigns() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createCampaign(values: {
  name: string
  target_service: string
  target_roles: string
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      owner_id: user.id,
      name: values.name,
      target_service: values.target_service,
      target_roles: values.target_roles,
      status: 'draft',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCampaignStatus(id: string, status: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('campaigns')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteCampaign(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── PROSPECTS ───────────────────────────────

export async function getProspects(campaignId?: string) {
  const supabase = createClient()
  let query = supabase
    .from('prospects')
    .select('*, campaigns(name)')
    .order('added_at', { ascending: false })
  if (campaignId) query = query.eq('campaign_id', campaignId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createProspect(values: {
  campaign_id: string
  name: string
  title?: string
  company?: string
  location?: string
  linkedin_url?: string
  email?: string
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('prospects')
    .insert({ ...values, owner_id: user.id, status: 'pending', last_action: 'Added to campaign' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProspectStatus(id: string, status: string, last_action: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('prospects')
    .update({ status, last_action })
    .eq('id', id)
  if (error) throw error
}

export async function importProspectsFromCSV(rows: Record<string, string>[], campaignId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const records = rows.map(r => ({
    owner_id: user.id,
    campaign_id: campaignId,
    name: r['name'] || r['Name'] || r['Full Name'] || '',
    title: r['title'] || r['Title'] || r['Designation'] || '',
    company: r['company'] || r['Company'] || r['Company Name'] || '',
    location: r['location'] || r['Location'] || r['Country'] || '',
    linkedin_url: r['linkedin_url'] || r['LinkedIn URL'] || '',
    email: r['email'] || r['Email'] || '',
    status: 'pending',
    last_action: 'Imported from CSV',
  })).filter(r => r.name)

  const { data, error } = await supabase
    .from('prospects')
    .insert(records)
    .select()
  if (error) throw error
  return data ?? []
}

// ─── MESSAGES ────────────────────────────────

export async function getMessages() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*, message_threads(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function sendMessage(messageId: string, text: string) {
  const supabase = createClient()
  const { error: threadError } = await supabase
    .from('message_threads')
    .insert({ message_id: messageId, role: 'out', text })
  if (threadError) throw threadError

  const { error: previewError } = await supabase
    .from('messages')
    .update({ preview: text, unread: false })
    .eq('id', messageId)
  if (previewError) throw previewError
}

export async function markMessageRead(id: string) {
  const supabase = createClient()
  await supabase.from('messages').update({ unread: false }).eq('id', id)
}