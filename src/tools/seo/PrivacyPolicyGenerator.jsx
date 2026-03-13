import { useState, useMemo } from 'react'

const COUNTRIES = ['India', 'USA', 'UK', 'EU/GDPR', 'Australia', 'Canada', 'Other']

const DATA_OPTIONS = [
  { id: 'analytics', label: 'Google Analytics / tracking cookies' },
  { id: 'accounts', label: 'User registration / accounts' },
  { id: 'newsletter', label: 'Email newsletter / marketing' },
  { id: 'payments', label: 'Payment processing' },
  { id: 'socialLogin', label: 'Third-party social logins (Google, Facebook, etc.)' },
  { id: 'logFiles', label: 'Log files / server logs' },
  { id: 'advertising', label: 'Advertising (Google AdSense, etc.)' },
]

function generatePolicy({ name, url, company, email, country, effectiveDate, dataOptions }) {
  const siteName = name || 'Our Website'
  const siteUrl = url || 'https://example.com'
  const companyName = company || 'the website owner'
  const contactEmail = email || 'contact@example.com'
  const date = effectiveDate || new Date().toISOString().split('T')[0]
  const isGDPR = country === 'EU/GDPR' || country === 'UK'
  const isUS = country === 'USA'
  const isIndia = country === 'India'

  const sections = []

  // Introduction
  sections.push(`PRIVACY POLICY

Effective Date: ${date}

Welcome to ${siteName} ("we", "us", or "our"), operated by ${companyName}. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit ${siteUrl}. Please read this policy carefully. If you disagree with its terms, please discontinue use of the site.

We reserve the right to make changes to this Privacy Policy at any time. Any changes will be reflected by the "Effective Date" updated above. We encourage you to periodically review this page to stay informed about how we are protecting the information we collect.`)

  // Information We Collect
  let collectSection = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. INFORMATION WE COLLECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We may collect information about you in a variety of ways. The information we may collect on the Site includes:\n`

  collectSection += `\n▸ Device & Usage Information\nWhen you visit our website, our servers may automatically log standard data provided by your browser, including your IP address, browser type and version, pages you visit, time and date of your visit, time spent on each page, and other technical details.`

  if (dataOptions.accounts) {
    collectSection += `\n\n▸ Personal Information (Account Data)\nIf you register for an account, we collect your name, email address, username, and password. You may also choose to provide additional profile information.`
  }

  if (dataOptions.newsletter) {
    collectSection += `\n\n▸ Email / Newsletter Subscriptions\nIf you subscribe to our newsletter or mailing list, we collect your email address and, optionally, your name. You can unsubscribe at any time by clicking the unsubscribe link in any email we send.`
  }

  if (dataOptions.payments) {
    collectSection += `\n\n▸ Payment Information\nIf you make a purchase, payment information (such as credit card number or billing address) is processed by a third-party payment processor. We do not store full payment card details on our servers.`
  }

  if (dataOptions.socialLogin) {
    collectSection += `\n\n▸ Social Login Data\nIf you choose to register or log in using a third-party service (such as Google or Facebook), we may receive certain profile information from that service, such as your name, email, and profile photo, as permitted by your privacy settings on that service.`
  }

  if (dataOptions.logFiles) {
    collectSection += `\n\n▸ Log Files\nLike many websites, we use log files. These files log visitors when they visit websites. The information includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.`
  }

  sections.push(collectSection)

  // How We Use Information
  let useSection = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. HOW WE USE YOUR INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We use the information we collect for the following purposes:\n
• To operate, maintain, and improve ${siteName}
• To respond to comments, questions, and requests
• To send administrative information, such as updates, security alerts, and support messages
• To monitor and analyse usage and trends to improve user experience
• To detect, prevent, and address technical issues and fraudulent activity`

  if (dataOptions.newsletter) {
    useSection += `\n• To send marketing and promotional communications (you can opt out at any time)`
  }

  if (dataOptions.payments) {
    useSection += `\n• To process transactions and send related information, including purchase confirmations and invoices`
  }

  if (dataOptions.analytics) {
    useSection += `\n• To understand how visitors interact with our site using analytics data`
  }

  if (dataOptions.advertising) {
    useSection += `\n• To serve personalised advertisements based on your interests`
  }

  sections.push(useSection)

  // Cookies
  let cookieSection = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. COOKIES AND TRACKING TECHNOLOGIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We use cookies and similar tracking technologies to track activity on our website and hold certain information.`

  if (dataOptions.analytics) {
    cookieSection += `\n\n▸ Analytics Cookies\nWe use Google Analytics to help us understand how visitors interact with our website. Google Analytics uses cookies to collect information such as how often users visit the site, what pages they visit, and what other sites they used prior to coming to our site. We use the information to compile reports and improve the site. Google's ability to use and share information collected by Google Analytics is restricted by the Google Analytics Terms of Service and Google Privacy Policy. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.`
  }

  if (dataOptions.advertising) {
    cookieSection += `\n\n▸ Advertising Cookies\nWe use third-party advertising services such as Google AdSense. These services use cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalised advertising by visiting Google's Ads Settings.`
  }

  cookieSection += `\n\nYou can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.`

  sections.push(cookieSection)

  // Third-party services
  let thirdPartySection = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. THIRD-PARTY SERVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We may use third-party services that have access to some of your information. These third parties have their own independent privacy policies. We have no responsibility or liability for the content and activities of these third parties. Below is a list of third parties we may use:`

  const thirdParties = []
  if (dataOptions.analytics) thirdParties.push('• Google Analytics (analytics.google.com) — for website analytics')
  if (dataOptions.advertising) thirdParties.push('• Google AdSense (adsense.google.com) — for advertising')
  if (dataOptions.payments) thirdParties.push('• Payment processors (e.g., Stripe, PayPal, Razorpay) — for transaction processing')
  if (dataOptions.socialLogin) thirdParties.push('• Social login providers (e.g., Google, Facebook) — for authentication')
  if (thirdParties.length === 0) thirdParties.push('• Hosting and infrastructure providers to keep our site online and secure')

  thirdPartySection += '\n\n' + thirdParties.join('\n')

  sections.push(thirdPartySection)

  // Data Security
  sections.push(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. DATA SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We implement appropriate technical and organisational security measures to protect your personal information from unauthorised access, use, or disclosure. However, please be aware that no method of transmission over the internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.`)

  // Your Rights
  let rightsSection = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. YOUR RIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Depending on your location, you may have the following rights regarding your personal data:\n
