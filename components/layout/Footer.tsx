export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="hidden border-t border-border py-8 text-sm text-ink-muted md:block">
      <div className="container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <p>
          © {year} B.Tech Career Hub. Built for Indian engineering students.
        </p>

        <nav className="flex gap-4">
          <a
            href="/about"
            className="hover:text-ink transition-colors"
          >
            About
          </a>

          <a
            href="/privacy"
            className="hover:text-ink transition-colors"
          >
            Privacy
          </a>

          <a
            href="/contact"
            className="hover:text-ink transition-colors"
          >
            Contact
          </a>
        </nav>

      </div>
    </footer>
  );
}