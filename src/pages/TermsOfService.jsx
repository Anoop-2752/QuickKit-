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

export default function TermsOfService() {
  const navigate = useNavigate()
  usePageTitle('Terms of Service')

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <SEO
        title="Terms of Service"
        description="QuickKit terms of service — rules and guidelines for using our free developer tools. Tools are provided as-is and outputs belong to you."
        path="/terms"
      />
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-xs text-zinc-600 transition-colors hover:text-zinc-400"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">Terms of Service</h1>
      <p className="mb-12 text-sm text-zinc-600">Last updated: January 2025</p>

      <Section title="Acceptance of Terms">
        <p>
          By accessing or using QuickKit ("the Site"), you agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use the Site.
        </p>
        <p>
          These terms apply to all visitors and users of QuickKit.
        </p>
      </Section>

      <Section title="Use of Service">
        <p>
          QuickKit is provided free of charge as a collection of browser-based developer and
          text utility tools.
        </p>
        <ul className="ml-4 list-disc space-y-1.5 marker:text-zinc-600">
          <li>Tools are provided for personal and professional use.</li>
          <li>You may not use QuickKit for any unlawful or prohibited purpose.</li>
          <li>You may not attempt to disrupt, overload, or compromise the Site's operation.</li>
          <li>You may not scrape or harvest content from the Site at abusive rates.</li>
        </ul>
      </Section>

      <Section title="Disclaimer of Warranties">
        <p>
          QuickKit and all tools are provided{' '}
          <strong className="font-medium text-zinc-300">"as is"</strong> without any warranty
          of any kind, express or implied, including but not limited to warranties of
          merchantability, fitness for a particular purpose, or non-infringement.
        </p>
        <p>
          Tool outputs are provided for convenience only. We make no guarantee that outputs
          are accurate, complete, or suitable for any specific purpose.{' '}
          <strong className="font-medium text-zinc-300">
            Always verify important outputs independently before relying on them.
          </strong>
        </p>
        <p>
          We do not warrant that the Site will be uninterrupted, error-free, or free of
          viruses or other harmful components.
        </p>
      </Section>

      <Section title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, QuickKit and its operators shall not be
          liable for any indirect, incidental, special, consequential, or punitive damages
          arising from your use of, or inability to use, the Site or its tools.
        </p>
        <p>
          This includes but is not limited to damages for loss of data, loss of profits,
          or other intangible losses.
        </p>
      </Section>

      <Section title="Intellectual Property">
        <p>
          The QuickKit name, logo, and overall design are the property of QuickKit. You may not
          reproduce or repurpose them without prior written permission.
        </p>
        <p>
          Any content or output you generate using QuickKit tools belongs to you. We claim no
          ownership over tool outputs.
        </p>
        <p>
          QuickKit uses open-source libraries which are subject to their respective licenses.
        </p>
      </Section>

      <Section title="Third-Party Links and Services">
        <p>
          The Site may contain links to third-party websites or services. We are not
          responsible for the content, privacy practices, or terms of those external sites.
          Links are provided for convenience only.
        </p>
      </Section>

      <Section title="Changes to Terms">
        <p>
          We reserve the right to modify these terms at any time. Changes will be reflected
          by the "Last updated" date at the top of this page.
        </p>
        <p>
          Your continued use of QuickKit after any changes constitutes acceptance of the
          revised terms.
        </p>
      </Section>

      <Section title="Governing Law">
        <p>
          These terms are governed by applicable law. Any disputes shall be resolved in
          accordance with that jurisdiction.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms? Contact us at{' '}
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
