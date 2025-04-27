import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{' '}
          <Link
            href="#" // Replace with actual link if available
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Your Name/Company
          </Link>
          . © {new Date().getFullYear()} CribDirect. All rights reserved.
        </p>
        <nav className="flex gap-4 items-center text-sm text-muted-foreground">
           <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
           <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  );
}
