import { lazy, Suspense, useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Construction, getIcon } from '../lib/icons'
import { getColors } from '../lib/colors'
import { getToolBySlug, getCategoryBySlug } from '../data/tools'
import { getPreloadedSeo, setPreloadedSeo } from '../data/seo/preload'
import { useIsClient } from '../hooks/useIsClient'
import SEO from '../components/SEO'
import JsonLd from '../components/JsonLd'
import FaqAccordion from '../components/FaqAccordion'
import RelatedTools from '../components/RelatedTools'
import HowToSteps from '../components/HowToSteps'

// Lazy-loaded tool components — each becomes its own JS chunk
const JsonFormatter     = lazy(() => import('../tools/developer/JsonFormatter'))
const Base64            = lazy(() => import('../tools/developer/Base64'))
const JwtDecoder        = lazy(() => import('../tools/developer/JwtDecoder'))
const UuidGenerator     = lazy(() => import('../tools/developer/UuidGenerator'))
const TimestampConverter= lazy(() => import('../tools/developer/TimestampConverter'))
const UrlEncoder        = lazy(() => import('../tools/developer/UrlEncoder'))
const WordCounter       = lazy(() => import('../tools/text/WordCounter'))
const LoremIpsum        = lazy(() => import('../tools/text/LoremIpsum'))
const MarkdownPreviewer = lazy(() => import('../tools/text/MarkdownPreviewer'))
const CaseConverter     = lazy(() => import('../tools/text/CaseConverter'))
const DiffChecker            = lazy(() => import('../tools/text/DiffChecker'))
const FillerWordRemover      = lazy(() => import('../tools/text/FillerWordRemover'))
const AtsKeywordChecker      = lazy(() => import('../tools/career/AtsKeywordChecker'))
const ResumeCharacterCounter = lazy(() => import('../tools/career/ResumeCharacterCounter'))
const CoverLetterFillerChecker = lazy(() => import('../tools/career/CoverLetterFillerChecker'))
const ActionVerbSuggester    = lazy(() => import('../tools/career/ActionVerbSuggester'))
const JobApplicationTracker  = lazy(() => import('../tools/career/JobApplicationTracker'))
const CoverLetterGenerator   = lazy(() => import('../tools/career/CoverLetterGenerator'))
const ResumeBuilder          = lazy(() => import('../tools/career/ResumeBuilder'))
const PdfMerger              = lazy(() => import('../tools/pdf/PdfMerger'))
const PdfSplitter            = lazy(() => import('../tools/pdf/PdfSplitter'))
const PdfToText              = lazy(() => import('../tools/pdf/PdfToText'))
const PdfMetadataViewer      = lazy(() => import('../tools/pdf/PdfMetadataViewer'))
const HrEmailTemplates            = lazy(() => import('../tools/hr/HrEmailTemplates'))
const InterviewQuestionGenerator  = lazy(() => import('../tools/hr/InterviewQuestionGenerator'))
const NoticePeriodCalculator      = lazy(() => import('../tools/hr/NoticePeriodCalculator'))
const SalarySlipGenerator         = lazy(() => import('../tools/hr/SalarySlipGenerator'))
const OfferLetterGenerator        = lazy(() => import('../tools/hr/OfferLetterGenerator'))
const ExperienceLetterGenerator   = lazy(() => import('../tools/hr/ExperienceLetterGenerator'))
const ResignationLetterGenerator  = lazy(() => import('../tools/hr/ResignationLetterGenerator'))
const CtcBreakupCalculator        = lazy(() => import('../tools/hr/CtcBreakupCalculator'))
const CandidateScreener           = lazy(() => import('../tools/hr/CandidateScreener'))
const EmiCalculator               = lazy(() => import('../tools/finance/EmiCalculator'))
const IncomeTaxCalculator         = lazy(() => import('../tools/finance/IncomeTaxCalculator'))
const SipCalculator               = lazy(() => import('../tools/finance/SipCalculator'))
const GstCalculator               = lazy(() => import('../tools/finance/GstCalculator'))
const HraCalculator               = lazy(() => import('../tools/finance/HraCalculator'))
const GratuityCalculator          = lazy(() => import('../tools/finance/GratuityCalculator'))
const SalaryHikeCalculator        = lazy(() => import('../tools/finance/SalaryHikeCalculator'))
const FdRdCalculator              = lazy(() => import('../tools/finance/FdRdCalculator'))
const InvoiceGenerator            = lazy(() => import('../tools/finance/InvoiceGenerator'))
const TaxSavingOptimizer          = lazy(() => import('../tools/finance/TaxSavingOptimizer'))
const QrCodeGenerator             = lazy(() => import('../tools/developer/QrCodeGenerator'))
const ImageCompressor             = lazy(() => import('../tools/image/ImageCompressor'))
const ImageResizer                = lazy(() => import('../tools/image/ImageResizer'))
const ImageToBase64               = lazy(() => import('../tools/image/ImageToBase64'))
const ImageConverter              = lazy(() => import('../tools/image/ImageConverter'))
const ImageColorPicker            = lazy(() => import('../tools/image/ImageColorPicker'))
const ImageMetadataViewer         = lazy(() => import('../tools/image/ImageMetadataViewer'))
const MetaTagGenerator            = lazy(() => import('../tools/seo/MetaTagGenerator'))
const TitleTagChecker             = lazy(() => import('../tools/seo/TitleTagChecker'))
const OgPreview                   = lazy(() => import('../tools/seo/OgPreview'))
const RobotsTxtGenerator          = lazy(() => import('../tools/seo/RobotsTxtGenerator'))
const KeywordDensityChecker       = lazy(() => import('../tools/seo/KeywordDensityChecker'))
const ReadabilityChecker          = lazy(() => import('../tools/text/ReadabilityChecker'))
const SchemaMarkupGenerator       = lazy(() => import('../tools/seo/SchemaMarkupGenerator'))
const PrivacyPolicyGenerator      = lazy(() => import('../tools/seo/PrivacyPolicyGenerator'))
const PaycheckCalculator          = lazy(() => import('../tools/us/PaycheckCalculator'))

