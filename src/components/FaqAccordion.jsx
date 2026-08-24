import { useId, useState } from 'react'
import { ChevronDown } from '../lib/icons'

export default function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null)
  const baseId = useId()

  if (!faqs?.length) return null

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-white mb-4">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-[#2a2a2a]">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          const panelId = `${baseId}-panel-${index}`
          const buttonId = `${baseId}-button-${index}`
          return (
            <div key={index}>
              <h3>
                <button
                  id={buttonId}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-sm font-medium text-zinc-300">
                    {faq.q}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-all duration-200 ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-4 text-sm text-zinc-500">{faq.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
