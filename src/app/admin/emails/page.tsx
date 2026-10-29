'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Send,
  Eye,
  Mail,
  Megaphone,
  Tag,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Users,
  Search,
  Code2,
} from 'lucide-react'

interface Customer {
  id: string
  email: string
  role: string
  created_at: string
}
type RecipientFilter = 'all' | 'has_orders' | 'specific'

const EMAIL_TYPES = [
  {
    value: 'custom',
    label: 'Custom Dispatch',
    desc: 'Bespoke client memo or targeted atelier notice',
    icon: Mail,
  },
  {
    value: 'newsletter',
    label: 'Atelier Gazette',
    desc: 'Editorial seasonal drop with FÉROCE luxury branding',
    icon: Megaphone,
  },
  {
    value: 'welcome',
    label: 'Circle Welcome',
    desc: 'Introduction to Dallas atelier private access',
    icon: Tag,
  },
]

const TEMPLATES: Record<string, { subject: string; body: string }> = {
  custom: { subject: '', body: '<p>Compose your exclusive client correspondence...</p>' },
  newsletter: {
    subject: 'Atelier Seasonal Dispatch — FÉROCE Dallas',
    body: `<h2>Your exclusive FÉROCE preview.</h2>
<p>Crafted in Dallas with uncompromising attention to detail, our latest pieces are now available for allocation.</p>
<div class="divider"></div>
<p>Each silhouette represents our signature architectural aesthetic and refined leatherwork.</p>
<div style="text-align:center;margin:32px 0;">
  <a href="https://www.ferocefashionff.com/shop" class="btn btn-gold">EXPLORE NEW PIECES</a>
</div>`,
  },
  welcome: {
    subject: 'Welcome to the Circle — FÉROCE Dallas Atelier',
    body: `<h2>Welcome to the FÉROCE Circle.</h2>
<p>Thank you for joining our private registry. You now have priority access to limited edition drops, bespoke allocations, and Dallas atelier viewings.</p>
<div class="divider"></div>
<div style="text-align:center;margin:32px 0;">
  <a href="https://www.ferocefashionff.com/shop" class="btn">VIEW THE CATALOG</a>
</div>`,
  },
}

const PREVIEW_STYLES = [
  '.preview-container { font-family: sans-serif; color: #0A1128; max-width: 540px; margin: 0 auto; }',
  '.preview-container h2 { font-family: serif; font-size: 24px; margin: 0 0 16px; color: #0A1128; }',
  '.preview-container p { font-size: 14px; line-height: 1.7; color: #6b6b6b; margin: 0 0 16px; }',
  '.preview-container .divider { height: 1px; background: #E2DFD8; margin: 32px 0; }',
  '.preview-container .btn { display: inline-block; background: #0A1128; color: #fff; text-decoration: none; padding: 14px 32px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; border-radius: 9999px; }',
  '.preview-container .btn-gold { background: #D4AF37; color: #0A1128; }',
].join('\n')