• The right to access — You have the right to request copies of your personal data.
• The right to rectification — You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.
• The right to erasure — You have the right to request that we erase your personal data, under certain conditions.
• The right to restrict processing — You have the right to request that we restrict the processing of your personal data, under certain conditions.
• The right to data portability — You have the right to request that we transfer the data we have collected to another organisation, or directly to you, under certain conditions.`

  if (isGDPR) {
    rightsSection += `\n\n▸ GDPR / UK GDPR Rights (EU & UK Residents)\nIf you are located in the European Economic Area (EEA) or the United Kingdom, you also have the right to:\n• Object to processing of your personal data\n• Withdraw consent at any time where we rely on consent as the legal basis for processing\n• Lodge a complaint with your local data protection authority\n\nOur lawful bases for processing include: contractual necessity, legitimate interests, compliance with legal obligations, and consent (where applicable).\n\nWe will respond to all requests within 30 days as required under GDPR.`
  }

  if (isUS) {
    rightsSection += `\n\n▸ California Residents (CCPA)\nIf you are a California resident, you have the right to: know what personal information is collected, used, shared, or sold; delete personal information we have collected; opt out of the sale of personal information; and not be discriminated against for exercising your privacy rights. To exercise these rights, contact us at ${contactEmail}.`
  }

  if (isIndia) {
    rightsSection += `\n\n▸ India — DPDP Act 2023\nWe comply with the Digital Personal Data Protection Act, 2023. You have the right to access, correct, and erase your personal data. You may also nominate another person to exercise rights on your behalf. To exercise your rights, contact us at ${contactEmail}.`
  }

  rightsSection += `\n\nTo exercise any of these rights, please contact us at ${contactEmail}. We may need to verify your identity before processing your request.`

  sections.push(rightsSection)

  // Children's Privacy
  sections.push(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. CHILDREN'S PRIVACY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${siteName} is not directed to children under the age of 13 (or 16 in the EU/UK). We do not knowingly collect personally identifiable information from anyone under these ages. If you are a parent or guardian and believe your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from a child without parental consent, we will take steps to remove that information.`)

  // Changes to Policy
  sections.push(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. CHANGES TO THIS PRIVACY POLICY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. You are advised to review this Privacy Policy periodically for any changes. Continued use of the service after changes are posted constitutes your acceptance of the updated policy.`)

  // Contact
  sections.push(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. CONTACT US
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:\n
${companyName}
Website: ${siteUrl}
Email: ${contactEmail}

We will do our best to respond to your inquiry within 5–10 business days.`)

  return sections.join('')
}

