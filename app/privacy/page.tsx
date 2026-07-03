import { Metadata } from "next";
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  Cookie,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | BTech Career Hub",
  description:
    "Read the Privacy Policy for BTech Career Hub and learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b">
        <div className="container mx-auto max-w-5xl px-6 py-20">
          <ShieldCheck className="h-14 w-14 text-primary" />

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Your privacy matters to us. This Privacy Policy explains how
            BTech Career Hub collects, uses, stores, and protects your
            information when you use our platform.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Last Updated: July 4, 2026
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-6 py-16 space-y-14">
        {/* Information We Collect */}
        <div>
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-semibold">
              Information We Collect
            </h2>
          </div>

          <ul className="mt-6 list-disc space-y-3 pl-6 text-muted-foreground leading-7">
            <li>Name and email address (when you create an account).</li>
            <li>Your academic preferences such as branch, semester, and career goals.</li>
            <li>Your saved roadmap progress and bookmarked resources.</li>
            <li>Basic device and browser information for security and analytics.</li>
          </ul>
        </div>

        {/* How We Use */}
        <div>
          <div className="flex items-center gap-3">
            <Eye className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-semibold">
              How We Use Your Information
            </h2>
          </div>

          <ul className="mt-6 list-disc space-y-3 pl-6 text-muted-foreground leading-7">
            <li>Provide personalized dashboards and recommendations.</li>
            <li>Improve learning resources and user experience.</li>
            <li>Maintain account security and prevent misuse.</li>
            <li>Respond to support requests and feedback.</li>
          </ul>
        </div>

        {/* Security */}
        <div>
          <div className="flex items-center gap-3">
            <Lock className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-semibold">
              Data Security
            </h2>
          </div>

          <p className="mt-6 leading-8 text-muted-foreground">
            We implement reasonable technical and organizational measures to
            protect your information from unauthorized access, alteration,
            disclosure, or destruction. While no online service can guarantee
            absolute security, we continuously work to keep your data safe.
          </p>
        </div>

        {/* Cookies */}
        <div>
          <div className="flex items-center gap-3">
            <Cookie className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-semibold">
              Cookies & Analytics
            </h2>
          </div>

          <p className="mt-6 leading-8 text-muted-foreground">
            We may use cookies and analytics tools to remember your
            preferences, improve performance, and better understand how users
            interact with the platform. These technologies help us enhance the
            overall experience.
          </p>
        </div>

        {/* Third Party */}
        <div>
          <h2 className="text-2xl font-semibold">
            Third-Party Services
          </h2>

          <p className="mt-6 leading-8 text-muted-foreground">
            We may rely on trusted third-party services such as authentication,
            cloud hosting, analytics, or database providers to operate the
            platform. These providers only process information necessary to
            deliver their services.
          </p>
        </div>

        {/* User Rights */}
        <div>
          <h2 className="text-2xl font-semibold">
            Your Rights
          </h2>

          <ul className="mt-6 list-disc space-y-3 pl-6 text-muted-foreground leading-7">
            <li>Access your account information.</li>
            <li>Update or correct your profile.</li>
            <li>Request deletion of your account.</li>
            <li>Contact us regarding any privacy concerns.</li>
          </ul>
        </div>

        {/* Changes */}
        <div>
          <h2 className="text-2xl font-semibold">
            Changes to This Policy
          </h2>

          <p className="mt-6 leading-8 text-muted-foreground">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page along with the updated revision date.
          </p>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border bg-muted/40 p-8">
          <div className="flex items-center gap-3">
            <Mail className="h-8 w-8 text-primary" />

            <h2 className="text-2xl font-semibold">
              Contact Us
            </h2>
          </div>

          <p className="mt-5 leading-8 text-muted-foreground">
            If you have any questions about this Privacy Policy or how your
            information is handled, please contact us through the Contact page
            or via the support email provided on the website.
          </p>
        </div>
      </section>
    </main>
  );
}