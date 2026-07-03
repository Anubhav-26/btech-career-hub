import type { Metadata } from "next";
import {
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Github,
  Linkedin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | BTech Career Hub",
  description:
    "Get in touch with the BTech Career Hub team. We'd love to hear your feedback, suggestions, or support requests.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b">
        <div className="container mx-auto max-w-6xl px-6 py-20">
          <span className="rounded-full border px-4 py-1 text-sm font-medium text-primary">
            Contact Us
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            We'd Love to Hear From You
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Whether you have a question, found a bug, want to suggest a new
            feature, or simply want to share feedback, feel free to reach out.
            We're always working to improve BTech Career Hub for engineering
            students.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left */}
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6">
              <div className="flex items-center gap-4">
                <Mail className="h-10 w-10 text-primary" />

                <div>
                  <h3 className="font-semibold text-lg">Email</h3>

                  <p className="text-muted-foreground">
                    support@btechcareerhub.com
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <div className="flex items-center gap-4">
                <Clock className="h-10 w-10 text-primary" />

                <div>
                  <h3 className="font-semibold text-lg">Support Hours</h3>

                  <p className="text-muted-foreground">
                    Monday – Friday
                  </p>

                  <p className="text-muted-foreground">
                    9:00 AM – 6:00 PM (IST)
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <div className="flex items-center gap-4">
                <MapPin className="h-10 w-10 text-primary" />

                <div>
                  <h3 className="font-semibold text-lg">Location</h3>

                  <p className="text-muted-foreground">
                    India
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-lg font-semibold">
                Connect With Us
              </h3>

              <div className="mt-5 flex gap-4">
                <a
                  href="https://github.com/Anubhav-26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border p-3 transition hover:bg-muted"
                >
                  <Github className="h-6 w-6" />
                </a>

                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border p-3 transition hover:bg-muted"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-2xl border bg-card p-8">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />

              <h2 className="text-2xl font-bold">
                Send us a Message
              </h2>
            </div>

            <form className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Message
                </label>

                <textarea
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
              >
                Send Message
              </button>
            </form>

            <p className="mt-5 text-sm text-muted-foreground">
              We'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/40">
        <div className="container mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">
            Need Help?
          </h2>

          <p className="mt-5 text-muted-foreground leading-8">
            For technical issues, feature requests, exam information,
            collaboration opportunities, or general feedback, feel free to
            contact us. Your suggestions help us improve the platform for every
            engineering student.
          </p>
        </div>
      </section>
    </main>
  );
}