"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Send, Eye, Mail, Megaphone, Tag, CheckCircle, AlertCircle, ChevronDown } from "lucide-react"

interface Customer { id: string; email: string; role: string; created_at: string }
type RecipientFilter = "all" | "has_orders" | "specific"

const EMAIL_TYPES = [
  { value: "custom", label: "Custom Email", desc: "Write your own subject and content", icon: "Mail" },
  { value: "newsletter", label: "Newsletter", desc: "Standard newsletter with FEROCE branding", icon: "Megaphone" },
  { value: "welcome", label: "Welcome (Test)", desc: "Send a welcome email to a specific customer", icon: "Tag" },
]
const TEMPLATES: Record<string, { subject: string; body: string }> = {
  custom: { subject: "", body: "<p>Write your email content here...</p>" },
  newsletter: {
    subject: "Stay in the Loop — FEROCE Updates",
    body: '<h2>Your exclusive FEROCE update.</h2><p>Here is what is new.</p><div class="divider"></div><p>Add your content here.</p><div style="text-align:center;margin:32px 0;"><a href="https://feroce-fashion.vercel.app/shop" class="btn btn-gold">SHOP NEW ARRIVALS</a></div>',
  },
  welcome: { subject: "Welcome to FEROCE — The Attitude is Fierce", body: "" },
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = { Mail, Megaphone, Tag }

function TypeIcon({ name, ...props }: { name: string; size?: number; className?: string }) {
  const C = ICON_MAP[name] || Mail
  return <C {...props} />
}

const PREVIEW_STYLES = [
  ".preview-container { font-family: sans-serif; color: #0A1128; }",
  ".preview-container h2 { font-family: serif; font-size: 24px; margin: 0 0 16px; color: #0A1128; }",
  ".preview-container p { font-size: 14px; line-height: 1.7; color: #6b6b6b; margin: 0 0 16px; }",
  ".preview-container .divider { height: 1px; background: #E2DFD8; margin: 32px 0; }",
  ".preview-container .btn { display: inline-block; background: #0A1128; color: #fff; text-decoration: none; padding: 16px 36px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; }",
  ".preview-container .btn-gold { background: #D4AF37; color: #0A1128; }",
].join("\n")
export default function AdminEmailsPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedType, setSelectedType] = useState("custom")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState(TEMPLATES.custom.body)
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>("all")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<{ success: boolean; count?: number; error?: string } | null>(null)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)

  useEffect(() => {
    const s = createClient()
    s.from("profiles").select("id, email, role, created_at").eq("role", "customer").order("created_at", { ascending: false }).then(({ data }) => { if (data) setCustomers(data) })
  }, [])

  const handleTypeChange = useCallback((type: string) => {
    setSelectedType(type); const t = TEMPLATES[type]; if (t) { setSubject(t.subject); setBody(t.body) }; setShowTypeDropdown(false)
  }, [])

  const fc = customers.filter(c => c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  const toggle = (email: string) => setSelectedEmails(p => p.includes(email) ? p.filter(e => e !== email) : [...p, email])
  const selAll = () => setSelectedEmails(p => [...new Set([...p, ...fc.map(c => c.email)])])
  const est = recipientFilter === "all" || recipientFilter === "has_orders" ? customers.length : selectedEmails.length
  const lbl = EMAIL_TYPES.find(t => t.value === selectedType)

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return
    setSending(true); setSent(null)
    try {
      const res = await fetch("/api/admin/emails", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, subject: subject.trim(), htmlContent: body, recipientFilter, recipientEmails: selectedEmails }) })
      const data = await res.json()
      if (!res.ok) setSent({ success: false, error: data.error || "Failed" })
      else { setSent({ success: true, count: data.recipientCount }); setSubject(""); setBody("") }
    } catch { setSent({ success: false, error: "Network error" }) } finally { setSending(false) }
  }

  const alertClass = sent?.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
  const btnDisabled = sending || !subject.trim() || !body.trim()

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-navy">Emails</h1>
        <p className="text-sm text-navy/50 mt-1">Create and send emails to your customers</p>
      </div>
      {sent && (
        <div className={"mb-6 p-4 border flex items-center gap-3 " + alertClass}>
          {sent.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm">{sent.success ? "Sent to " + sent.count + " recipient" + (sent.count !== 1 ? "s" : "") : sent.error}</span>
          <button onClick={() => setSent(null)} className="ml-auto opacity-50 hover:opacity-100">x</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white border border-line p-6">
            <label className="block text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium mb-3">Email Type</label>
            <div className="relative">
              <button onClick={() => setShowTypeDropdown(!showTypeDropdown)} className="w-full flex items-center justify-between px-4 py-3 border border-line text-sm text-navy bg-white hover:border-navy/30">
                <div className="flex items-center gap-3">
                  <TypeIcon name={lbl?.icon || "Mail"} size={16} className="text-navy/40" />
                  <div className="text-left"><div className="font-medium">{lbl?.label}</div><div className="text-xs text-navy/40">{lbl?.desc}</div></div>
                </div>
                <ChevronDown size={16} className={"text-navy/40 transition-transform " + (showTypeDropdown ? "rotate-180" : "")} />
              </button>
              {showTypeDropdown && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-line shadow-lg">
                  {EMAIL_TYPES.map(type => (
                    <button key={type.value} onClick={() => handleTypeChange(type.value)} className={"w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-cream/50 " + (selectedType === type.value ? "bg-cream font-medium" : "")}>
                      <TypeIcon name={type.icon} size={16} className="text-navy/40" />
                      <div><div>{type.label}</div><div className="text-xs text-navy/40">{type.desc}</div></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-line p-6">
            <label className="block text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium mb-3">Subject Line</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter email subject..." className="w-full px-4 py-3 border border-line text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
          </div>

          <div className="bg-white border border-line p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Email Content</label>
              <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 text-xs text-navy/50 hover:text-navy"><Eye size={14} />{showPreview ? "Edit" : "Preview"}</button>
            </div>
            {showPreview ? (
              <div className="border border-line p-6 min-h-[300px] bg-cream/30">
                <div className="text-[10px] uppercase tracking-wider text-navy/30 mb-4">Email Preview</div>
                <div className="bg-white p-6 border border-line/50">
                  <div className="text-xs text-navy/40 mb-2">Subject: {subject || "(no subject)"}</div>
                  <div className="text-xs text-navy/40 mb-4">From: FEROCE &lt;hello@ferocefashionff.com&gt;</div>
                  <hr className="border-line mb-4" />
                  <style dangerouslySetInnerHTML={{ __html: PREVIEW_STYLES }} />
                  <div className="preview-container" dangerouslySetInnerHTML={{ __html: body }} />
                </div>
              </div>
            ) : (
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={12} placeholder="Write your email content (HTML supported)..." className="w-full px-4 py-3 border border-line text-sm text-navy font-mono placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-y" />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-line p-6">
            <label className="block text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium mb-3">Recipients</label>
            <div className="space-y-2 mb-4">
              {(["all", "has_orders", "specific"] as const).map(opt => (
                <label key={opt} className={"flex items-center gap-3 px-4 py-3 border cursor-pointer " + (recipientFilter === opt ? "border-navy bg-cream/50" : "border-line hover:border-navy/30")}>
                  <input type="radio" name="recipientFilter" checked={recipientFilter === opt} onChange={() => setRecipientFilter(opt)} className="accent-[#D4AF37]" />
                  <span className="flex-1 text-sm text-navy font-medium">{opt === "all" ? "All customers" : opt === "has_orders" ? "Customers with orders" : "Specific customers"}</span>
                  <span className="text-xs text-navy/40">{opt === "specific" ? selectedEmails.length : customers.length}</span>
                </label>
              ))}
            </div>
            {recipientFilter === "specific" && (
              <div className="border border-line p-4">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search customers..." className="w-full px-3 py-2 border border-line text-sm mb-3 focus:outline-none focus:border-gold" />
                <div className="flex items-center justify-between mb-2"><span className="text-xs text-navy/40">{fc.length} customers</span><button onClick={selAll} className="text-xs text-navy hover:text-gold">Select all</button></div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {fc.map(c => (
                    <label key={c.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-cream/50 cursor-pointer">
                      <input type="checkbox" checked={selectedEmails.includes(c.email)} onChange={() => toggle(c.email)} className="accent-[#D4AF37]" />
                      <span className="text-xs text-navy truncate">{c.email}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-line p-6">
            <div className="text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium mb-4">Send Summary</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-navy/50">Type</span><span className="text-navy font-medium">{lbl?.label}</span></div>
              <div className="flex justify-between"><span className="text-navy/50">Recipients</span><span className="text-navy font-medium">{est}</span></div>
              <div className="flex justify-between"><span className="text-navy/50">Subject</span><span className="text-navy font-medium text-right truncate ml-4 max-w-[180px]">{subject || "--"}</span></div>
            </div>
            <hr className="border-line my-4" />
            <button onClick={handleSend} disabled={btnDisabled} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-navy text-white text-[11px] font-sans uppercase tracking-[0.2em] font-medium hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed">
              {sending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</> : <><Send size={14} />Send Email</>}
            </button>
          </div>

          <div className="bg-cream border border-line p-6">
            <div className="text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium mb-3">Quick Tips</div>
            <ul className="space-y-2 text-xs text-navy/50">
              <li className="flex items-start gap-2"><span className="text-gold">&#8226;</span>HTML content supported</li>
              <li className="flex items-start gap-2"><span className="text-gold">&#8226;</span>Use class="btn" for CTA buttons</li>
              <li className="flex items-start gap-2"><span className="text-gold">&#8226;</span>FEROCE header/footer added automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
