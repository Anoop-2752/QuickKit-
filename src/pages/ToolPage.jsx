import { lazy, Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Construction, getIcon } from '../lib/icons'
import { getColors } from '../lib/colors'
import { getToolBySlug, getCategoryBySlug } from '../data/tools'
import { usePageTitle } from '../hooks/usePageTitle'
import SEO from '../components/SEO'

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
}

function ToolIcon({ name, className }) {
  const Icon = getIcon(name)
  if (!Icon) return null
  // eslint-disable-next-line react-hooks/static-components
  return <Icon className={className} size={18} />
}

function NotFound({ onBack }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 text-center">
      <p className="mb-2 text-4xl">🔍</p>
      <h1 className="mb-3 text-2xl font-semibold text-white">Tool not found</h1>
      <p className="mb-8 text-sm text-zinc-500">
        The tool you're looking for doesn't exist or may have moved.
      </p>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-[#3a3a3a] hover:text-white"
      >
        ← Back
      </button>
    </div>
  )
}

function ComingSoon({ toolName }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2a2a2a] bg-[#141414] py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800">
        <Construction size={20} className="text-zinc-500" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-white">{toolName} — Coming Soon</h3>
      <p className="text-sm text-zinc-600">This tool is being built. Check back soon.</p>
    </div>
  )
}

function ToolSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-40 rounded-xl bg-[#1a1a1a]" />
      <div className="h-8 w-48 rounded-lg bg-[#1a1a1a]" />
    </div>
  )
}


export default function ToolPage() {
  const { category: categorySlug, tool: toolSlug } = useParams()
  const navigate = useNavigate()

  const tool     = getToolBySlug(categorySlug, toolSlug)
  const category = getCategoryBySlug(categorySlug)

  usePageTitle(tool?.name)

  if (!tool || !category) {
    return <NotFound onBack={() => navigate(categorySlug ? `/${categorySlug}` : '/')} />
  }

  const colors        = getColors(category.color)
  const ToolComponent = toolComponents[tool.slug]

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-8">
      <SEO
        title={`${tool.name} — Free Online Tool`}
        description={`Free online ${tool.name.toLowerCase()}. ${tool.description} No signup required, works instantly in your browser.`}
        keywords={`${tool.name.toLowerCase()}, free online ${tool.name.toLowerCase()}, ${tool.name} tool, ${category.name.toLowerCase()}`}
        path={`/${category.slug}/${tool.slug}`}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-zinc-600">
        <button onClick={() => navigate('/')} className="transition-colors hover:text-zinc-300">
          Home
        </button>
        <ChevronRight size={11} className="text-zinc-700" />
        <span className="text-zinc-400">{tool.name}</span>
      </nav>

      {/* Tool header */}
      <header className="mb-8">
        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${colors.iconBg}`}>
          <ToolIcon name={tool.icon} className={colors.iconColor} />
        </div>
        <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-white">{tool.name}</h1>
        <div className="mb-6 h-px bg-[#1a1a1a]" />
        <p className="text-sm text-zinc-500">{tool.description}</p>
      </header>

      {/* Tool content */}
      {ToolComponent ? (
        <Suspense fallback={<ToolSkeleton />}>
          <ToolComponent />
        </Suspense>
      ) : (
        <ComingSoon toolName={tool.name} />
      )}

    </div>
  )
}
