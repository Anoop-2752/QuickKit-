export const toolSeoData = {
  // ── DEVELOPER ──────────────────────────────────────────────────────────
  'json-formatter': {
    longDescription:
      'Format, validate, and beautify your JSON data instantly with this free online JSON formatter. Paste raw or minified JSON and get perfectly indented, syntax-highlighted output right in your browser — no signup or installation required. Ideal for developers debugging API responses, config files, or any structured data.',
    keywords: [
      'json formatter',
      'json validator online',
      'json beautifier',
      'format json online',
      'json pretty print',
      'validate json',
      'json lint online',
    ],
    faqs: [
      {
        q: 'How do I format JSON online for free?',
        a: 'Paste your raw JSON into the editor and it will be formatted and validated instantly. The tool runs entirely in your browser, so your data never leaves your device.',
      },
      {
        q: 'Can this tool validate JSON syntax?',
        a: 'Yes. The formatter highlights syntax errors and tells you exactly where the issue is, making it easy to fix malformed JSON quickly.',
      },
      {
        q: 'Is it safe to paste sensitive JSON data here?',
        a: 'Absolutely. Everything runs client-side in your browser. No data is sent to any server, so your API keys, tokens, and private data stay private.',
      },
    ],
  },

  'base64': {
    longDescription:
      'Encode text to Base64 or decode Base64 strings back to plain text with this free online tool. Perfect for developers working with data URIs, API authentication headers, or encoded payloads — all processing happens in your browser with no signup needed.',
    keywords: [
      'base64 encoder',
      'base64 decoder',
      'base64 encode online',
      'base64 decode online',
      'text to base64',
      'base64 to text',
      'base64 converter',
    ],
    faqs: [
      {
        q: 'What is Base64 encoding used for?',
        a: 'Base64 encoding converts binary or text data into an ASCII string format. It is commonly used in email attachments, data URIs, API authentication headers, and embedding images in CSS or HTML.',
      },
      {
        q: 'How do I decode a Base64 string online?',
        a: 'Paste your Base64-encoded string into the input field and select "Decode." The original text will appear instantly — no account or download required.',
      },
      {
        q: 'Is Base64 encoding the same as encryption?',
        a: 'No. Base64 is an encoding scheme, not encryption. Anyone can decode a Base64 string, so it should never be used to protect sensitive information.',
      },
    ],
  },

  'jwt-decoder': {
    longDescription:
      'Decode and inspect JSON Web Tokens (JWT) instantly with this free online JWT decoder. View the header, payload, and expiration details without any server-side processing. A must-have tool for developers working with OAuth, API authentication, or any JWT-based workflow.',
    keywords: [
      'jwt decoder',
      'jwt token decoder online',
      'decode jwt',
      'jwt parser',
      'json web token decoder',
      'jwt viewer',
      'jwt debugger',
    ],
    faqs: [
      {
        q: 'How do I decode a JWT token online?',
        a: 'Paste the full JWT string into the input field and the tool will instantly display the decoded header and payload sections, including claims like expiration time and issuer.',
      },
      {
        q: 'Is it safe to paste my JWT token into an online decoder?',
        a: 'Yes, this tool runs entirely in your browser. Your token is never sent to any server, so your credentials and claims remain private.',
      },
      {
        q: 'What information is inside a JWT token?',
        a: 'A JWT contains three parts: a header (algorithm and token type), a payload (claims like user ID, roles, and expiration), and a signature used to verify authenticity.',
      },
    ],
  },

  'uuid-generator': {
    longDescription:
      'Generate random UUIDs (v4) instantly with this free online UUID generator. Create one or many universally unique identifiers for databases, APIs, or testing — all in your browser with no signup required. Copy to clipboard with a single click.',
    keywords: [
      'uuid generator',
      'uuid generator online',
      'generate uuid',
      'random uuid',
      'uuid v4 generator',
      'guid generator',
      'unique id generator',
    ],
    faqs: [
      {
        q: 'What is a UUID and when should I use one?',
        a: 'A UUID (Universally Unique Identifier) is a 128-bit identifier that is practically guaranteed to be unique. Use UUIDs as primary keys in databases, as request IDs for tracing, or anywhere you need a unique reference without a central authority.',
      },
      {
        q: 'Can I generate multiple UUIDs at once?',
        a: 'Yes. Specify how many UUIDs you need and the tool will generate them all instantly. You can copy the full list to your clipboard in one click.',
      },
      {
        q: 'Are the generated UUIDs truly unique?',
        a: 'Version 4 UUIDs are generated using a cryptographically secure random number generator. The probability of a collision is astronomically low — around 1 in 5.3 × 10^36.',
      },
    ],
  },

  'timestamp-converter': {
    longDescription:
      'Convert between Unix timestamps and human-readable dates with this free online timestamp converter. Supports seconds and milliseconds, multiple date formats, and timezone adjustments — all running client-side in your browser with no signup needed.',
    keywords: [
      'unix timestamp converter',
      'timestamp to date',
      'epoch converter',
      'date to timestamp',
      'unix time converter online',
      'epoch time converter',
    ],
    faqs: [
      {
        q: 'How do I convert a Unix timestamp to a date?',
        a: 'Paste your Unix timestamp (in seconds or milliseconds) into the input field and the tool will instantly show the corresponding date and time in a human-readable format.',
      },
      {
        q: 'What is a Unix timestamp?',
        a: 'A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC (the Unix epoch). It is widely used in programming, databases, and APIs to represent points in time.',
      },
      {
        q: 'Does this tool support millisecond timestamps?',
        a: 'Yes. The converter automatically detects whether your timestamp is in seconds or milliseconds and converts it accordingly.',
      },
    ],
  },

  'url-encoder': {
    longDescription:
      'Encode or decode URLs and query strings instantly with this free online URL encoder/decoder. Ensure your URLs are safe for transmission by converting special characters to percent-encoded format — all processing runs in your browser with no signup required.',
    keywords: [
      'url encoder',
      'url decoder',
      'url encode online',
      'url decode online',
      'percent encoding',
      'urlencode online',
      'encode url characters',
    ],
    faqs: [
      {
        q: 'What does URL encoding do?',
        a: 'URL encoding replaces unsafe or special characters (like spaces, ampersands, and non-ASCII characters) with percent-encoded equivalents so they can be safely transmitted in a URL.',
      },
      {
        q: 'How do I decode a URL-encoded string?',
        a: 'Paste the encoded string into the input and select "Decode." The tool will convert all percent-encoded characters back to their original form instantly.',
      },
      {
        q: 'When do I need to URL-encode a string?',
        a: 'Whenever you include user input, file names, or special characters in a URL query string or path segment. Encoding prevents broken links and ensures servers interpret the URL correctly.',
      },
    ],
  },

  // ── HR ──────────────────────────────────────────────────────────────────
  'hr-email-templates': {
    longDescription:
      'Access a library of ready-to-use HR email templates for common workplace scenarios — from offer letters and onboarding to termination and policy updates. Customize and copy professional email drafts instantly in your browser, completely free and with no signup.',
    keywords: [
      'hr email templates',
      'hr email samples',
      'professional hr emails',
      'employee onboarding email template',
      'offer letter email template',
      'hr communication templates',
      'workplace email templates',
    ],
    faqs: [
      {
        q: 'Where can I find free HR email templates?',
        a: 'QuickKit offers a curated set of HR email templates covering hiring, onboarding, appraisals, and more. Pick a template, customize the details, and copy it — no signup or download needed.',
      },
      {
        q: 'What types of HR emails are included?',
        a: 'The collection includes templates for offer letters, rejection emails, onboarding instructions, performance reviews, policy announcements, and many other common HR communication scenarios.',
      },
      {
        q: 'Can I customize the HR email templates?',
        a: 'Yes. Each template is fully editable. Replace the placeholder text with your company details and employee information before copying or downloading.',
      },
    ],
  },

  'interview-question-generator': {
    longDescription:
      'Generate tailored interview questions for any job role or skill set with this free online interview question generator. Perfect for HR professionals and hiring managers who need structured, relevant questions quickly — all running in your browser with no signup required.',
    keywords: [
      'interview question generator',
      'interview questions for hr',
      'generate interview questions',
      'job interview questions',
      'behavioral interview questions',
      'technical interview questions',
      'hiring interview questions',
    ],
    faqs: [
      {
        q: 'How do I generate interview questions for a specific role?',
        a: 'Enter the job title, key skills, and experience level, and the tool will generate a set of relevant interview questions including behavioral, technical, and situational types.',
      },
      {
        q: 'Are these interview questions suitable for all industries?',
        a: 'Yes. The generator creates questions based on the role and skills you specify, making it adaptable for tech, finance, healthcare, marketing, and virtually any other industry.',
      },
      {
        q: 'Can I get behavioral interview questions?',
        a: 'Absolutely. The tool generates behavioral questions using the STAR format, helping you assess how candidates have handled real situations in the past.',
      },
    ],
  },

  'notice-period-calculator': {
    longDescription:
      'Calculate your last working day and notice period end date with this free online notice period calculator. Enter your resignation date and notice period length to instantly see key dates — ideal for employees and HR teams in India. No signup needed, runs entirely in your browser.',
    keywords: [
      'notice period calculator',
      'last working day calculator',
      'notice period end date',
      'resignation date calculator',
      'calculate notice period',
      'notice period calculator India',
    ],
    faqs: [
      {
        q: 'How do I calculate my last working day after resignation?',
        a: 'Enter your resignation date and notice period duration (in days or months). The tool instantly calculates your last working day, accounting for the full notice period.',
      },
      {
        q: 'What is a standard notice period in India?',
        a: 'Notice periods in India typically range from 30 to 90 days depending on the company and seniority level. Some organizations may have shorter or longer periods as specified in the employment contract.',
      },
      {
        q: 'Does this calculator account for weekends and holidays?',
        a: 'The calculator computes calendar days by default, as most Indian employment contracts define notice periods in calendar days rather than working days.',
      },
    ],
  },

  'salary-slip-generator': {
    longDescription:
      'Generate professional salary slips instantly with this free online salary slip generator. Enter employee details, earnings, and deductions to create a clean, downloadable pay slip — perfect for small businesses and HR teams in India. No signup required, everything runs in your browser.',
    keywords: [
      'salary slip generator',
      'payslip generator online',
      'free salary slip maker',
      'salary slip format',
      'generate payslip online',
      'salary slip generator India',
      'pay slip template',
    ],
    faqs: [
      {
        q: 'How do I create a salary slip online for free?',
        a: 'Enter the employee name, designation, earnings (basic, HRA, allowances), and deductions (PF, tax, etc.). The tool generates a professional salary slip you can download or print instantly.',
      },
      {
        q: 'What details are included in a salary slip?',
        a: 'A standard salary slip includes employee information, pay period, earnings breakdown (basic salary, HRA, allowances), deductions (PF, ESI, professional tax, income tax), and net pay.',
      },
      {
        q: 'Is this salary slip generator suitable for Indian companies?',
        a: 'Yes. The generator follows Indian payroll conventions including PF, ESI, professional tax, and HRA components commonly used across Indian organizations.',
      },
    ],
  },

  'offer-letter-generator': {
    longDescription:
      'Create professional offer letters in minutes with this free online offer letter generator. Fill in the candidate and role details to produce a polished, ready-to-send offer letter — perfect for HR teams and startups. Runs entirely in your browser with no signup needed.',
    keywords: [
      'offer letter generator',
      'offer letter template',
      'job offer letter maker',
      'generate offer letter online',
      'free offer letter generator',
      'employment offer letter format',
      'offer letter generator India',
    ],
    faqs: [
      {
        q: 'How do I create a job offer letter online?',
        a: 'Enter the candidate name, job title, salary details, joining date, and company information. The tool generates a professional offer letter you can download, copy, or print.',
      },
      {
        q: 'What should an offer letter include?',
        a: 'A standard offer letter includes the job title, compensation details, joining date, reporting manager, work location, and terms and conditions of employment.',
      },
      {
        q: 'Is this offer letter format legally valid in India?',
        a: 'The generated letter follows standard Indian corporate formats. However, we recommend having your legal team review it before sending, as specific clauses may vary by organization and jurisdiction.',
      },
    ],
  },

  'experience-letter-generator': {
    longDescription:
      'Generate professional experience letters and service certificates with this free online tool. Enter employee and company details to create a formal experience letter ready for download — ideal for HR departments and small businesses in India. No signup, fully browser-based.',
    keywords: [
      'experience letter generator',
      'experience certificate generator',
      'service certificate maker',
      'work experience letter format',
      'free experience letter generator',
      'experience letter template India',
    ],
    faqs: [
      {
        q: 'How do I make an experience letter online?',
        a: 'Enter the employee name, designation, employment dates, and company details. The tool instantly generates a formal experience letter that you can download or print.',
      },
      {
        q: 'What is the difference between an experience letter and a relieving letter?',
        a: 'An experience letter certifies the employee\'s role, tenure, and performance, while a relieving letter confirms that the employee has been formally relieved from duties. Both are typically issued at the end of employment.',
      },
      {
        q: 'Is an experience letter mandatory in India?',
        a: 'While not legally mandatory, experience letters are a standard practice in India and are almost always required by new employers as proof of previous employment during the hiring process.',
      },
    ],
  },

  'resignation-letter-generator': {
    longDescription:
      'Draft a professional resignation letter in seconds with this free online resignation letter generator. Choose a tone, enter your details, and get a polished letter ready to submit — no signup or download required. Runs completely in your browser.',
    keywords: [
      'resignation letter generator',
      'resignation letter format',
      'resignation letter maker',
      'how to write resignation letter',
      'free resignation letter template',
      'resignation letter generator India',
      'professional resignation letter',
    ],
    faqs: [
      {
        q: 'How do I write a professional resignation letter?',
        a: 'Enter your name, designation, last working day, and reason for leaving. The tool generates a polished resignation letter with the right tone and format, ready to submit to your manager or HR.',
      },
      {
        q: 'Should I mention the reason for resignation in the letter?',
        a: 'It is optional. A brief, professional reason (career growth, personal reasons, relocation) is common practice, but you are not obligated to go into detail.',
      },
      {
        q: 'Can I customize the tone of the resignation letter?',
        a: 'Yes. The generator lets you choose between formal, appreciative, and concise tones so the letter matches your relationship with the employer.',
      },
    ],
  },

  'ctc-breakup-calculator': {
    longDescription:
      'Break down your CTC (Cost to Company) into in-hand salary, basic pay, HRA, PF, and other components with this free online CTC breakup calculator. Designed for Indian salary structures, it helps employees and HR teams understand the real take-home pay — no signup required.',
    keywords: [
      'ctc breakup calculator',
      'ctc to in-hand salary calculator',
      'cost to company calculator',
      'salary breakup calculator India',
      'ctc calculator online',
      'take home salary calculator',
      'ctc to net salary',
    ],
    faqs: [
      {
        q: 'How do I calculate my in-hand salary from CTC?',
        a: 'Enter your annual CTC and the tool breaks it down into basic pay, HRA, special allowances, PF contribution, professional tax, and other deductions to show your estimated monthly take-home salary.',
      },
      {
        q: 'What is the difference between CTC and in-hand salary?',
        a: 'CTC is the total cost your employer spends on you, including PF, gratuity, insurance, and bonuses. In-hand salary is what you actually receive after all deductions, which is typically 60-75% of CTC.',
      },
      {
        q: 'Does this calculator follow Indian salary structure?',
        a: 'Yes. It uses standard Indian payroll components including basic salary, HRA, PF (both employee and employer), professional tax, and income tax deductions under both old and new regimes.',
      },
    ],
  },

  'candidate-screener': {
    longDescription:
      'Screen and evaluate job candidates quickly with this free online candidate screening tool. Input job requirements and candidate profiles to get a structured assessment — ideal for recruiters and hiring managers who need to shortlist applicants efficiently. No signup, runs in your browser.',
    keywords: [
      'candidate screener',
      'candidate screening tool',
      'resume screener online',
      'candidate evaluation tool',
      'applicant screening',
      'hiring screening tool',
      'free candidate screener',
    ],
    faqs: [
      {
        q: 'How does the candidate screening tool work?',
        a: 'Enter the job requirements and paste candidate details or resumes. The tool evaluates alignment between the role requirements and candidate qualifications, giving you a structured summary to speed up shortlisting.',
      },
      {
        q: 'Can this tool replace an ATS?',
        a: 'This tool is designed for quick, manual screening of individual candidates. For large-scale automated tracking and pipeline management, a full ATS would be more appropriate.',
      },
      {
        q: 'Is my candidate data kept private?',
        a: 'Yes. All processing happens locally in your browser. No candidate information is uploaded to any server, ensuring complete privacy and compliance.',
      },
    ],
  },

  // ── PDF ─────────────────────────────────────────────────────────────────
  'pdf-merger': {
    longDescription:
      'Merge multiple PDF files into a single document with this free online PDF merger. Drag and drop your files, rearrange the order, and download the combined PDF — all processed in your browser with no upload to any server. No signup required.',
    keywords: [
      'pdf merger',
      'merge pdf online',
      'combine pdf files',
      'join pdf online free',
      'pdf combiner',
      'merge pdf free',
      'combine multiple pdfs',
    ],
    faqs: [
      {
        q: 'How do I merge PDF files online for free?',
        a: 'Drag and drop or select the PDF files you want to combine, arrange them in your preferred order, and click merge. The combined PDF is generated in your browser and ready to download instantly.',
      },
      {
        q: 'Is there a file size limit for merging PDFs?',
        a: 'Since processing happens in your browser, the limit depends on your device\'s available memory. Most devices can comfortably handle combined files up to 50-100 MB.',
      },
      {
        q: 'Are my PDF files uploaded to a server?',
        a: 'No. The entire merge process runs locally in your browser using JavaScript. Your files never leave your device, ensuring complete privacy.',
      },
    ],
  },

  'pdf-splitter': {
    longDescription:
      'Split a PDF into individual pages or custom page ranges with this free online PDF splitter. Extract specific pages from large documents without installing any software — everything runs securely in your browser with no signup needed.',
    keywords: [
      'pdf splitter',
      'split pdf online',
      'extract pages from pdf',
      'pdf page extractor',
      'split pdf free',
      'separate pdf pages',
      'pdf splitter online free',
    ],
    faqs: [
      {
        q: 'How do I split a PDF into separate pages online?',
        a: 'Upload your PDF, select the pages or page ranges you want to extract, and download the result. The tool processes everything in your browser — no server upload required.',
      },
      {
        q: 'Can I extract a specific range of pages from a PDF?',
        a: 'Yes. You can specify individual pages (e.g., 1, 3, 5) or ranges (e.g., 1-5, 10-15) to extract exactly the pages you need into a new PDF.',
      },
      {
        q: 'Is this PDF splitter really free?',
        a: 'Yes, it is completely free with no watermarks, no page limits, and no signup required. The tool runs entirely in your browser.',
      },
    ],
  },

  'pdf-to-text': {
    longDescription:
      'Extract text content from PDF files instantly with this free online PDF to text converter. Upload a PDF and get clean, copyable text — perfect for copying content from scanned documents or locked PDFs. Runs entirely in your browser with no signup required.',
    keywords: [
      'pdf to text',
      'extract text from pdf',
      'pdf to text converter online',
      'copy text from pdf',
      'pdf text extractor',
      'convert pdf to text free',
    ],
    faqs: [
      {
        q: 'How do I extract text from a PDF online?',
        a: 'Upload your PDF file and the tool will extract all readable text content instantly. You can then copy the text or download it as a plain text file.',
      },
      {
        q: 'Can this tool extract text from scanned PDFs?',
        a: 'This tool extracts embedded text from digital PDFs. For scanned PDFs that contain only images, an OCR (Optical Character Recognition) tool would be needed.',
      },
      {
        q: 'Is the extracted text formatting preserved?',
        a: 'The tool extracts raw text content. While paragraph structure is generally maintained, complex formatting like tables and columns may not be perfectly preserved.',
      },
    ],
  },

  'pdf-metadata-viewer': {
    longDescription:
      'View PDF metadata including author, creation date, page count, and more with this free online PDF metadata viewer. Quickly inspect any PDF\'s properties without installing software — all processing is done in your browser with no signup required.',
    keywords: [
      'pdf metadata viewer',
      'view pdf properties',
      'pdf info viewer',
      'pdf metadata reader',
      'check pdf details',
      'pdf properties online',
    ],
    faqs: [
      {
        q: 'How do I view the metadata of a PDF file?',
        a: 'Upload your PDF and the tool will instantly display all available metadata including title, author, subject, creation date, modification date, page count, and PDF version.',
      },
      {
        q: 'What kind of information is stored in PDF metadata?',
        a: 'PDF metadata can include the document title, author, subject, keywords, creation and modification dates, the software used to create it, page dimensions, and PDF version.',
      },
      {
        q: 'Is my PDF uploaded to a server?',
        a: 'No. The metadata is read entirely within your browser using client-side JavaScript. Your file stays on your device and is never uploaded anywhere.',
      },
    ],
  },

  // ── CAREER ──────────────────────────────────────────────────────────────
  'ats-keyword-checker': {
    longDescription:
      'Check if your resume contains the right keywords to pass Applicant Tracking Systems (ATS) with this free online ATS keyword checker. Paste your resume and the job description to see a match score and missing keywords — no signup required, fully browser-based.',
    keywords: [
      'ats keyword checker',
      'ats resume checker',
      'resume keyword scanner',
      'ats score checker free',
      'resume ats compatibility',
      'ats friendly resume checker',
      'resume keyword match',
    ],
    faqs: [
      {
        q: 'How do I check if my resume is ATS-friendly?',
        a: 'Paste your resume text and the target job description. The tool analyzes both and shows which keywords from the job posting are present or missing in your resume, along with a match percentage.',
      },
      {
        q: 'What is an ATS and why does it matter?',
        a: 'An Applicant Tracking System (ATS) is software that employers use to filter resumes before a human reviews them. If your resume lacks key terms from the job description, it may be automatically rejected.',
      },
      {
        q: 'How can I improve my ATS score?',
        a: 'Incorporate the missing keywords naturally into your resume, especially in your skills section, work experience bullet points, and summary. Avoid keyword stuffing — the language should still read naturally.',
      },
    ],
  },

  'resume-character-counter': {
    longDescription:
      'Count characters, words, and lines in your resume with this free online resume character counter. Ensure your resume fits within ATS and application form limits — ideal for job seekers optimizing every section. No signup required, runs in your browser.',
    keywords: [
      'resume character counter',
      'resume word count',
      'resume length checker',
      'character count for resume',
      'cv word counter',
      'resume size checker',
    ],
    faqs: [
      {
        q: 'How long should a resume be in characters?',
        a: 'Most single-page resumes contain 2,000-4,000 characters. Some online application forms have specific character limits per section (e.g., 500 characters for a summary), so always check the requirements.',
      },
      {
        q: 'How do I count characters in my resume?',
        a: 'Paste your resume text into the tool and it will instantly display the total character count (with and without spaces), word count, sentence count, and line count.',
      },
      {
        q: 'Why does resume character count matter?',
        a: 'Many job application portals and ATS systems impose character limits on text fields. Knowing your exact character count helps you stay within these limits without losing important content.',
      },
    ],
  },

  'cover-letter-filler-checker': {
    longDescription:
      'Identify and remove filler words, clichés, and weak phrases from your cover letter with this free online filler checker. Paste your text to get instant feedback on which words weaken your writing — no signup required, everything runs in your browser.',
    keywords: [
      'cover letter filler checker',
      'cover letter word checker',
      'filler words in cover letter',
      'cover letter improvement tool',
      'weak words checker',
      'cover letter analyzer',
    ],
    faqs: [
      {
        q: 'What are filler words in a cover letter?',
        a: 'Filler words are vague or overused terms like "very," "really," "hardworking," and "team player" that add length without adding value. Removing them makes your cover letter more concise and impactful.',
      },
      {
        q: 'How do I improve my cover letter wording?',
        a: 'Paste your cover letter into the tool to see highlighted filler words and clichés. Replace them with specific, action-oriented language that demonstrates your accomplishments and skills.',
      },
      {
        q: 'Does this tool check grammar too?',
        a: 'This tool focuses specifically on identifying filler words, clichés, and weak phrases. For full grammar checking, consider pairing it with a dedicated grammar tool.',
      },
    ],
  },

  'action-verb-suggester': {
    longDescription:
      'Find powerful action verbs for your resume and cover letter with this free online action verb suggester. Enter a job function or weak phrase and get strong, recruiter-approved alternatives that make your achievements stand out — no signup required.',
    keywords: [
      'action verbs for resume',
      'resume action words',
      'strong verbs for resume',
      'power words for resume',
      'action verb suggester',
      'resume verb list',
      'resume power verbs',
    ],
    faqs: [
      {
        q: 'What are good action verbs for a resume?',
        a: 'Strong action verbs like "spearheaded," "implemented," "optimized," and "delivered" convey impact and leadership. The best choice depends on your industry and the specific accomplishment you are describing.',
      },
      {
        q: 'Why should I use action verbs in my resume?',
        a: 'Action verbs create a strong first impression by showing what you accomplished rather than just listing responsibilities. Recruiters spend an average of 7 seconds scanning a resume, so impactful language matters.',
      },
      {
        q: 'How do I replace weak verbs in my resume?',
        a: 'Enter a generic phrase like "responsible for managing" and the tool suggests stronger alternatives such as "directed," "orchestrated," or "oversaw" that better convey your role and impact.',
      },
    ],
  },

  'job-application-tracker': {
    longDescription:
      'Track all your job applications in one place with this free online job application tracker. Log company names, roles, dates, statuses, and notes — all stored in your browser\'s local storage with no signup or account required. Stay organized during your job search.',
    keywords: [
      'job application tracker',
      'job search tracker',
      'application tracker online',
      'track job applications',
      'job application spreadsheet',
      'job tracker free',
      'job hunt organizer',
    ],
    faqs: [
      {
        q: 'How do I keep track of job applications?',
        a: 'Add each application with the company name, role, date applied, and status (applied, interviewing, offer, rejected). The tracker keeps everything organized in your browser so you never lose track of where you stand.',
      },
      {
        q: 'Is my job application data saved?',
        a: 'Yes, data is saved in your browser\'s local storage, so it persists between sessions on the same device. No data is sent to any server — your job search stays completely private.',
      },
      {
        q: 'Can I export my job application data?',
        a: 'Yes. You can export your tracked applications as a file for backup or to transfer to another device, ensuring you never lose your progress.',
      },
    ],
  },

  'cover-letter-generator': {
    longDescription:
      'Create professional, tailored cover letters in minutes with this free online cover letter generator. Enter your details and the job information to produce a polished cover letter ready for download in PDF or Word format — no signup required, fully browser-based.',
    keywords: [
      'cover letter generator',
      'cover letter maker',
      'free cover letter generator',
      'cover letter builder online',
      'generate cover letter',
      'cover letter template generator',
      'professional cover letter maker',
    ],
    faqs: [
      {
        q: 'How do I write a cover letter quickly?',
        a: 'Enter your name, the company and role you are applying for, and key qualifications. The generator creates a professional cover letter that you can customize, then download as PDF or Word.',
      },
      {
        q: 'Should a cover letter be different for every job?',
        a: 'Yes. Tailoring your cover letter to each role by mentioning the company name, specific job requirements, and relevant experience significantly increases your chances of getting an interview.',
      },
      {
        q: 'Can I download the cover letter as a PDF?',
        a: 'Yes. The tool lets you export your finished cover letter in both PDF and Word formats, ready to attach to your job application.',
      },
    ],
  },

  // ── TEXT ─────────────────────────────────────────────────────────────────
  'word-counter': {
    longDescription:
      'Count words, characters, sentences, and paragraphs instantly with this free online word counter. Perfect for writers, students, and professionals who need to meet specific length requirements — runs entirely in your browser with no signup needed.',
    keywords: [
      'word counter',
      'character counter',
      'word count online',
      'character count online',
      'text length counter',
      'word counter tool',
      'online word counter free',
    ],
    faqs: [
      {
        q: 'How do I count words in my text online?',
        a: 'Paste or type your text into the editor and the tool instantly displays the word count, character count (with and without spaces), sentence count, and estimated reading time.',
      },
      {
        q: 'Does this tool count characters with and without spaces?',
        a: 'Yes. The tool shows both counts simultaneously, which is useful when platforms have character limits that may or may not include spaces.',
      },
      {
        q: 'Can I use this for essay or assignment word limits?',
        a: 'Absolutely. The real-time word and character count makes it easy to write to a specific length requirement for essays, assignments, social media posts, or any content with a word limit.',
      },
    ],
  },

  'lorem-ipsum': {
    longDescription:
      'Generate placeholder Lorem Ipsum text in paragraphs, sentences, or words with this free online Lorem Ipsum generator. Perfect for designers and developers who need dummy text for mockups and layouts — no signup required, works instantly in your browser.',
    keywords: [
      'lorem ipsum generator',
      'dummy text generator',
      'placeholder text generator',
      'lorem ipsum online',
      'generate lorem ipsum',
      'filler text generator',
    ],
    faqs: [
      {
        q: 'What is Lorem Ipsum text?',
        a: 'Lorem Ipsum is dummy placeholder text used in design and publishing since the 1500s. It helps designers visualize how a layout will look with text content without being distracted by readable words.',
      },
      {
        q: 'How do I generate Lorem Ipsum text?',
        a: 'Select whether you want paragraphs, sentences, or words, specify the quantity, and click generate. The placeholder text is ready to copy and paste into your design or document.',
      },
      {
        q: 'Can I generate a specific number of words or paragraphs?',
        a: 'Yes. You can specify exactly how many paragraphs, sentences, or words you need, giving you precise control over the amount of placeholder text generated.',
      },
    ],
  },

  'markdown-previewer': {
    longDescription:
      'Write and preview Markdown in real time with this free online Markdown previewer. See your formatted output side by side as you type — ideal for drafting README files, documentation, and blog posts. No signup needed, runs entirely in your browser.',
    keywords: [
      'markdown previewer',
      'markdown editor online',
      'markdown preview',
      'markdown to html',
      'online markdown editor',
      'markdown renderer',
      'live markdown preview',
    ],
    faqs: [
      {
        q: 'How do I preview Markdown online?',
        a: 'Type or paste your Markdown text into the editor and the formatted preview updates in real time on the right side. You can see headings, lists, links, code blocks, and other formatting instantly.',
      },
      {
        q: 'What is Markdown used for?',
        a: 'Markdown is a lightweight markup language used for writing formatted text. It is widely used for GitHub README files, documentation, blog posts, and note-taking applications.',
      },
      {
        q: 'Does this support GitHub-flavored Markdown?',
        a: 'Yes. The previewer supports standard Markdown syntax including tables, task lists, code blocks with syntax highlighting, and other GitHub-flavored Markdown extensions.',
      },
    ],
  },

  'case-converter': {
    longDescription:
      'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, and more with this free online case converter. Instantly transform your text formatting without retyping — no signup required, works entirely in your browser.',
    keywords: [
      'case converter',
      'text case converter',
      'uppercase converter',
      'lowercase converter',
      'title case converter',
      'change text case online',
      'text transform tool',
    ],
    faqs: [
      {
        q: 'How do I convert text to uppercase online?',
        a: 'Paste your text into the editor and click the "UPPERCASE" button. The entire text will be converted instantly. You can also choose lowercase, title case, sentence case, or other formats.',
      },
      {
        q: 'What text cases are supported?',
        a: 'The tool supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and toggled case conversions.',
      },
      {
        q: 'Can I convert programming variable names between cases?',
        a: 'Yes. The tool can convert between camelCase, PascalCase, snake_case, and kebab-case, making it useful for developers who need to transform variable or function names between naming conventions.',
      },
    ],
  },

  'diff-checker': {
    longDescription:
      'Compare two blocks of text side by side and see the differences highlighted with this free online diff checker. Identify additions, deletions, and changes instantly — perfect for comparing code, documents, or any text. No signup required, fully browser-based.',
    keywords: [
      'diff checker',
      'text compare',
      'compare two texts online',
      'diff tool online',
      'text difference checker',
      'online diff',
      'code diff checker',
    ],
    faqs: [
      {
        q: 'How do I compare two texts online?',
        a: 'Paste the original text on the left and the modified text on the right. The tool highlights additions in green, deletions in red, and modifications so you can spot every difference at a glance.',
      },
      {
        q: 'Can I use this to compare code?',
        a: 'Yes. The diff checker works with any plain text including source code. It highlights line-by-line differences, making it useful for code reviews and comparing file versions.',
      },
      {
        q: 'Is this similar to the Unix diff command?',
        a: 'Yes, it performs the same function as the Unix diff command but with a visual, color-coded interface that makes differences much easier to spot and understand.',
      },
    ],
  },

  'filler-word-remover': {
    longDescription:
      'Detect and remove filler words from your writing with this free online filler word remover. Clean up essays, emails, and professional documents by identifying words like "very," "really," "just," and other weak modifiers — no signup required, runs in your browser.',
    keywords: [
      'filler word remover',
      'remove filler words',
      'filler word checker',
      'writing cleaner tool',
      'remove weak words',
      'concise writing tool',
      'filler words detector',
    ],
    faqs: [
      {
        q: 'What are filler words in writing?',
        a: 'Filler words are unnecessary words that pad your writing without adding meaning — examples include "very," "really," "just," "actually," "basically," and "literally." Removing them makes your writing tighter and more impactful.',
      },
      {
        q: 'How does the filler word remover work?',
        a: 'Paste your text and the tool scans it for common filler words and weak modifiers. Each filler word is highlighted so you can review and decide which to remove or rephrase.',
      },
      {
        q: 'Should I remove all filler words?',
        a: 'Not necessarily. Some filler words serve a purpose in casual or conversational writing. The tool highlights them so you can make an informed decision about which ones weaken your text and which ones are intentional.',
      },
    ],
  },

  // ── FINANCE (India-focused) ────────────────────────────────────────────
  'emi-calculator': {
    longDescription:
      'Calculate your monthly EMI for home loans, car loans, and personal loans with this free online EMI calculator. Enter the loan amount, interest rate, and tenure to see your monthly payment, total interest, and amortization schedule — designed for Indian borrowers. No signup required.',
    keywords: [
      'emi calculator',
      'emi calculator online',
      'home loan emi calculator',
      'car loan emi calculator',
      'personal loan emi calculator',
      'loan emi calculator India',
      'monthly emi calculator',
    ],
    faqs: [
      {
        q: 'How is EMI calculated?',
        a: 'EMI is calculated using the formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the principal amount, r is the monthly interest rate, and n is the total number of months. This tool does the math for you instantly.',
      },
      {
        q: 'What is a good EMI-to-income ratio?',
        a: 'Financial experts recommend that your total EMIs should not exceed 40-50% of your monthly income. Keeping EMIs below this threshold ensures comfortable repayment and healthy finances.',
      },
      {
        q: 'Can I see the full amortization schedule?',
        a: 'Yes. The calculator shows a month-by-month breakdown of principal and interest components, so you can see exactly how your loan balance reduces over time.',
      },
    ],
  },

  'income-tax-calculator': {
    longDescription:
      'Calculate your Indian income tax under both the Old and New tax regimes with this free online income tax calculator. Enter your salary, deductions, and exemptions to compare tax liability side by side — perfect for salaried employees planning their taxes. No signup required.',
    keywords: [
      'income tax calculator India',
      'income tax calculator old vs new regime',
      'tax calculator India',
      'salary tax calculator',
      'income tax calculator 2024-25',
      'new regime tax calculator',
      'old regime tax calculator India',
    ],
    faqs: [
      {
        q: 'Which is better — old or new tax regime in India?',
        a: 'It depends on your deductions. If you claim significant deductions under 80C, 80D, HRA, etc., the old regime may save more tax. If you have fewer deductions, the new regime with lower slab rates is often better. This calculator compares both.',
      },
      {
        q: 'How do I calculate income tax on my salary?',
        a: 'Enter your annual gross salary, exemptions (HRA, LTA), and deductions (80C, 80D, home loan interest). The tool calculates your taxable income and tax liability under both old and new regimes.',
      },
      {
        q: 'What are the income tax slabs for the new regime?',
        a: 'The new tax regime features revised slabs with lower rates but fewer deductions. The calculator uses the latest applicable slab rates to compute your tax accurately.',
      },
    ],
  },

  'sip-calculator': {
    longDescription:
      'Calculate your SIP (Systematic Investment Plan) returns and see how your monthly investments grow over time with this free online SIP calculator. Estimate the future value of your mutual fund investments based on amount, duration, and expected returns — designed for Indian investors. No signup needed.',
    keywords: [
      'sip calculator',
      'sip returns calculator',
      'mutual fund sip calculator',
      'sip calculator online',
      'sip investment calculator',
      'monthly sip calculator India',
      'sip maturity calculator',
    ],
    faqs: [
      {
        q: 'How much will my SIP be worth in 10 years?',
        a: 'Enter your monthly SIP amount, expected annual return rate, and investment duration. The calculator uses the compound interest formula to show your estimated corpus, total invested amount, and wealth gained.',
      },
      {
        q: 'What is a good SIP amount to invest monthly?',
        a: 'Financial advisors typically recommend investing at least 15-20% of your monthly income through SIPs. Even small amounts like Rs 500-1000 per month can grow significantly over 10-20 years due to compounding.',
      },
      {
        q: 'What return rate should I assume for SIP calculations?',
        a: 'Historically, Indian equity mutual funds have delivered 10-12% annual returns over long periods. For conservative estimates, use 10% for equity and 7-8% for debt fund SIPs.',
      },
    ],
  },

  'gst-calculator': {
    longDescription:
      'Calculate GST (Goods and Services Tax) amounts and inclusive/exclusive prices with this free online GST calculator. Supports all Indian GST slab rates (5%, 12%, 18%, 28%) — perfect for businesses, freelancers, and consumers. No signup required, runs in your browser.',
    keywords: [
      'gst calculator',
      'gst calculator online',
      'gst calculator India',
      'calculate gst amount',
      'gst inclusive exclusive calculator',
      'igst sgst cgst calculator',
      'gst rate calculator',
    ],
    faqs: [
      {
        q: 'How do I calculate GST on a price?',
        a: 'Enter the amount and select the GST rate (5%, 12%, 18%, or 28%). The tool shows the GST amount, CGST/SGST split, and the final inclusive or exclusive price instantly.',
      },
      {
        q: 'What is the difference between CGST, SGST, and IGST?',
        a: 'For transactions within a state, GST is split equally into CGST (Central) and SGST (State). For inter-state transactions, IGST (Integrated GST) is charged at the full rate.',
      },
      {
        q: 'How do I calculate the original price from a GST-inclusive amount?',
        a: 'Select "GST Inclusive" mode, enter the total amount, and choose the GST rate. The calculator will reverse-calculate the base price and the GST component.',
      },
    ],
  },

  'hra-calculator': {
    longDescription:
      'Calculate your HRA (House Rent Allowance) tax exemption under Section 10(13A) with this free online HRA calculator. Enter your salary details and rent to see the maximum exemption you can claim — essential for Indian salaried employees filing taxes. No signup needed.',
    keywords: [
      'hra calculator',
      'hra exemption calculator',
      'hra tax exemption calculator',
      'house rent allowance calculator',
      'hra calculator India',
      'hra exemption calculation online',
      'section 10 13a calculator',
    ],
    faqs: [
      {
        q: 'How is HRA exemption calculated?',
        a: 'HRA exemption is the minimum of three values: actual HRA received, rent paid minus 10% of basic salary, or 50% of basic salary (metro) / 40% (non-metro). This calculator computes all three and shows your maximum exemption.',
      },
      {
        q: 'Can I claim HRA if I live in my own house?',
        a: 'No. HRA exemption requires you to be paying rent for your accommodation. If you live in your own house, you cannot claim HRA exemption but may claim home loan interest deductions instead.',
      },
      {
        q: 'Is HRA exemption available under the new tax regime?',
        a: 'No. HRA exemption under Section 10(13A) is available only under the old tax regime. If you opt for the new regime, you cannot claim this exemption.',
      },
    ],
  },

  'gratuity-calculator': {
    longDescription:
      'Calculate your gratuity amount based on your salary and years of service with this free online gratuity calculator. Follows the Payment of Gratuity Act, 1972 applicable in India — perfect for employees planning their retirement or exit. No signup required.',
    keywords: [
      'gratuity calculator',
      'gratuity calculator India',
      'gratuity calculation formula',
      'gratuity amount calculator',
      'gratuity calculator online',
      'how to calculate gratuity',
      'gratuity eligibility calculator',
    ],
    faqs: [
      {
        q: 'How is gratuity calculated in India?',
        a: 'Gratuity is calculated as: (Last drawn basic salary + DA) × 15/26 × number of years of service. The tool computes this automatically based on your inputs.',
      },
      {
        q: 'Am I eligible for gratuity?',
        a: 'Under the Payment of Gratuity Act, you are eligible after completing 5 or more years of continuous service with the same employer. In case of death or disability, the 5-year requirement is waived.',
      },
      {
        q: 'Is gratuity taxable in India?',
        a: 'Gratuity is tax-exempt up to Rs 20 lakh for employees covered under the Act. For government employees, the entire gratuity is tax-free. Any amount exceeding the limit is taxed as per your income tax slab.',
      },
    ],
  },

  'salary-hike-calculator': {
    longDescription:
      'Calculate your new salary after a hike and see the percentage increase with this free online salary hike calculator. Compare old and new CTC, monthly take-home, and percentage change — ideal for Indian professionals evaluating job offers or appraisals. No signup required.',
    keywords: [
      'salary hike calculator',
      'salary increase calculator',
      'percentage hike calculator',
      'salary hike percentage calculator',
      'pay raise calculator',
      'salary increment calculator India',
      'appraisal hike calculator',
    ],
    faqs: [
      {
        q: 'How do I calculate my salary hike percentage?',
        a: 'Enter your current salary and new salary (or hike percentage). The tool calculates the exact percentage increase, the absolute increment amount, and your new monthly and annual figures.',
      },
      {
        q: 'What is a good salary hike percentage in India?',
        a: 'A typical annual appraisal hike in India ranges from 8-15%. When switching jobs, professionals often negotiate 30-50% or more depending on the role, industry, and experience level.',
      },
      {
        q: 'Should I compare CTC or in-hand salary when evaluating a hike?',
        a: 'Always compare both. A higher CTC does not always mean higher take-home pay, as the increase might go into PF, gratuity, or variable pay. Use the CTC breakup calculator alongside this tool for a complete picture.',
      },
    ],
  },

  'fd-rd-calculator': {
    longDescription:
      'Calculate maturity amounts for Fixed Deposits (FD) and Recurring Deposits (RD) with this free online FD & RD calculator. Compare interest earned across different tenures and rates — tailored for Indian bank deposit rates. No signup required, runs entirely in your browser.',
    keywords: [
      'fd calculator',
      'rd calculator',
      'fixed deposit calculator',
      'recurring deposit calculator',
      'fd interest calculator',
      'fd maturity calculator India',
      'rd maturity calculator online',
    ],
    faqs: [
      {
        q: 'How is FD interest calculated?',
        a: 'FD interest is calculated using compound interest, typically compounded quarterly in Indian banks. Enter your deposit amount, interest rate, and tenure to see the maturity amount and total interest earned.',
      },
      {
        q: 'What is the difference between FD and RD?',
        a: 'A Fixed Deposit (FD) is a lump sum invested once, while a Recurring Deposit (RD) involves monthly installments. Both earn compound interest, but RD is ideal for those who want to save a fixed amount every month.',
      },
      {
        q: 'Is FD interest taxable in India?',
        a: 'Yes. FD interest is fully taxable as per your income tax slab. Banks deduct TDS at 10% if annual interest exceeds Rs 40,000 (Rs 50,000 for senior citizens).',
      },
    ],
  },

  // ── IMAGE ───────────────────────────────────────────────────────────────
  'image-compressor': {
    longDescription:
      'Compress images to reduce file size without losing visible quality with this free online image compressor. Supports JPEG, PNG, and WebP — perfect for optimizing images for websites, emails, and social media. No signup required, all processing happens in your browser.',
    keywords: [
      'image compressor',
      'compress image online',
      'reduce image size',
      'image compressor online free',
      'compress jpg png online',
      'image file size reducer',
      'compress photo online',
    ],
    faqs: [
      {
        q: 'How do I compress an image online for free?',
        a: 'Upload your image (JPEG, PNG, or WebP), adjust the quality slider to your preference, and download the compressed version. The tool shows you the file size reduction in real time.',
      },
      {
        q: 'Will compressing my image reduce its quality?',
        a: 'The tool uses smart compression algorithms that significantly reduce file size while keeping visual quality nearly identical. You can adjust the quality level to find the right balance for your needs.',
      },
      {
        q: 'Is my image uploaded to a server?',
        a: 'No. All compression happens locally in your browser using client-side JavaScript. Your images are never uploaded to any server, ensuring complete privacy.',
      },
    ],
  },

  'image-resizer': {
    longDescription:
      'Resize images to exact dimensions or by percentage with this free online image resizer. Maintain aspect ratio or set custom width and height — ideal for social media, website thumbnails, or print. No signup required, everything runs in your browser.',
    keywords: [
      'image resizer',
      'resize image online',
      'image resizer online free',
      'resize photo online',
      'change image dimensions',
      'resize image to specific size',
      'image size changer',
    ],
    faqs: [
      {
        q: 'How do I resize an image online?',
        a: 'Upload your image, enter the desired width and height (or a percentage), and download the resized version. You can lock the aspect ratio to prevent distortion.',
      },
      {
        q: 'Can I resize images for social media?',
        a: 'Yes. You can enter exact pixel dimensions required by platforms like Instagram (1080x1080), Facebook (1200x630), Twitter (1600x900), or LinkedIn (1200x627) to get perfectly sized images.',
      },
      {
        q: 'Does resizing affect image quality?',
        a: 'Enlarging an image beyond its original dimensions may reduce sharpness. Reducing size generally maintains quality. The tool uses browser-native algorithms for the best results.',
      },
    ],
  },

  'image-to-base64': {
    longDescription:
      'Convert images to Base64-encoded strings with this free online image to Base64 converter. Generate data URIs for embedding images directly in HTML, CSS, or JSON — perfect for developers. No signup required, all processing happens in your browser.',
    keywords: [
      'image to base64',
      'image to base64 converter',
      'convert image to base64 online',
      'image to data uri',
      'base64 encode image',
      'image base64 string generator',
    ],
    faqs: [
      {
        q: 'How do I convert an image to Base64?',
        a: 'Upload your image and the tool instantly generates the Base64-encoded string and a ready-to-use data URI. Copy the output and embed it directly in your HTML, CSS, or JavaScript code.',
      },
      {
        q: 'Why would I convert an image to Base64?',
        a: 'Base64-encoded images can be embedded directly in HTML or CSS, eliminating an extra HTTP request. This is useful for small icons, logos, or images in emails where external links may be blocked.',
      },
      {
        q: 'Does Base64 encoding increase image file size?',
        a: 'Yes. Base64 encoding increases the data size by approximately 33%. It is best used for small images (under 10 KB) where the overhead is negligible compared to the saved HTTP request.',
      },
    ],
  },

  'image-converter': {
    longDescription:
      'Convert images between formats like JPEG, PNG, WebP, and more with this free online image converter. Change file formats instantly without installing any software — all conversion happens in your browser with no signup required.',
    keywords: [
      'image converter',
      'convert image format online',
      'png to jpg converter',
      'jpg to png converter',
      'image format converter',
      'webp converter online',
      'image converter online free',
    ],
    faqs: [
      {
        q: 'How do I convert an image to a different format?',
        a: 'Upload your image, select the desired output format (JPEG, PNG, WebP, etc.), and download the converted file. The conversion happens instantly in your browser.',
      },
      {
        q: 'Which image format should I use?',
        a: 'Use JPEG for photographs (smaller file size), PNG for images that need transparency, and WebP for the best balance of quality and size on the web. SVG is best for logos and icons.',
      },
      {
        q: 'Can I convert WebP images to JPEG or PNG?',
        a: 'Yes. The tool supports conversion between all common web image formats including WebP to JPEG, WebP to PNG, and vice versa.',
      },
    ],
  },

  'image-color-picker': {
    longDescription:
      'Pick colors from any image and get HEX, RGB, and HSL values with this free online image color picker. Upload an image and click anywhere to extract exact color codes — ideal for designers and developers. No signup required, runs in your browser.',
    keywords: [
      'image color picker',
      'color picker from image',
      'pick color from image online',
      'image color code extractor',
      'eyedropper tool online',
      'get color from image',
      'hex color from image',
    ],
    faqs: [
      {
        q: 'How do I get the color code from an image?',
        a: 'Upload your image and click on any pixel. The tool displays the exact color in HEX, RGB, and HSL formats, ready to copy and use in your design or code.',
      },
      {
        q: 'What color formats are supported?',
        a: 'The color picker provides values in HEX (#RRGGBB), RGB (Red, Green, Blue), and HSL (Hue, Saturation, Lightness) formats — covering all common use cases in web design and development.',
      },
      {
        q: 'Can I pick multiple colors from the same image?',
        a: 'Yes. Click on different areas of the image to extract as many colors as you need. This is great for building a color palette from a photograph or design mockup.',
      },
    ],
  },

  'image-metadata-viewer': {
    longDescription:
      'View EXIF and metadata from any image with this free online image metadata viewer. See camera settings, GPS location, date taken, resolution, and more — all read in your browser with no upload to any server. No signup required.',
    keywords: [
      'image metadata viewer',
      'exif data viewer',
      'photo metadata viewer',
      'image exif reader',
      'view image properties online',
      'photo exif data online',
      'image info viewer',
    ],
    faqs: [
      {
        q: 'How do I view the metadata of an image?',
        a: 'Upload your image and the tool instantly reads and displays all available metadata including camera model, exposure settings, ISO, GPS coordinates, date taken, and file details.',
      },
      {
        q: 'What is EXIF data in a photo?',
        a: 'EXIF (Exchangeable Image File Format) data is information embedded in photos by cameras and smartphones. It includes camera settings, date/time, GPS location, and technical details about how the image was captured.',
      },
      {
        q: 'Is my image uploaded to a server?',
        a: 'No. The metadata is read entirely in your browser. Your image never leaves your device, so your photos and any embedded location data remain completely private.',
      },
    ],
  },

  // ── SEO ─────────────────────────────────────────────────────────────────
  'meta-tag-generator': {
    longDescription:
      'Generate optimized HTML meta tags for your web pages with this free online meta tag generator. Create title, description, Open Graph, and Twitter Card tags in seconds — essential for improving your site\'s SEO and social sharing. No signup required.',
    keywords: [
      'meta tag generator',
      'html meta tag generator',
      'seo meta tags generator',
      'meta description generator',
      'og meta tag generator',
      'twitter card generator',
      'website meta tags',
    ],
    faqs: [
      {
        q: 'What are meta tags and why are they important for SEO?',
        a: 'Meta tags are HTML elements that provide information about a web page to search engines and social platforms. The title and description tags directly influence how your page appears in search results and can significantly impact click-through rates.',
      },
      {
        q: 'How do I generate meta tags for my website?',
        a: 'Enter your page title, description, keywords, and social media image URL. The tool generates all the HTML meta tags you need, including Open Graph and Twitter Card tags, ready to paste into your page\'s <head> section.',
      },
      {
        q: 'What is the ideal length for a meta description?',
        a: 'Keep meta descriptions between 150-160 characters. Google typically truncates descriptions longer than 160 characters in search results, so the most important information should come first.',
      },
    ],
  },

  'title-tag-checker': {
    longDescription:
      'Check and optimize your page title tags for SEO with this free online title tag checker. See character count, pixel width preview, and get suggestions for improvement — ensure your titles display correctly in search results. No signup required.',
    keywords: [
      'title tag checker',
      'seo title checker',
      'title tag length checker',
      'page title optimizer',
      'title tag preview',
      'seo title length',
      'google title tag checker',
    ],
    faqs: [
      {
        q: 'How long should a title tag be for SEO?',
        a: 'Google displays roughly 50-60 characters of a title tag (or about 580 pixels wide). Keeping your title within this range ensures it is not truncated in search results.',
      },
      {
        q: 'How do I check if my title tag is too long?',
        a: 'Enter your title tag text and the tool shows the character count, estimated pixel width, and a preview of how it will appear in Google search results. It flags titles that are too long or too short.',
      },
      {
        q: 'What makes a good SEO title tag?',
        a: 'A good title tag includes your primary keyword near the beginning, is under 60 characters, accurately describes the page content, and is compelling enough to encourage clicks from search results.',
      },
    ],
  },

  'og-preview': {
    longDescription:
      'Preview how your web page will look when shared on social media with this free online Open Graph preview tool. See Facebook, Twitter, and LinkedIn card previews by entering your URL or OG meta tags — essential for social media marketing. No signup required.',
    keywords: [
      'open graph preview',
      'og tag preview',
      'social media preview tool',
      'facebook share preview',
      'twitter card preview',
      'linkedin post preview',
      'og meta tag tester',
    ],
    faqs: [
      {
        q: 'How do I preview my Open Graph tags?',
        a: 'Enter your OG title, description, image URL, and page URL. The tool generates real-time previews showing exactly how your page will appear when shared on Facebook, Twitter, and LinkedIn.',
      },
      {
        q: 'What are Open Graph tags?',
        a: 'Open Graph tags are HTML meta tags that control how your page appears when shared on social media platforms. They define the title, description, and image that appear in the share card.',
      },
      {
        q: 'Why does my shared link look wrong on social media?',
        a: 'Missing or incorrect Open Graph tags cause social platforms to guess your content, often showing the wrong image or description. Use this tool to verify your OG tags are set correctly before sharing.',
      },
    ],
  },

  'robots-txt-generator': {
    longDescription:
      'Generate a properly formatted robots.txt file for your website with this free online robots.txt generator. Control which pages search engines can crawl and index — essential for SEO management. No signup required, runs in your browser.',
    keywords: [
      'robots txt generator',
      'robots.txt generator',
      'create robots txt file',
      'robots txt maker',
      'robots txt creator online',
      'seo robots txt',
      'robots txt editor',
    ],
    faqs: [
      {
        q: 'What is a robots.txt file?',
        a: 'A robots.txt file tells search engine crawlers which pages or sections of your website they can or cannot access. It is placed in the root directory of your site and is one of the first files crawlers check.',
      },
      {
        q: 'How do I create a robots.txt file?',
        a: 'Select the user agents (Googlebot, Bingbot, etc.), specify which paths to allow or disallow, add your sitemap URL, and the tool generates a properly formatted robots.txt file ready to upload to your server.',
      },
      {
        q: 'Can robots.txt block pages from appearing in Google?',
        a: 'Robots.txt prevents crawling, but blocked pages can still appear in search results if other pages link to them. To fully remove a page from search results, use a "noindex" meta tag instead.',
      },
    ],
  },

  'keyword-density-checker': {
    longDescription:
      'Analyze the keyword density of any text or web page with this free online keyword density checker. See which words and phrases appear most frequently and at what percentage — essential for on-page SEO optimization. No signup required, fully browser-based.',
    keywords: [
      'keyword density checker',
      'keyword density analyzer',
      'keyword density tool',
      'check keyword density online',
      'seo keyword density',
      'word frequency counter',
      'keyword density calculator',
    ],
    faqs: [
      {
        q: 'What is keyword density and why does it matter?',
        a: 'Keyword density is the percentage of times a keyword appears relative to the total word count on a page. It helps ensure you are using target keywords enough to signal relevance to search engines without over-optimizing.',
      },
      {
        q: 'What is the ideal keyword density for SEO?',
        a: 'There is no fixed ideal, but most SEO experts recommend a keyword density of 1-2% for primary keywords. More important than density is natural, reader-friendly usage throughout the content.',
      },
      {
        q: 'How do I check the keyword density of my content?',
        a: 'Paste your text into the tool and it analyzes every word and phrase, showing you the frequency and density percentage for single words (unigrams), two-word phrases (bigrams), and three-word phrases (trigrams).',
      },
    ],
  },

  'invoice-generator': {
    longDescription:
      'Create professional GST invoices online for free with QuickKit\'s Invoice Generator. Add your business details, client information, and line items — the tool auto-calculates subtotals, CGST, SGST, and IGST, then generates a polished PDF invoice ready to send. No signup required, works entirely in your browser.',
    keywords: [
      'invoice generator free',
      'gst invoice generator online',
      'free invoice maker india',
      'online invoice generator',
      'create invoice online free',
      'gst bill generator',
      'professional invoice maker',
      'invoice pdf generator india',
    ],
    faqs: [
      {
        q: 'How do I create a GST invoice online for free?',
        a: 'Fill in your business details, client info, and line items. Select the GST rate (0%, 5%, 12%, 18%, or 28%) and choose CGST+SGST or IGST. The tool calculates all amounts automatically and lets you download a professional PDF invoice.',
      },
      {
        q: 'Can I download the invoice as a PDF?',
        a: 'Yes. Click the "Download PDF" button to generate and download a professional invoice as a PDF file. The PDF includes your business header, client details, itemised table, and GST breakdown.',
      },
      {
        q: 'What is the difference between CGST+SGST and IGST?',
        a: 'CGST and SGST apply to intra-state (within the same state) transactions, where GST is split equally between Central and State. IGST applies to inter-state transactions. Toggle between the two in the tax section based on your transaction.',
      },
      {
        q: 'Is my invoice data stored anywhere?',
        a: 'No. All processing happens locally in your browser. Your business and client details are never sent to any server, ensuring complete privacy.',
      },
    ],
  },

  'tax-saving-optimizer': {
    longDescription:
      'Discover exactly how much tax you can save under Section 80C, 80D, and NPS with QuickKit\'s Tax Saving Optimizer for FY 2024-25. Enter your income and existing investments to get a full deductions breakdown, estimated tax payable, and personalised recommendations — for both Old and New regimes. Free, no signup, runs in your browser.',
    keywords: [
      'tax saving calculator india',
      '80c tax saving calculator',
      'income tax saving tips india',
      'tax deduction calculator india',
      'how to save tax india',
      'tax saving investments 2024-25',
      '80d tax saving calculator',
      'old vs new regime tax calculator',
    ],
    faqs: [
      {
        q: 'How much can I save under Section 80C?',
        a: 'Section 80C allows a maximum deduction of ₹1,50,000 per year. Eligible investments include EPF, PPF, ELSS, LIC premiums, NSC, home loan principal repayment, and more. This tool shows how much of the ₹1,50,000 limit you have already used and how much room is left.',
      },
      {
        q: 'What is the extra NPS deduction under Section 80CCD(1B)?',
        a: 'Section 80CCD(1B) allows an additional deduction of up to ₹50,000 for contributions made to the National Pension System (NPS), over and above the ₹1,50,000 limit under 80C. This is available only under the old regime.',
      },
      {
        q: 'Which is better — old regime or new regime in FY 2024-25?',
        a: 'The new regime offers lower slab rates and a ₹75,000 standard deduction but does not allow 80C, 80D, or HRA deductions. The old regime is better if your total deductions exceed roughly ₹3-4 lakh. Use the regime toggle in this tool to compare both.',
      },
      {
        q: 'Is the tax calculation here accurate?',
        a: 'The tool uses official FY 2024-25 slab rates, standard deduction amounts, and section limits for a close estimate. It includes the 4% health & education cess and Section 87A rebate. For filing returns, always verify with a CA or the Income Tax portal.',
      },
    ],
  },

  'qr-code-generator': {
    longDescription:
      'Generate QR codes for any URL, text, or contact information instantly with QuickKit\'s free QR Code Generator. Customise foreground and background colours, choose your error correction level, and download the result as a high-quality PNG — no watermark, no signup, no server upload.',
    keywords: [
      'qr code generator free',
      'qr code maker online',
      'generate qr code for url',
      'qr code generator no signup',
      'free qr code maker',
      'custom qr code generator',
      'qr code download png',
      'online qr code creator',
    ],
    faqs: [
      {
        q: 'How do I generate a QR code for a URL?',
        a: 'Paste your URL into the text field and a QR code is generated instantly. Click "Download PNG" to save it. The QR code can be scanned with any smartphone camera.',
      },
      {
        q: 'Can I customise the colours of my QR code?',
        a: 'Yes. Use the foreground and background colour pickers to choose any colour combination. For best scannability, keep high contrast between the two — dark foreground on a light background.',
      },
      {
        q: 'What does error correction level mean?',
        a: 'Error correction allows a QR code to be scanned even if part of it is damaged or obscured. Level L recovers 7% data loss, M = 15%, Q = 25%, H = 30%. Use a higher level if you plan to print the QR code on surfaces that might get dirty or worn.',
      },
      {
        q: 'Is there a character limit for QR codes?',
        a: 'QR codes can technically store up to 4,296 alphanumeric characters, but codes with more than 500-1000 characters become very dense and harder to scan reliably. The tool warns you at 2000 characters.',
      },
    ],
  },

  'resume-builder': {
    longDescription: 'Build a professional resume online for free with QuickKit\'s Resume Builder. Add your contact info, work experience, education, and skills — see a live preview as you type and download as a clean PDF. No signup required, everything runs in your browser.',
    keywords: [
      'resume builder free',
      'resume builder online',
      'free resume maker',
      'resume creator',
      'cv builder online free',
      'professional resume builder',
      'resume builder no signup',
      'resume builder india',
    ],
    faqs: [
      { q: 'Is this resume builder completely free?', a: 'Yes. QuickKit\'s Resume Builder is 100% free — no signup, no subscription, no watermark on your PDF. Everything runs in your browser.' },
      { q: 'Can I download my resume as a PDF?', a: 'Yes. Click "Download PDF" to get a clean, ATS-friendly PDF of your resume. The PDF is generated locally in your browser so your data never leaves your device.' },
      { q: 'Is my resume data saved?', a: 'Your data is only in memory while you\'re on the page. We recommend downloading your PDF or copying your content before leaving. Nothing is stored on any server.' },
      { q: 'What should I write in my resume summary?', a: 'A good summary is 2-4 sentences covering your years of experience, key skills, and what makes you a strong candidate. Keep it specific and tailored to the role you\'re applying for.' },
    ],
  },

  // ── TEXT ──────────────────────────────────────────────────────────────────
  'readability-checker': {
    longDescription:
      'Analyse how readable your text is with this free online Readability Score Checker. Paste any article, essay, email, or document to instantly get Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, and Automated Readability Index scores — all calculated in your browser with no signup required. Ideal for writers, bloggers, content marketers, and students.',
    keywords: [
      'readability score checker',
      'flesch kincaid calculator online',
      'text readability analyzer free',
      'gunning fog index calculator',
      'flesch reading ease score',
      'readability test online',
      'automated readability index',
      'check reading level of text',
    ],
    faqs: [
      {
        q: 'What is the Flesch Reading Ease score?',
        a: 'The Flesch Reading Ease score rates text on a scale from 0 to 100 — the higher the score, the easier the text is to read. A score of 60–70 is considered standard (7th–8th grade level), while scores above 90 are very easy and below 30 are considered very difficult. It is calculated using average sentence length and average number of syllables per word.',
      },
      {
        q: 'What is the Flesch-Kincaid Grade Level?',
        a: 'The Flesch-Kincaid Grade Level translates the readability of text into a US school grade level. For example, a score of 8.0 means the text is appropriate for an 8th-grade student. Most general-audience web content aims for a grade level of 6–8.',
      },
      {
        q: 'What is the Gunning Fog Index?',
        a: 'The Gunning Fog Index estimates the years of formal education needed to understand a piece of writing on first reading. It penalises long sentences and complex words (three or more syllables). A score of 12 corresponds to high school level; below 8 is ideal for most audiences.',
      },
      {
        q: 'How is reading time calculated?',
        a: 'Reading time is estimated at 200 words per minute, which is an average silent reading speed for adults. For example, a 1,000-word article would have an estimated reading time of 5 minutes.',
      },
    ],
  },

  // ── SEO ──────────────────────────────────────────────────────────────────
  'schema-markup-generator': {
    longDescription:
      'Generate valid JSON-LD structured data markup for your website with this free Schema Markup Generator. Choose from Article, FAQ, HowTo, LocalBusiness, Product, Person, and BreadcrumbList schema types — fill in the form and get ready-to-paste JSON-LD script tags instantly. No signup, no installation, runs entirely in your browser.',
    keywords: [
      'schema markup generator free',
      'json-ld generator online',
      'structured data generator',
      'faq schema generator',
      'article schema markup',
      'local business schema generator',
      'product schema markup generator',
      'schema.org generator',
    ],
    faqs: [
      {
        q: 'What is schema markup and why does it matter for SEO?',
        a: 'Schema markup (also called structured data) is code you add to your website to help search engines understand your content better. It can enable rich results in Google Search — such as star ratings, FAQ dropdowns, and breadcrumbs — which can increase click-through rates significantly.',
      },
      {
        q: 'What is JSON-LD and how do I add it to my website?',
        a: 'JSON-LD (JavaScript Object Notation for Linked Data) is Google\'s recommended format for structured data. You add it by pasting a <script type="application/ld+json"> block inside the <head> section of your HTML page. Use the "Copy Script Tag" button to get the complete tag ready to paste.',
      },
      {
        q: 'Which schema type should I use for my FAQ page?',
        a: 'Use the FAQPage schema type. Add your questions and answers in the form — Google may display them as expandable FAQ snippets directly in search results, which can dramatically improve visibility without requiring a click to your site.',
      },
      {
        q: 'Can I validate the generated schema markup?',
        a: 'Yes. After copying the generated JSON-LD, you can paste it into Google\'s Rich Results Test (search.google.com/test/rich-results) or Schema.org Validator to check for errors and preview how it might appear in search results.',
      },
    ],
  },

  'privacy-policy-generator': {
    longDescription:
      'Generate a free, comprehensive privacy policy for your website or app in seconds with QuickKit\'s Privacy Policy Generator. Enter your site details, select what data you collect (analytics, payments, newsletter, etc.), choose your country for GDPR, CCPA, or India DPDP compliance — and get a ready-to-use policy you can copy or download as a .txt file. No signup required.',
    keywords: [
      'privacy policy generator free',
      'free privacy policy for website',
      'privacy policy template',
      'gdpr privacy policy generator',
      'privacy policy generator india',
      'website privacy policy creator',
      'free privacy policy maker',
      'privacy policy generator no signup',
    ],
    faqs: [
      {
        q: 'Do I really need a privacy policy for my website?',
        a: 'Yes. If your website collects any personal data — even just IP addresses via server logs or analytics — most privacy laws (GDPR, CCPA, India\'s DPDP Act) require you to have a privacy policy. Using Google Analytics or AdSense also requires one per Google\'s own terms of service.',
      },
      {
        q: 'Is the generated privacy policy legally binding?',
        a: 'The generated policy is a solid starting template based on common legal requirements, but it is not a substitute for professional legal advice. Requirements vary by country, industry, and the specific data you collect. We strongly recommend consulting a qualified legal professional for your specific situation.',
      },
      {
        q: 'How does the GDPR option change the policy?',
        a: 'Selecting EU/GDPR or UK as your country adds a dedicated section covering GDPR and UK GDPR rights — including the right to access, erasure, data portability, and the right to lodge a complaint with a supervisory authority. It also mentions lawful bases for processing.',
      },
      {
        q: 'Can I customise the generated policy after downloading?',
        a: 'Absolutely. The .txt file or copied text is fully editable. You can open it in any text editor, word processor, or CMS and tailor the language, add your specific data practices, or have a lawyer review and modify it before publishing.',
      },
    ],
  },
}
