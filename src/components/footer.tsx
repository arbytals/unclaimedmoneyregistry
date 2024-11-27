export function SiteFooter() {
  return (
    <footer className="w-full bg-gray-100 py-2 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-4">
            <span>© 2017 Ubiquity Solutions Pty Ltd</span>
            <span>|</span>
            <span>ACN 169 895 505</span>
            <span>|</span>
            <span>ABN 44 554 380 720</span>
          </div>
          <p>
            The Registry of Unclaimed Money is an Australian owned and operated
            business.
          </p>
          <p>
            &copy; {new Date().getFullYear()} The Registry of Unclaimed Money
          </p>
        </div>
      </div>
    </footer>
  );
}
