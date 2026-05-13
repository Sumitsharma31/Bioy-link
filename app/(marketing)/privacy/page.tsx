import React from 'react';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support.

**Account Information:** Name, email address, username, and password when you register.

**Profile Information:** Bio, profile picture, links, and any other content you add to your BioLinks page.

**Usage Data:** Pages visited, features used, clicks on links, and time spent on the platform.

**Device Information:** IP address, browser type, operating system, and referring URLs.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process transactions and send related information
• Send technical notices, updates, and support messages
• Respond to your comments and questions
• Monitor and analyze usage patterns to improve user experience
• Detect, prevent, and address fraud and abuse`,
  },
  {
    title: '3. Sharing of Information',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:

**Service Providers:** We may share information with vendors who assist us in operating the platform (e.g., hosting, analytics, email delivery).

**Legal Requirements:** We may disclose information if required by law or in response to valid legal process.

**Business Transfers:** If BioLinks is acquired or merges with another company, your information may be transferred as part of that transaction.`,
  },
  {
    title: '4. Data Retention',
    content: `We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time through your account settings or by contacting our support team.

Analytics data may be retained in an anonymized, aggregated form after account deletion for internal research purposes.`,
  },
  {
    title: '5. Security',
    content: `We take the security of your data seriously. We use industry-standard encryption (AES-256) for data at rest and TLS for data in transit. However, no method of transmission over the Internet is 100% secure.

We recommend using a strong, unique password for your account and enabling any available security features.`,
  },
  {
    title: '6. Cookies',
    content: `We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data that are sent to your browser from a website.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.`,
  },
  {
    title: '7. Third-Party Services',
    content: `Our service may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party services you use.

We currently use the following third-party services: Supabase (database & authentication), Cloudinary (image storage), and Vercel (hosting).`,
  },
  {
    title: '8. Your Rights',
    content: `Depending on your location, you may have the following rights regarding your personal data:

• **Access:** Request a copy of the personal data we hold about you.
• **Correction:** Request correction of inaccurate or incomplete data.
• **Deletion:** Request deletion of your personal data.
• **Portability:** Request a machine-readable export of your data.
• **Objection:** Object to the processing of your personal data.

To exercise these rights, contact us at privacy@biolinks.io.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or by posting a notice on our platform. Your continued use of BioLinks after changes become effective constitutes your acceptance of the revised policy.`,
  },
  {
    title: '10. Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at:

**Email:** privacy@biolinks.io
**Address:** BioLinks Inc., 123 Creator Ave, San Francisco, CA 94105`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-md sm:px-margin">
          {/* Header */}
          <div className="mb-xl pb-xl border-b border-outline-variant/20">
            <span className="inline-flex items-center px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary mb-md">
              Legal
            </span>
            <h1 className="text-5xl font-black text-on-surface tracking-tight mb-md" style={{ lineHeight: 1.05 }}>
              Privacy Policy
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              Last updated: <strong className="text-on-surface">May 9, 2026</strong>
            </p>
            <p className="text-body-md text-on-surface-variant mt-sm">
              At BioLinks, your privacy is a priority. This policy explains what data we collect, why we collect it, and how it is used. Please read it carefully.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-xl">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-headline-md text-on-surface mb-md">{section.title}</h2>
                <div className="text-body-md text-on-surface-variant space-y-sm leading-relaxed">
                  {section.content.split('\n\n').map((para, j) => (
                    <p key={j} className="whitespace-pre-line">
                      {para.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
