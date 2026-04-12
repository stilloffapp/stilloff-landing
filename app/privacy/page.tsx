import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — StillOff',
  description: 'How StillOff handles your data. Short version: we barely collect any.',
};

export default function PrivacyPage() {
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
            Privacy Policy
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
          StillOff is built on the premise that your attention is already being
          harvested enough. We have no interest in adding to it. Here is exactly
          what we collect, and why.
        </p>

        <div className="space-y-12" style={{ color: 'rgba(190,180,167,0.65)' }}>
          <PolicySection title="What we collect">
            <p className="font-sans text-sm leading-relaxed mb-3">
              One thing: your email address, and only if you choose to give it to us
              by joining the waitlist. That is the full list.
            </p>
            <p className="font-sans text-sm leading-relaxed">
              We do not collect your name, location, device information, or anything
              else from this website.
            </p>
          </PolicySection>

          <Divider />

          <PolicySection title="What we don't collect">
            <p className="font-sans text-sm leading-relaxed mb-3">
              We do not collect data about how you use your phone. When the StillOff
              app launches, all behavioral analysis — the Pattern Intelligence that
              learns your triggers — runs entirely on your device. None of that data
              is sent to our servers.
            </p>
            <p className="font-sans text-sm leading-relaxed">
              Your patterns are yours. That is the design, not a policy we might
              change later.
            </p>
          </PolicySection>

          <Divider />

          <PolicySection title="How we use your email">
            <p className="font-sans text-sm leading-relaxed mb-3">
              We will send you one email when StillOff launches. That is it. No
              newsletters, no product updates, no re-engagement campaigns.
            </p>
            <p className="font-sans text-sm leading-relaxed">
              If you want to be removed before then, email us at{' '}
              <a
                href="mailto:hello@stilloff.com"
                style={{ color: '#C4714A' }}
              >
                hello@stilloff.com
              </a>{' '}
              and we will remove you immediately.
            </p>
          </PolicySection>

          <Divider />

          <PolicySection title="Third-party services">
            <p className="font-sans text-sm leading-relaxed mb-3">
              <strong style={{ color: '#F4EFE8', fontWeight: 500 }}>Formspree</strong> —
              We use Formspree to receive waitlist emails. When you submit your email,
              it is processed by Formspree and stored in our account there. Formspree
              has its own privacy policy at formspree.io.
            </p>
            <p className="font-sans text-sm leading-relaxed">
              <strong style={{ color: '#F4EFE8', fontWeight: 500 }}>Vercel Analytics</strong> —
              This site uses Vercel Analytics for basic traffic data: page views and
              referrer information. This data is anonymized. No cookies are set and no
              individual visitors are identified.
            </p>
          </PolicySection>

          <Divider />

          <PolicySection title="Data sharing">
            <p className="font-sans text-sm leading-relaxed">
              We do not sell, rent, or share your email address with any third party,
              full stop. The only way your email leaves our possession is if we are
              legally required to produce it, which has never happened and we hope
              never will.
            </p>
          </PolicySection>

          <Divider />

          <PolicySection title="Data security">
            <p className="font-sans text-sm leading-relaxed">
              We take reasonable steps to protect the data we hold. Given that we
              hold only email addresses and this is a pre-launch website, the surface
              area is minimal by design.
            </p>
          </PolicySection>

          <Divider />

          <PolicySection title="Changes to this policy">
            <p className="font-sans text-sm leading-relaxed">
              If we change this policy in any meaningful way, we will update the date
              at the top of this page. We will not change it in ways that are worse
              for you without telling you.
            </p>
          </PolicySection>

          <Divider />

          <PolicySection title="Contact">
            <p className="font-sans text-sm leading-relaxed">
              Questions about this policy or your data:{' '}
              <a
                href="mailto:hello@stilloff.com"
                style={{ color: '#C4714A' }}
              >
                hello@stilloff.com
              </a>
            </p>
          </PolicySection>
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
              href="/terms"
              className="text-xs font-sans transition-colors"
              style={{ color: 'rgba(190,180,167,0.38)' }}
            >
              Terms
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

function PolicySection({
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
