import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-semibold text-[var(--accent)]">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-[var(--ink-body)]">{children}</div>
    </section>
  )
}

export default function CookiePolicy() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <SEO
        title="Cookie Policy"
        description="QuickKit cookie policy — how we use cookies for ads and analytics. Learn how to manage and opt out of Google AdSense cookies."
        path="/cookies"
      />
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-xs text-[var(--ink-muted)] transition-colors hover:text-[var(--ink-body)]"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-4xl font-bold tracking-tight text-[var(--ink)]">Cookie Policy</h1>
      <p className="mb-12 text-sm text-[var(--ink-muted)]">Last updated: January 2025</p>

      <Section title="What Are Cookies">
        <p>
          Cookies are small text files that are stored in your browser when you visit a
          website. They are widely used to make websites work efficiently and to provide
          information to site owners.
        </p>
        <p>
          Cookies can be "session" cookies (deleted when you close your browser) or
          "persistent" cookies (stored for a set period or until you delete them).
        </p>
      </Section>

      <Section title="How We Use Cookies">
        <p>
          QuickKit itself does not set any first-party cookies for tracking or storing personal
          data. Our tools run entirely in your browser and use{' '}
          <code className="rounded bg-[var(--surface-tint)] px-1.5 py-0.5 font-mono text-xs text-[var(--ink-strong)]">
            localStorage
          </code>{' '}
          only for lightweight UI preferences (such as dismissing the cookie banner).
        </p>
        <p>
          Third-party services we use may set their own cookies as described below.
        </p>
      </Section>

      <Section title="Types of Cookies We Use">
        <p>
          <strong className="font-medium text-[var(--ink-strong)]">Advertising cookies (Google AdSense):</strong>
        </p>
        <p>
          We display ads through Google AdSense. Google uses cookies to serve ads based on
          your prior visits to our site and other sites on the internet. These cookies enable
          Google and its partners to show you personalised advertisements.
        </p>
        <p>
          Google's advertising cookies include{' '}
          <code className="rounded bg-[var(--surface-tint)] px-1.5 py-0.5 font-mono text-xs text-[var(--ink-strong)]">
            _ga
          </code>
          ,{' '}
          <code className="rounded bg-[var(--surface-tint)] px-1.5 py-0.5 font-mono text-xs text-[var(--ink-strong)]">
            _gid
          </code>
          , and similar identifiers. These are persistent cookies typically lasting 30 days to 2 years.
        </p>

        <p className="mt-2">
          <strong className="font-medium text-[var(--ink-strong)]">Analytics cookies:</strong>
        </p>
        <p>
          We may use analytics tools to understand how visitors interact with the site
          (page views, popular tools, referral sources). This data is aggregated and
          anonymised — it cannot be used to identify individual users.
        </p>

        <p className="mt-2">
          <strong className="font-medium text-[var(--ink-strong)]">Preference cookies:</strong>
        </p>
        <p>
          We use{' '}
          <code className="rounded bg-[var(--surface-tint)] px-1.5 py-0.5 font-mono text-xs text-[var(--ink-strong)]">
            localStorage
          </code>{' '}
          (not cookies) to store your cookie banner preference so we don't show it on every visit.
        </p>
      </Section>

      <Section title="Managing Cookies">
        <p>
          You have several options for managing cookies:
        </p>
        <ul className="ml-4 list-disc space-y-2 marker:text-[var(--ink-muted)]">
          <li>
            <strong className="font-medium text-[var(--ink-strong)]">Browser settings:</strong> Most
            browsers allow you to block or delete cookies. Refer to your browser's help
            documentation for instructions. Note that blocking cookies may affect site
            functionality.
          </li>
          <li>
            <strong className="font-medium text-[var(--ink-strong)]">Google Ad Settings:</strong> Opt
            out of personalised Google ads at{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline hover:text-[var(--accent)]"
            >
              google.com/settings/ads
            </a>
            .
          </li>
          <li>
            <strong className="font-medium text-[var(--ink-strong)]">NAI Opt-Out:</strong> Opt out of
            interest-based advertising via the{' '}
            <a
              href="https://optout.networkadvertising.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline hover:text-[var(--accent)]"
            >
              Network Advertising Initiative
            </a>
            .
          </li>
        </ul>
      </Section>

      <Section title="Changes to This Policy">
        <p>
          We may update this Cookie Policy from time to time. Changes will be reflected by
          the "Last updated" date above. Continued use of QuickKit after changes constitutes
          acceptance of the updated policy.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about our cookie usage? Contact us at{' '}
          <a
            href="mailto:helloquickkit@gmail.com"
            className="text-[var(--accent)] underline hover:text-[var(--accent)]"
          >
            helloquickkit@gmail.com
          </a>
          .
        </p>
      </Section>
    </div>
  )
}
