export function Footer() {
  return (
    <footer className="hidden border-t border-border py-8 text-sm text-ink-muted md:block">
      <div className="container flex flex-col gap-2 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} B.Tech Career Hub. Built for Indian engineering students.</p>
        <div className="flex gap-4">
          <a href="/about" className="hover:text-ink">About</a>
          <a href="/privacy" className="hover:text-ink">Privacy</a>
          <a href="/contact" className="hover:text-ink">Contact</a>
        </div>
      </div>
    </footer>
  );
}
