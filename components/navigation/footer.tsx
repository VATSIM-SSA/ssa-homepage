export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center bg-zinc-800 text-zinc-400">
      <div className="text-sm w-full max-w-7xl mx-6 px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-2">
        <p className="lg:w-1/3 w-full text-center lg:text-left whitespace-nowrap">&copy; 2026 VATSSA. All rights reserved. </p>
        <p className="text-center lg:w-1/3">Created with ❤️ by <a className="text-red-400 cursor-pointer hover:text-red-300 transition-all duration-200" href="https://hykka.dev">hykka</a>.</p>
        <div className="lg:w-1/3 w-full flex text-center justify-center lg:justify-end items-center gap-4">
          <a href="#" className="hover:text-white transition-all duration-200">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-all duration-200">
            Terms of Service
          </a>
          <a href="/about/staff-team" className="hover:text-white transition-all duration-200">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
