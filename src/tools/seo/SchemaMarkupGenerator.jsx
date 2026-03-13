import { useState, useMemo } from 'react'

const SCHEMA_TYPES = ['Article', 'FAQ', 'HowTo', 'LocalBusiness', 'Product', 'Person', 'BreadcrumbList']

const BUSINESS_TYPES = ['LocalBusiness', 'Restaurant', 'Store', 'Hospital', 'Hotel', 'Gym', 'School', 'Library', 'Pharmacy', 'Bakery', 'CafeOrCoffeeShop', 'BarOrPub']

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY', 'SGD', 'AED']

const AVAILABILITY = ['InStock', 'OutOfStock', 'PreOrder', 'Discontinued']

// ── Field helpers ──────────────────────────────────────────────

function Input({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-zinc-400">{label}</label>
      <input
        type={type}
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-zinc-400">{label}</label>
      <select
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

// ── Schema forms ──────────────────────────────────────────────

function ArticleForm({ data, setData }) {
  const f = (key) => (val) => setData(d => ({ ...d, [key]: val }))
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="Headline" value={data.headline} onChange={f('headline')} placeholder="My Article Title" />
      <Input label="Author Name" value={data.author} onChange={f('author')} placeholder="Jane Doe" />
      <Input label="Date Published" value={data.datePublished} onChange={f('datePublished')} type="date" />
      <Input label="Date Modified" value={data.dateModified} onChange={f('dateModified')} type="date" />
      <Input label="Publisher Name" value={data.publisher} onChange={f('publisher')} placeholder="My Blog" />
      <Input label="Image URL" value={data.image} onChange={f('image')} placeholder="https://example.com/image.jpg" />
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <label className="text-xs text-zinc-400">Description</label>
        <textarea
          className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
          rows={3}
          placeholder="Brief description of the article"
          value={data.description}
          onChange={e => setData(d => ({ ...d, description: e.target.value }))}
        />
      </div>
    </div>
  )
}

function FaqForm({ data, setData }) {
  const addPair = () => setData(d => ({ ...d, pairs: [...d.pairs, { q: '', a: '' }] }))
  const removePair = (i) => setData(d => ({ ...d, pairs: d.pairs.filter((_, idx) => idx !== i) }))
  const updatePair = (i, key, val) => setData(d => ({
    ...d,
    pairs: d.pairs.map((p, idx) => idx === i ? { ...p, [key]: val } : p)
  }))
  return (
    <div className="flex flex-col gap-4">
      {data.pairs.map((pair, i) => (
        <div key={i} className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Q&A #{i + 1}</span>
            {data.pairs.length > 1 && (
              <button onClick={() => removePair(i)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
            )}
          </div>
          <input
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
            placeholder="Question"
            value={pair.q}
            onChange={e => updatePair(i, 'q', e.target.value)}
          />
          <textarea
            className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
            rows={3}
            placeholder="Answer"
            value={pair.a}
            onChange={e => updatePair(i, 'a', e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={addPair}
        className="self-start rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/20 transition-colors"
      >
        + Add Q&A Pair
      </button>
    </div>
  )
}

function HowToForm({ data, setData }) {
  const f = (key) => (val) => setData(d => ({ ...d, [key]: val }))
  const addStep = () => setData(d => ({ ...d, steps: [...d.steps, { name: '', text: '' }] }))
  const removeStep = (i) => setData(d => ({ ...d, steps: d.steps.filter((_, idx) => idx !== i) }))
  const updateStep = (i, key, val) => setData(d => ({
    ...d,
    steps: d.steps.map((s, idx) => idx === i ? { ...s, [key]: val } : s)
  }))
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="How-To Name" value={data.name} onChange={f('name')} placeholder="How to bake a chocolate cake" />
        <Input label="Total Time (minutes)" value={data.totalTime} onChange={f('totalTime')} placeholder="60" type="number" />
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs text-zinc-400">Description</label>
          <textarea
            className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
            rows={2}
            placeholder="Brief description"
            value={data.description}
            onChange={e => setData(d => ({ ...d, description: e.target.value }))}
          />
        </div>
      </div>
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Steps</p>
      {data.steps.map((step, i) => (
        <div key={i} className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Step {i + 1}</span>
            {data.steps.length > 1 && (
              <button onClick={() => removeStep(i)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
            )}
          </div>
          <input
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
            placeholder="Step name"
            value={step.name}
            onChange={e => updateStep(i, 'name', e.target.value)}
          />
          <textarea
            className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
            rows={2}
            placeholder="Step instructions"
            value={step.text}
            onChange={e => updateStep(i, 'text', e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={addStep}
        className="self-start rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/20 transition-colors"
      >
        + Add Step
      </button>
    </div>
  )
}

function LocalBusinessForm({ data, setData }) {
  const f = (key) => (val) => setData(d => ({ ...d, [key]: val }))
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="Business Name" value={data.name} onChange={f('name')} placeholder="My Restaurant" />
      <Select label="Business Type" value={data.type} onChange={f('type')} options={BUSINESS_TYPES} />
      <Input label="Street Address" value={data.address} onChange={f('address')} placeholder="123 Main St, City, State" />
      <Input label="Phone" value={data.phone} onChange={f('phone')} placeholder="+1-555-000-0000" />
      <Input label="Website" value={data.website} onChange={f('website')} placeholder="https://example.com" />
      <Input label="Opening Hours" value={data.openingHours} onChange={f('openingHours')} placeholder="Mo-Fr 09:00-17:00" />
    </div>
  )
}

function ProductForm({ data, setData }) {
  const f = (key) => (val) => setData(d => ({ ...d, [key]: val }))
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="Product Name" value={data.name} onChange={f('name')} placeholder="Awesome Widget" />
      <Input label="Brand" value={data.brand} onChange={f('brand')} placeholder="BrandName" />
      <Input label="SKU" value={data.sku} onChange={f('sku')} placeholder="SKU-12345" />
      <Input label="Price" value={data.price} onChange={f('price')} placeholder="29.99" type="number" />
      <Select label="Currency" value={data.currency} onChange={f('currency')} options={CURRENCIES} />
      <Select label="Availability" value={data.availability} onChange={f('availability')} options={AVAILABILITY} />
      <Input label="Rating (0–5)" value={data.rating} onChange={f('rating')} placeholder="4.5" type="number" />
      <Input label="Review Count" value={data.reviewCount} onChange={f('reviewCount')} placeholder="142" type="number" />
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <label className="text-xs text-zinc-400">Description</label>
        <textarea
          className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
          rows={2}
          placeholder="Product description"
          value={data.description}
          onChange={e => setData(d => ({ ...d, description: e.target.value }))}
        />
      </div>
    </div>
  )
}

function PersonForm({ data, setData }) {
  const f = (key) => (val) => setData(d => ({ ...d, [key]: val }))
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="Full Name" value={data.name} onChange={f('name')} placeholder="John Smith" />
      <Input label="Job Title" value={data.jobTitle} onChange={f('jobTitle')} placeholder="Software Engineer" />
      <Input label="Email" value={data.email} onChange={f('email')} placeholder="john@example.com" type="email" />
      <Input label="Website" value={data.website} onChange={f('website')} placeholder="https://johnsmith.com" />
      <Input label="LinkedIn URL" value={data.linkedin} onChange={f('linkedin')} placeholder="https://linkedin.com/in/johnsmith" />
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <label className="text-xs text-zinc-400">Description</label>
        <textarea
          className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
          rows={2}
          placeholder="Short bio"
          value={data.description}
          onChange={e => setData(d => ({ ...d, description: e.target.value }))}
        />
      </div>
    </div>
  )
}

function BreadcrumbForm({ data, setData }) {
  const addItem = () => setData(d => ({ ...d, items: [...d.items, { name: '', url: '' }] }))
  const removeItem = (i) => setData(d => ({ ...d, items: d.items.filter((_, idx) => idx !== i) }))
  const updateItem = (i, key, val) => setData(d => ({
    ...d,
    items: d.items.map((item, idx) => idx === i ? { ...item, [key]: val } : item)
  }))
  return (
    <div className="flex flex-col gap-4">
      {data.items.map((item, i) => (
        <div key={i} className="grid grid-cols-1 gap-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 sm:grid-cols-2">
          <div className="flex items-center gap-2 sm:col-span-2 justify-between">
            <span className="text-xs text-zinc-500">Breadcrumb #{i + 1}</span>
            {data.items.length > 1 && (
              <button onClick={() => removeItem(i)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
            )}
          </div>
          <input
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
            placeholder="Name (e.g. Home)"
            value={item.name}
            onChange={e => updateItem(i, 'name', e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
            placeholder="URL (e.g. https://example.com)"
            value={item.url}
            onChange={e => updateItem(i, 'url', e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={addItem}
        className="self-start rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/20 transition-colors"
      >
        + Add Breadcrumb
      </button>
    </div>
  )
}

// ── Schema generators ──────────────────────────────────────────

function generateSchema(type, data) {
  const base = { '@context': 'https://schema.org' }

  switch (type) {
    case 'Article': {
      const obj = { ...base, '@type': 'Article' }
      if (data.headline) obj.headline = data.headline
      if (data.author) obj.author = { '@type': 'Person', name: data.author }
      if (data.datePublished) obj.datePublished = data.datePublished
      if (data.dateModified) obj.dateModified = data.dateModified
      if (data.description) obj.description = data.description
      if (data.image) obj.image = data.image
      if (data.publisher) obj.publisher = { '@type': 'Organization', name: data.publisher }
      return obj
    }
    case 'FAQ': {
      return {
        ...base,
        '@type': 'FAQPage',
        mainEntity: data.pairs.filter(p => p.q || p.a).map(p => ({
          '@type': 'Question',
          name: p.q,
          acceptedAnswer: { '@type': 'Answer', text: p.a },
        })),
      }
    }
    case 'HowTo': {
      const obj = { ...base, '@type': 'HowTo' }
      if (data.name) obj.name = data.name
      if (data.description) obj.description = data.description
      if (data.totalTime) obj.totalTime = `PT${data.totalTime}M`
      obj.step = data.steps.filter(s => s.name || s.text).map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: s.text,
      }))
      return obj
    }
    case 'LocalBusiness': {
      const obj = { ...base, '@type': data.type || 'LocalBusiness' }
      if (data.name) obj.name = data.name
      if (data.address) obj.address = { '@type': 'PostalAddress', streetAddress: data.address }
      if (data.phone) obj.telephone = data.phone
      if (data.website) obj.url = data.website
      if (data.openingHours) obj.openingHours = data.openingHours
      return obj
    }
    case 'Product': {
      const obj = { ...base, '@type': 'Product' }
      if (data.name) obj.name = data.name
      if (data.description) obj.description = data.description
      if (data.brand) obj.brand = { '@type': 'Brand', name: data.brand }
      if (data.sku) obj.sku = data.sku
      if (data.price || data.currency) {
        obj.offers = {
          '@type': 'Offer',
          ...(data.price && { price: data.price }),
          ...(data.currency && { priceCurrency: data.currency }),
          ...(data.availability && { availability: `https://schema.org/${data.availability}` }),
        }
      }
      if (data.rating || data.reviewCount) {
        obj.aggregateRating = {
          '@type': 'AggregateRating',
          ...(data.rating && { ratingValue: data.rating }),
          ...(data.reviewCount && { reviewCount: data.reviewCount }),
        }
      }
      return obj
    }
    case 'Person': {
      const obj = { ...base, '@type': 'Person' }
      if (data.name) obj.name = data.name
      if (data.jobTitle) obj.jobTitle = data.jobTitle
      if (data.description) obj.description = data.description
      if (data.email) obj.email = data.email
      if (data.website) obj.url = data.website
      if (data.linkedin) obj.sameAs = data.linkedin
      return obj
    }
    case 'BreadcrumbList': {
      return {
        ...base,
        '@type': 'BreadcrumbList',
        itemListElement: data.items.filter(i => i.name || i.url).map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }
    }
    default:
      return base
  }
}

// ── Simple syntax highlighter ──────────────────────────────────

function SyntaxHighlight({ json }) {
  const html = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'text-cyan-300' // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-purple-300' // key
        } else {
          cls = 'text-emerald-300' // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-yellow-300'
      } else if (/null/.test(match)) {
        cls = 'text-zinc-500'
      }
      return `<span class="${cls}">${match}</span>`
    })
  return <pre className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
}

// ── Default data ──────────────────────────────────────────────

const defaultData = {
  Article: { headline: '', author: '', datePublished: '', dateModified: '', description: '', image: '', publisher: '' },
  FAQ: { pairs: [{ q: '', a: '' }] },
  HowTo: { name: '', description: '', totalTime: '', steps: [{ name: '', text: '' }] },
  LocalBusiness: { name: '', type: 'LocalBusiness', address: '', phone: '', website: '', openingHours: '' },
  Product: { name: '', description: '', brand: '', sku: '', price: '', currency: 'USD', availability: 'InStock', rating: '', reviewCount: '' },
  Person: { name: '', jobTitle: '', description: '', email: '', website: '', linkedin: '' },
  BreadcrumbList: { items: [{ name: '', url: '' }] },
}

// ── Main component ────────────────────────────────────────────

export default function SchemaMarkupGenerator() {
  const [activeType, setActiveType] = useState('Article')
  const [formData, setFormData] = useState(defaultData)
  const [copied, setCopied] = useState(false)

  const setCurrentData = (updater) => {
    setFormData(prev => ({ ...prev, [activeType]: typeof updater === 'function' ? updater(prev[activeType]) : updater }))
  }

  const schema = useMemo(() => generateSchema(activeType, formData[activeType]), [activeType, formData])
  const jsonString = JSON.stringify(schema, null, 2)
  const scriptTag = `<script type="application/ld+json">\n${jsonString}\n</script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptTag)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Type selector */}
      <div className="flex flex-wrap gap-2">
        {SCHEMA_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              activeType === type
                ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                : 'border-[#2a2a2a] bg-[#1a1a1a] text-zinc-400 hover:border-[#3a3a3a] hover:text-zinc-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">{activeType} Details</p>
          {activeType === 'Article' && <ArticleForm data={formData.Article} setData={setCurrentData} />}
          {activeType === 'FAQ' && <FaqForm data={formData.FAQ} setData={setCurrentData} />}
          {activeType === 'HowTo' && <HowToForm data={formData.HowTo} setData={setCurrentData} />}
          {activeType === 'LocalBusiness' && <LocalBusinessForm data={formData.LocalBusiness} setData={setCurrentData} />}
          {activeType === 'Product' && <ProductForm data={formData.Product} setData={setCurrentData} />}
          {activeType === 'Person' && <PersonForm data={formData.Person} setData={setCurrentData} />}
          {activeType === 'BreadcrumbList' && <BreadcrumbForm data={formData.BreadcrumbList} setData={setCurrentData} />}
        </div>

        {/* Output */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">JSON-LD Output</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600">{jsonString.length} chars</span>
                <button
                  onClick={handleCopy}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    copied
                      ? 'border-green-500/40 bg-green-500/10 text-green-400'
                      : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy Script Tag'}
                </button>
              </div>
            </div>
            <div className="overflow-auto rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] p-4 font-mono max-h-[500px]">
              <SyntaxHighlight json={jsonString} />
            </div>
          </div>

          {/* Instruction */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs text-cyan-300">
            <p className="font-semibold mb-1">How to add to your page</p>
            <p className="text-zinc-400">Copy the script tag and paste it inside the <code className="text-cyan-300">&lt;head&gt;</code> section of your HTML page. The &quot;Copy Script Tag&quot; button wraps the JSON-LD in the required <code className="text-cyan-300">&lt;script type=&quot;application/ld+json&quot;&gt;</code> tags automatically.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
