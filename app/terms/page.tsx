import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — StillOff',
  description: 'The terms governing use of the StillOff website.',
};

export default function TermsPage() {
  return (
    <div
      style={{ background: '#0E0D0B', minHeight: '100vh', color: '#F4EFE8' }}
      className="font-sans"
    >
      {/* Nav */}
      <header
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(14,13,11,0.95)',
          backdropFilter: 'blur(20px)',
        }}
        className="sticky top-0 z-50"
      >
        <div
          className="mx-auto px-6 lg:px-10 h-16 flex items-center justify-between"
          style={{ maxWidth: 1140 }}
        >
          <Link
            href="/"
            className="font-serif text-xl tracking-tight"
            style={{ color: '#F4EFE8' }}
          >
            StillOff
          </Link>
          <Link
            href="/"
            className="text-sm font-sans transition-colors duration-200"
            style={{ color: 'rgba(190,180,167,0.55)' }}
          >
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main
        className="mx-auto px-6 lg:px-10 py-20 lg:py-28"
        style={{ maxWidth: 720 }}
      >
        {/* Header */}
        <div className="mb-16">
          <p
            className="text-xs font-sans tracking-[0.22em] uppercase mb-6"
            style={{ color: 'rgba(196,113,74,0.55)' }}
          >
            Legal
          </p>
          <h1
            className="font-serif leading-tight mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#F4EFE8' }}
          >
            Terms of Service
          </h1>
          <p className="font-sans text-sm" style={{ color: 'rgba(190,180,167,0.4)' }}>
            Last updated: April 2026
          </p>
        </div>

        {/* Lead */}
        <p
          className="font-serif text-xl leading-relaxed mb-16"
          style={{ color: 'rgba(190,180,167,0.72)' }}
        >
          This is the website for StillOff, a pre-launch product. By using this
          site you are agreeing to the terms below. They are short and honest.
        </p>

        <div className="space-y-12" style={{ color: 'rgba(190,180,167,0.65)' }}>
          <TermsSection title="This is a pre-launch website">
            <p className="font-sans text-sm leading-relaxed mb-3">
              StillOff is currently in development. Nothing on this website
              constitutes a purchase, subscription, or binding commercial agreement.
            </p>
            <p className="font-sans text-sm leading-relaxed">
              Joining the waitlist is a request to be notified when the product
              launches. It does not guarantee a spot, a specific price, or any
              particular set of features.
            </p>
          </TermsSection>

          <Divider />

          <TermsSection title="Use of this website">
            <p className="font-sans text-sm leading-relaxed mb-3">
              You may use this website for personal, non-commercial purposes. You
              may not scrape, reproduce, republish, or distribute any content from
              this site without our written permission.
            </p>
            <p className="font-sans text-sm leading-relaxed">
              You may not use this site in any way that is unlawful, harmful, or
              that interferes with its operation.
            </p>
          </TermsSection>

          <Divider />

          <TermsSection title="Intellectual property">
            <p className="font-sans text-sm leading-relaxed">
              All content on this site — including text, design, graphics, and code —
              is owned by StillOff or its licensors. The StillOff name and mark are
              proprietary. Nothing on this site grants you any license to use them.
            </p>
          </TermsSection>

          <Divider />

          <TermsSection title="No warranties">
            <p className="font-sans text-sm leading-relaxed">
              This website is provided &quot;as is&quot; without any warranty of any kind.
              We do not guarantee that it will be error-free, uninterrupted, or that
              any information on it is accurate at all times. We are a pre-launch
              product; things change.
            </p>
          </TermsSection>

          <Divider />

          <TermsSection title="Limitation of liability">
            <p className="font-sans text-sm leading-relaxed">
              To the maximum extent permitted by law, StillOff will not be liable
              for any indirect, incidental, or consequential damages arising from
              your use of this website.
            </p>
          </TermsSection>

          <Divider />

          <TermsSection title="External links">
            <p className="font-sans text-sm leading-relaxed">
              This site may contain links to third-party websites. We are not
              responsible for the content or privacy practices of those sites.
            </p>
          </TermsSection>

          <Divider />

          <TermsSection title="Changes to these terms">
            <p className="font-sans text-sm leading-relaxed">
              We may update these terms from time to time. If we do, we will update
              the date at the top of this page. Continued use of the site after
              changes constitutes acceptance.
            </p>
          </TermsSection>

          <Divider />

          <TermsSection title="Governing law">
            <p className="font-sans text-sm leading-relaxed">
              These terms are governed by and construed in accordance with the laws
              of the United States.
            </p>
          </TermsSection>

          <Divider />

          <TermsSection title="Contact">
            <p className="font-sans text-sm leading-relaxed">
              Questions about these terms:{' '}
              <a
                href="mailto:hello@stilloff.com"
                style={{ color: '#C4714A' }}
              >
                hello@stilloff.com
              </a>
            </p>
          </TermsSection>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-10 px-6 lg:px-10 mt-16"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div
          className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ maxWidth: 720 }}
        >
          <p className="font-serif text-xl" style={{ color: '#F4EFE8' }}>
            StillOff
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs font-sans transition-colors"
              style={{ color: 'rgba(190,180,167,0.38)' }}
            >
              Privacy
            </Link>
            <a
              href="mailto:hello@stilloff.com"
              className="text-xs font-sans transition-colors"
              style={{ color: 'rgba(190,180,167,0.38)' }}
            >
              hello@stilloff.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className="font-serif mb-5"
        style={{ fontSize: '1.4rem', color: '#F4EFE8' }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: 'rgba(255,255,255,0.05)',
      }}
    />
  );
}
