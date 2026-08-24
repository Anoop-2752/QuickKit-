import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://www.quickkit.dev'
const DEFAULT_TITLE = 'QuickKit — Free Online Tools for Developer, HR, Finance, PDF & More'
const DEFAULT_DESC = 'Free online tools for developers, HR, finance, career, SEO, image, PDF and text — EMI calculator, GST calculator, salary slip generator, PDF merger, JSON formatter and more. No signup, runs entirely in your browser.'
const DEFAULT_KEYWORDS = 'free online tools, EMI calculator, GST calculator, income tax calculator, salary slip generator, PDF merger, ATS keyword checker, HR tools, developer tools, word counter, JSON formatter'

export default function SEO({ title, description, keywords, path, noindex = false }) {
  const fullTitle = title ? `${title} | QuickKit` : DEFAULT_TITLE
  const desc = description || DEFAULT_DESC
  const kw = keywords || DEFAULT_KEYWORDS
  const canonical = `${BASE_URL}${path || ''}`

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={kw} />
      <meta name="author" content="QuickKit" />
      <link rel="canonical" href={canonical} />

      {/* Crawlers */}
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
      <meta name="googlebot" content={noindex ? 'noindex, follow' : 'index, follow'} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="QuickKit" />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="QuickKit — free online tools" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
    </Helmet>
  )
}