const toolComponents = {
  'json-formatter':           JsonFormatter,
  'base64':                   Base64,
  'jwt-decoder':              JwtDecoder,
  'uuid-generator':           UuidGenerator,
  'timestamp-converter':      TimestampConverter,
  'url-encoder':              UrlEncoder,
  'word-counter':             WordCounter,
  'lorem-ipsum':              LoremIpsum,
  'markdown-previewer':       MarkdownPreviewer,
  'case-converter':           CaseConverter,
  'diff-checker':             DiffChecker,
  'filler-word-remover':      FillerWordRemover,
  'ats-keyword-checker':      AtsKeywordChecker,
  'resume-character-counter': ResumeCharacterCounter,
  'cover-letter-filler-checker': CoverLetterFillerChecker,
  'action-verb-suggester':    ActionVerbSuggester,
  'job-application-tracker':  JobApplicationTracker,
  'cover-letter-generator':   CoverLetterGenerator,
  'resume-builder':           ResumeBuilder,
  'pdf-merger':               PdfMerger,
  'pdf-splitter':             PdfSplitter,
  'pdf-to-text':              PdfToText,
  'pdf-metadata-viewer':      PdfMetadataViewer,
  'hr-email-templates':           HrEmailTemplates,
  'interview-question-generator': InterviewQuestionGenerator,
  'notice-period-calculator':     NoticePeriodCalculator,
  'salary-slip-generator':        SalarySlipGenerator,
  'offer-letter-generator':       OfferLetterGenerator,
  'experience-letter-generator':  ExperienceLetterGenerator,
  'resignation-letter-generator': ResignationLetterGenerator,
  'ctc-breakup-calculator':       CtcBreakupCalculator,
  'candidate-screener':           CandidateScreener,
  'emi-calculator':               EmiCalculator,
  'income-tax-calculator':        IncomeTaxCalculator,
  'sip-calculator':               SipCalculator,
  'gst-calculator':               GstCalculator,
  'hra-calculator':               HraCalculator,
  'gratuity-calculator':          GratuityCalculator,
  'salary-hike-calculator':       SalaryHikeCalculator,
  'fd-rd-calculator':             FdRdCalculator,
  'invoice-generator':            InvoiceGenerator,
  'tax-saving-optimizer':         TaxSavingOptimizer,
  'qr-code-generator':            QrCodeGenerator,
  'image-compressor':             ImageCompressor,
  'image-resizer':                ImageResizer,
  'image-to-base64':              ImageToBase64,
  'image-converter':              ImageConverter,
  'image-color-picker':           ImageColorPicker,
  'image-metadata-viewer':        ImageMetadataViewer,
  'meta-tag-generator':           MetaTagGenerator,
  'title-tag-checker':            TitleTagChecker,
  'og-preview':                   OgPreview,
  'robots-txt-generator':         RobotsTxtGenerator,
  'keyword-density-checker':      KeywordDensityChecker,
  'readability-checker':          ReadabilityChecker,
  'schema-markup-generator':      SchemaMarkupGenerator,
  'privacy-policy-generator':     PrivacyPolicyGenerator,
  'paycheck-calculator':          PaycheckCalculator,
}

function ToolIcon({ name, className }) {
  const Icon = getIcon(name)
  if (!Icon) return null
  // eslint-disable-next-line react-hooks/static-components
  return <Icon className={className} size={18} />
}