export default function PrivacyPolicyGenerator() {
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    name: '',
    url: '',
    company: '',
    email: '',
    country: 'India',
    effectiveDate: today,
  })

  const [dataOptions, setDataOptions] = useState({
    analytics: false,
    accounts: false,
    newsletter: false,
    payments: false,
    socialLogin: false,
    logFiles: false,
    advertising: false,
  })

  const [copied, setCopied] = useState(false)

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))
  const toggleOption = (id) => setDataOptions(prev => ({ ...prev, [id]: !prev[id] }))

  const policy = useMemo(() => generatePolicy({ ...form, dataOptions }), [form, dataOptions])

  const wordCount = useMemo(() => policy.trim().split(/\s+/).filter(Boolean).length, [policy])

  const handleCopy = () => {
    navigator.clipboard.writeText(policy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([policy], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'privacy-policy.txt'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Disclaimer */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300">
        <span className="font-semibold">Disclaimer: </span>
        This is a template for informational purposes only. Consult a legal professional for advice specific to your situation. This tool does not constitute legal advice.
      </div>

      {/* Form */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">Your Details</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Website / App Name</label>
            <input
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
              placeholder="My Awesome App"
              value={form.name}
              onChange={f('name')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Website URL</label>
            <input
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
              placeholder="https://example.com"
              value={form.url}
              onChange={f('url')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Company / Owner Name</label>
            <input
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
              placeholder="Acme Corp"
              value={form.company}
              onChange={f('company')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Contact Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
              placeholder="privacy@example.com"
              value={form.email}
              onChange={f('email')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Country / Jurisdiction</label>
            <select
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors"
              value={form.country}
              onChange={f('country')}
            >
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Effective Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors"
              value={form.effectiveDate}
              onChange={f('effectiveDate')}
            />
          </div>
        </div>
      </div>

      {/* Data collection options */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">What data does your site collect?</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DATA_OPTIONS.map(({ id, label }) => (
            <label key={id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#2a2a2a] px-3 py-2.5 hover:border-[#3a3a3a] transition-colors">
              <input
                type="checkbox"
                checked={dataOptions[id]}
                onChange={() => toggleOption(id)}
                className="h-4 w-4 accent-cyan-500 cursor-pointer"
              />
              <span className="text-sm text-zinc-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Generated Privacy Policy</p>
            <span className="rounded-full bg-[#2a2a2a] px-2 py-0.5 text-xs text-zinc-500">{wordCount} words</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                copied
                  ? 'border-green-500/40 bg-green-500/10 text-green-400'
                  : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-[#3a3a3a] hover:text-zinc-200 transition-colors"
            >
              Download .txt
            </button>
          </div>
        </div>
        <textarea
          readOnly
          className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] p-4 font-mono text-xs leading-relaxed text-zinc-300 outline-none"
          rows={28}
          value={policy}
        />
      </div>
    </div>
  )
}
