import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://www.quickkit.dev'

const appCategoryMap = {
  developer: 'DeveloperApplication',
  hr: 'BusinessApplication',
  pdf: 'BusinessApplication',
  career: 'BusinessApplication',
  text: 'UtilitiesApplication',
  finance: 'FinanceApplication',
  image: 'MultimediaApplication',
  seo: 'WebApplication',
}

export default function JsonLd({ tool, category, seoData }) {
  const toolUrl = `${BASE_URL}/${category.slug}/${tool.slug}`
  const categoryUrl = `${BASE_URL}/${category.slug}`
  const description = seoData?.description || tool.description

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seoData?.title || tool.name,
    description,
    url: toolUrl,
    applicationCategory: appCategoryMap[category.slug] || 'WebApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.name,
        item: categoryUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: toolUrl,
      },
    ],
  }

  const schemas = [webAppSchema, breadcrumbSchema]

  if (seoData?.faqs?.length) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: seoData.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    }
    schemas.push(faqSchema)
  }

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