function NotFound({ onBack }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <SEO title="Tool Not Found" noindex />
      <p className="mb-2 text-4xl">🔍</p>
      <h1 className="mb-3 text-2xl font-semibold text-[var(--ink)]">Tool not found</h1>
      <p className="mb-8 text-sm text-[var(--ink-body)]">
        The tool you're looking for doesn't exist or may have moved.
      </p>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-4 py-2 text-sm text-[var(--ink-strong)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
      >
        ← Back
      </button>
    </div>
  )
}

function ComingSoon({ toolName }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-alt)] py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-tint)]">
        <Construction size={20} className="text-[var(--ink-body)]" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-[var(--ink)]">{toolName} — Coming Soon</h3>
      <p className="text-sm text-[var(--ink-muted)]">This tool is being built. Check back soon.</p>
    </div>
  )
}

function ToolSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-40 rounded-xl bg-[var(--surface-tint)]" />
      <div className="h-8 w-48 rounded-lg bg-[var(--surface-tint)]" />
    </div>
  )
}


export default function ToolPage() {
  const { category: categorySlug, tool: toolSlug } = useParams()
  const navigate = useNavigate()

  const tool     = getToolBySlug(categorySlug, toolSlug)
  const category = getCategoryBySlug(categorySlug)
  const isClient = useIsClient()

  // Prerendered pages inline their SEO data, so the very first render already
  // has it; every other navigation falls back to fetching the category chunk.
  const [seoData, setSeoData] = useState(
    () => getPreloadedSeo(categorySlug, toolSlug) ?? null
  )

  useEffect(() => {
    const preloaded = getPreloadedSeo(categorySlug, tool?.slug)
    if (preloaded !== undefined) {
      setSeoData(preloaded)
      return
    }

    // Clear first: without this the previous tool's FAQs and How-To steps stay
    // on screen under the new tool's heading until the chunk resolves.
    setSeoData(null)

    let cancelled = false
    import(`../data/seo/${categorySlug}.js`)
      .then((m) => {
        if (cancelled) return
        setPreloadedSeo(categorySlug, m.default)
        setSeoData(m.default[tool?.slug] ?? null)
      })
      .catch(() => {
        if (!cancelled) setSeoData(null)
      })
    return () => {
      cancelled = true
    }
  }, [categorySlug, toolSlug, tool?.slug])

  if (!tool || !category) {
    return <NotFound onBack={() => navigate(categorySlug ? `/${categorySlug}` : '/')} />
  }

  const colors        = getColors(category.color)
  const ToolComponent = toolComponents[tool.slug]

  const seoDescription = seoData?.longDescription
    || `Free online ${tool.name.toLowerCase()}. ${tool.description} No signup required, works instantly in your browser.`
  const seoKeywords = seoData?.keywords?.join(', ')
    || `${tool.name.toLowerCase()}, free online ${tool.name.toLowerCase()}, ${tool.name} tool, ${category.name.toLowerCase()}`

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-8">
      <SEO
        title={`${tool.name} — Free Online Tool`}
        description={seoDescription}
        keywords={seoKeywords}
        path={`/${category.slug}/${tool.slug}`}
      />
      <JsonLd tool={tool} category={category} seoData={seoData} />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
        <Link to="/" className="transition-colors hover:text-[var(--ink-strong)]">
          Home
        </Link>
        <ChevronRight size={11} className="text-[var(--ink-faint)]" />
        <Link to={`/${category.slug}`} className="transition-colors hover:text-[var(--ink-strong)]">
          {category.name}
        </Link>
        <ChevronRight size={11} className="text-[var(--ink-faint)]" />
        <span className="text-[var(--ink-body)]">{tool.name}</span>
      </nav>

      {/* Tool header */}
      <header className="mb-8">
        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${colors.iconBg}`}>
          <ToolIcon name={tool.icon} className={colors.iconColor} />
        </div>
        <h1 className="font-display mb-1.5 text-[42px] leading-[1.1] tracking-tight text-[var(--ink)]">{tool.name}</h1>
        <div className="mb-6 h-px bg-[var(--surface-tint)]" />
        <p className="text-sm text-[var(--ink-body)]">{tool.description}</p>
      </header>

      {/* Tool content — the interactive tool mounts after hydration, so the
          prerendered HTML and the hydration pass render the same skeleton and
          browser-only libraries stay out of the server bundle. */}
      {!isClient ? (
        <ToolSkeleton />
      ) : ToolComponent ? (
        <Suspense fallback={<ToolSkeleton />}>
          <ToolComponent />
        </Suspense>
      ) : (
        <ComingSoon toolName={tool.name} />
      )}

      {/* How to Use section */}
      <HowToSteps steps={seoData?.howToSteps} />

      {/* FAQ section */}
      {seoData?.faqs && <FaqAccordion faqs={seoData.faqs} />}

      {/* Related tools */}
      <RelatedTools category={category} currentToolSlug={tool.slug} />

    </div>
  )
}