export default function AdminEmailsPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedType, setSelectedType] = useState('custom')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState(TEMPLATES.custom.body)
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>('all')
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<{ success: boolean; count?: number; error?: string } | null>(null)

  useEffect(() => {
    const s = createClient()
    s.from('profiles')
      .select('id, email, role, created_at')
      .eq('role', 'customer')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setCustomers(data)
      })
  }, [])

  const handleTypeChange = useCallback((type: string) => {
    setSelectedType(type)
    const t = TEMPLATES[type]
    if (t) {
      setSubject(t.subject)
      setBody(t.body)
    }
  }, [])

  const fc = customers.filter((c) => c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  const toggle = (email: string) =>
    setSelectedEmails((p) =>
      p.includes(email) ? p.filter((e) => e !== email) : [...p, email]
    )
  const selAll = () => setSelectedEmails((p) => [...new Set([...p, ...fc.map((c) => c.email)])])
  const est =
    recipientFilter === 'all' || recipientFilter === 'has_orders'
      ? customers.length
      : selectedEmails.length
  const currentTypeObj = EMAIL_TYPES.find((t) => t.value === selectedType)

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return
    setSending(true)
    setSent(null)
    try {
      const res = await fetch('/api/admin/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          subject: subject.trim(),
          htmlContent: body,
          recipientFilter,
          recipientEmails: selectedEmails,
        }),
      })
      const data = await res.json()
      if (!res.ok) setSent({ success: false, error: data.error || 'Failed to dispatch email' })
      else {
        setSent({ success: true, count: data.recipientCount })
        setSubject('')
        setBody('')
      }
    } catch {
      setSent({ success: false, error: 'Network error communicating with email server' })
    } finally {
      setSending(false)
    }
  }

  const btnDisabled = sending || !subject.trim() || !body.trim()

  return (
    <div className="p-5 sm:p-8 lg:p-12 space-y-10 max-w-[1440px] mx-auto font-sans">
      {/* ── Page Header ── */}
      <div className="pb-8 sm:pb-10 border-b border-gray-100 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-4 sm:mb-5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            Atelier Communications · Dallas, TX
          </div>

          {/* Large display heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-navy tracking-[-0.035em] leading-[1.05]">
            Client Broadcasts & Gazettes
          </h1>

          <p className="mt-4 text-sm sm:text-base text-navy/60 max-w-2xl leading-relaxed font-normal">
            Broadcast VIP releases, seasonal lookbooks, and bespoke updates to registered clientele.
          </p>
        </div>

        {/* Right side stats pill */}
        <div className="flex items-center lg:flex-col lg:items-end gap-3 pt-2 lg:pt-0">
          <div className="backdrop-blur-md bg-[#F6F6F8] border border-gray-200/80 rounded-full px-5 py-2.5 shadow-xs inline-flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-navy tracking-tight">
              Direct Dispatch Gateway Active
            </span>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {sent && (
        <div
          className={`p-5 rounded-[28px] border flex items-center justify-between shadow-xs animate-in fade-in ${
            sent.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {sent.success ? (
              <CheckCircle size={20} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-rose-600 shrink-0" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">
              {sent.success
                ? `Dispatched successfully to ${sent.count} recipient${sent.count !== 1 ? 's' : ''}`
                : sent.error}
            </span>
          </div>
          <button
            onClick={() => setSent(null)}
            className="text-xs font-bold uppercase opacity-60 hover:opacity-100 px-3 py-1 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispatch Type Selector */}
          <div className="bg-[#F6F6F8] rounded-[32px] sm:rounded-[36px] border border-gray-200/80 p-6 sm:p-7 shadow-xs">
            <label className="block text-[11px] font-sans uppercase tracking-[0.14em] text-navy/60 font-semibold mb-4">
              Select Dispatch Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {EMAIL_TYPES.map((type) => {
                const IconComponent = type.icon
                const isSelected = selectedType === type.value
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`p-5 rounded-[24px] text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-gold bg-white shadow-sm ring-2 ring-gold/20'
                        : 'border-gray-200/80 hover:border-navy/30 bg-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-gold/15 text-gold-dark' : 'bg-[#F6F6F8] text-navy/50'}`}>
                        <IconComponent size={16} />
                      </div>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isSelected ? 'text-navy' : 'text-navy/70'
                        }`}
                      >
                        {type.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-navy/55 leading-relaxed font-sans">{type.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subject Line */}
          <div className="bg-[#F6F6F8] rounded-[32px] sm:rounded-[36px] border border-gray-200/80 p-6 sm:p-7 shadow-xs">
            <label className="block text-[11px] font-sans uppercase tracking-[0.14em] text-navy/60 font-semibold mb-2.5">
              Dispatch Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Atelier Seasonal Dispatch — FÉROCE Dallas"
              className="w-full rounded-2xl border border-gray-200/90 bg-white px-5 py-3.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-sans shadow-2xs"
            />
          </div>

          {/* Content & Live Preview */}
          <div className="bg-[#F6F6F8] rounded-[32px] sm:rounded-[36px] border border-gray-200/80 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-sans uppercase tracking-[0.14em] text-navy/60 font-semibold">
                Correspondence Body (HTML Supported)
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-white hover:bg-gray-100 border border-gray-200 text-navy transition-all cursor-pointer shadow-2xs"
              >
                {showPreview ? <Code2 size={14} /> : <Eye size={14} />}
                <span>{showPreview ? 'Switch to Editor' : 'Digital Paper Preview'}</span>
              </button>
            </div>

            {showPreview ? (
              <div className="rounded-[24px] border border-gray-200 p-6 bg-white min-h-[340px] shadow-xs">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-navy/40 mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
                  <span>Dallas Atelier Digital Paper Preview</span>
                  <span className="font-mono text-emerald-600">Formatted Ready</span>
                </div>
                <div className="bg-[#FDFDFD] p-8 rounded-2xl border border-gray-100 max-w-xl mx-auto shadow-xs">
                  <div className="text-xs font-mono text-navy/40 mb-1">
                    Subject: <span className="text-navy font-bold">{subject || '(Untitled)'}</span>
                  </div>
                  <div className="text-xs font-mono text-navy/40 mb-4 pb-3 border-b border-gray-100">
                    From: FEROCE Dallas &lt;hello@ferocefashionff.com&gt;
                  </div>
                  <style dangerouslySetInnerHTML={{ __html: PREVIEW_STYLES }} />
                  <div className="preview-container" dangerouslySetInnerHTML={{ __html: body }} />
                </div>
              </div>
            ) : (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                placeholder="Write your email content in HTML or plain text..."
                className="w-full rounded-[24px] border border-gray-200/90 bg-white p-5 text-xs font-mono text-navy placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-y shadow-2xs"
              />
            )}
          </div>
        </div>

        {/* Right Column: Audience & Dispatch */}
        <div className="space-y-6">
          {/* Audience Filter */}
          <div className="bg-[#F6F6F8] rounded-[32px] sm:rounded-[36px] border border-gray-200/80 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-gold-dark" />
              <label className="text-[11px] font-sans uppercase tracking-[0.14em] text-navy/60 font-semibold">
                Audience Selection
              </label>
            </div>

            <div className="space-y-2.5 mb-4">
              {(['all', 'has_orders', 'specific'] as const).map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    recipientFilter === opt
                      ? 'border-gold bg-white shadow-xs ring-2 ring-gold/20'
                      : 'border-gray-200/80 hover:border-navy/30 bg-white/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="recipientFilter"
                      checked={recipientFilter === opt}
                      onChange={() => setRecipientFilter(opt)}
                      className="accent-[#D4AF37] cursor-pointer"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-navy">
                      {opt === 'all'
                        ? 'All Circle Members'
                        : opt === 'has_orders'
                        ? 'Collectors with Orders'
                        : 'Specific Accounts'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-navy/50 font-mono">
                    {opt === 'specific' ? selectedEmails.length : customers.length}
                  </span>
                </label>
              ))}
            </div>

            {recipientFilter === 'specific' && (
              <div className="rounded-2xl border border-gray-200 p-4 bg-white animate-in fade-in space-y-3">
                <div className="relative">
                  <Search size={14} className="text-navy/40 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by client email..."
                    className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-gold font-sans"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] border-b border-gray-100 pb-2">
                  <span className="text-navy/50">{fc.length} clients found</span>
                  <button
                    type="button"
                    onClick={selAll}
                    className="text-gold-dark hover:underline font-bold cursor-pointer uppercase tracking-wider"
                  >
                    Select All
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {fc.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F6F6F8] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(c.email)}
                        onChange={() => toggle(c.email)}
                        className="accent-[#D4AF37] rounded"
                      />
                      <span className="text-xs text-navy font-mono truncate">{c.email}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Send Summary & Trigger */}
          <div className="bg-[#F6F6F8] rounded-[32px] sm:rounded-[36px] border border-gray-200/80 p-6 sm:p-7 shadow-xs">
            <div className="text-[11px] font-sans uppercase tracking-[0.14em] text-navy/60 font-semibold mb-4">
              Dispatch Summary
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                <span className="text-navy/50 uppercase tracking-wider">Format</span>
                <span className="text-navy font-bold">{currentTypeObj?.label}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                <span className="text-navy/50 uppercase tracking-wider">Audience Count</span>
                <span className="text-navy font-bold text-sm font-mono">{est} clients</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                <span className="text-navy/50 uppercase tracking-wider">Subject</span>
                <span className="text-navy font-semibold truncate max-w-[150px]">
                  {subject || '—'}
                </span>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={btnDisabled}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold uppercase tracking-wider py-3.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {sending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send size={14} className="text-gold" />
                  <span>Transmit Dispatch</span>
                </>
              )}
            </button>
          </div>

          {/* Editorial Guidelines Card */}
          <div className="bg-white rounded-[32px] border border-gray-200/80 p-6 shadow-xs">
            <div className="text-[11px] font-sans uppercase tracking-[0.14em] text-navy/60 font-semibold mb-3">
              Editorial Guidelines
            </div>
            <ul className="space-y-2.5 text-xs text-navy/60 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">•</span>
                <span>Use standard inline HTML tags like &lt;h2&gt;, &lt;p&gt;, and &lt;a&gt;.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">•</span>
                <span>Apply class="btn" or class="btn btn-gold" for capsule CTA buttons.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold">•</span>
                <span>The official FÉROCE Dallas letterhead and unsubscribe links are appended automatically.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
