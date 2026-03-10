import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import SEO from '../components/SEO'

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-semibold text-green-400">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-zinc-400">{children}</div>
    </section>
  )
}

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  usePageTitle('Privacy Policy')

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <SEO
        title="Privacy Policy"
        description="QuickKit privacy policy — we don't collect personal data. All tools run client-side in your browser. Learn how Google AdSense and Vercel are used."
        path="/privacy"
      />
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-xs text-zinc-600 transition-colors hover:text-zinc-400"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">Privacy Policy</h1>
      <p className="mb-12 text-sm text-zinc-600">Last updated: January 2025</p>

      <Section title="Introduction">
        <p>
          QuickKit is a free utility tools platform providing developer and text utilities directly
          in your browser. We are committed to protecting your privacy and being transparent
          about how we operate.
        </p>
        <p>
          This policy explains what information is collected, how it is used, and what choices
          you have. By using QuickKit, you agree to the practices described here.
        </p>
      </Section>

      <Section title="Information We Collect">
        <p>
          <strong className="font-medium text-zinc-300">Tool input data:</strong> We do not
          collect, store, or transmit any data you enter into our tools. All processing
          happens client-side in your browser — nothing is sent to our servers.
        </p>
        <p>
          <strong className="font-medium text-zinc-300">Advertising data:</strong> We use
          Google AdSense to display advertisements. Google may collect cookies and usage
          data to serve personalised ads. This is governed by{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline hover:text-green-300"
          >
            Google's Privacy Policy
          </a>
          .
        </p>
        <p>
          <strong className="font-medium text-zinc-300">Analytics:</strong> We use basic
          analytics (such as page view counts) to understand traffic patterns and improve
          the site. This data is aggregated and not linked to individual users.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          We use cookies primarily through Google AdSense for ad personalisation. These are
          third-party cookies set by Google, not by QuickKit directly.
        </p>
        <p>
          You can opt out of personalised advertising by visiting{' '}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline hover:text-green-300"
          >
            Google's Ad Settings
          </a>
          . You can also manage cookies in your browser settings. See our{' '}
          <a href="/cookies" className="text-green-400 underline hover:text-green-300">
            Cookie Policy
          </a>{' '}
          for full details.
        </p>
      </Section>

      <Section title="Third-Party Services">
        <p>QuickKit uses the following third-party services:</p>
        <ul className="ml-4 list-disc space-y-1.5 marker:text-zinc-600">
          <li>
            <strong className="font-medium text-zinc-300">Google AdSense</strong> — advertising
            platform. Subject to{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 underline hover:text-green-300"
            >
              Google's Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong className="font-medium text-zinc-300">Vercel</strong> — hosting provider.
            Subject to{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 underline hover:text-green-300"
            >
              Vercel's Privacy Policy
            </a>
            .
          </li>
        </ul>
      </Section>

      <Section title="Data Security">
        <p>
          All QuickKit tools run entirely in your browser. When you format JSON, decode a JWT,
          or generate a UUID, that data never leaves your device. We have no servers processing
          your tool inputs.
        </p>
        <p>
          We do not store, log, or have access to anything you type or paste into our tools.
        </p>
      </Section>

      <Section title="Children's Privacy">
        <p>
          QuickKit is not directed at children under 13. We do not knowingly collect personal
          information from children.
        </p>
      </Section>

      <Section title="Changes to This Policy">
        <p>
          We may update this policy from time to time. Changes will be reflected by the
          "Last updated" date at the top of this page. Continued use of QuickKit after
          changes constitutes acceptance of the updated policy.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          For privacy concerns or questions, contact us at{' '}
          <a
            href="mailto:helloquickkit@gmail.com"
            className="text-green-400 underline hover:text-green-300"
          >
            helloquickkit@gmail.com
          </a>
          .
        </p>
      </Section>
    </div>
  )
}
