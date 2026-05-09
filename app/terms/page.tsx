import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using BioLinks ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.

These Terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: '2. Accounts',
    content: `When you create an account with us, you must provide information that is accurate, complete, and current. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.

You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.`,
  },
  {
    title: '3. Acceptable Use',
    content: `You agree not to use BioLinks to:

• Post content that is unlawful, harmful, threatening, abusive, or otherwise objectionable
• Impersonate any person or entity or misrepresent your affiliation with any person or entity
• Upload viruses, malware, or any other malicious code
• Spam, phish, or engage in any other deceptive practices
• Violate any applicable local, national, or international laws or regulations
• Infringe on intellectual property rights of others`,
  },
  {
    title: '4. Content Ownership',
    content: `You retain full ownership of all content you post on BioLinks. By posting content, you grant BioLinks a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content solely for the purpose of operating and improving the Service.

BioLinks does not claim ownership of user-generated content. We will never sell your content to third parties.`,
  },
  {
    title: '5. Prohibited Content',
    content: `The following types of content are strictly prohibited on BioLinks:

• Adult or sexually explicit content
• Content that promotes violence, hate speech, or discrimination
• Content that infringes on trademarks, copyrights, or other intellectual property rights
• Links to illegal software, pirated content, or malware
• Scams, pyramid schemes, or fraudulent business opportunities`,
  },
  {
    title: '6. Termination',
    content: `We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason, including but not limited to:

• Breach of these Terms
• Conduct that we believe is harmful to other users, the Service, or third parties
• Extended periods of inactivity (accounts inactive for over 12 months on the free plan)

Upon termination, your right to use the Service will cease immediately.`,
  },
  {
    title: '7. Limitation of Liability',
    content: `To the maximum extent permitted by law, BioLinks shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, resulting from your use of the Service.

In no event shall BioLinks's total liability exceed the amount you paid for the Service in the twelve months prior to the event giving rise to the claim.`,
  },
  {
    title: '8. Disclaimer of Warranties',
    content: `The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.

BioLinks does not warrant that the Service will be uninterrupted, error-free, or that defects will be corrected.`,
  },
  {
    title: '9. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.

Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in San Francisco County, California.`,
  },
  {
    title: '10. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. We will provide at least 30 days notice before new terms take effect for material changes.

Your continued use of the Service after changes take effect constitutes your acceptance of the new Terms. If you do not agree to the updated Terms, you must stop using the Service.`,
  },
  {
    title: '11. Contact',
    content: `If you have questions about these Terms of Service, please contact us at:

Email: legal@biolinks.io
Address: BioLinks Inc., 123 Creator Ave, San Francisco, CA 94105`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-md sm:px-margin">
          {/* Header */}
          <div className="mb-xl pb-xl border-b border-outline-variant/20">
            <span className="inline-flex items-center px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary mb-md">
              Legal
            </span>
            <h1 className="text-5xl font-black text-on-surface tracking-tight mb-md" style={{ lineHeight: 1.05 }}>
              Terms of Service
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              Last updated: <strong className="text-on-surface">May 9, 2026</strong>
            </p>
            <p className="text-body-md text-on-surface-variant mt-sm">
              Please read these Terms of Service carefully before using BioLinks. These terms govern your access to and use of our platform.
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
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
