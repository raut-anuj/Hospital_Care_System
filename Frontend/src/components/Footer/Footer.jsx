export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left side - Branding */}
        <p className="text-gray-600 text-sm">
          © 2026 Your Healthcare Platform. All rights reserved.
        </p>

        {/* Right side - Links */}
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#about" className="text-gray-600 hover:text-blue-700 text-sm">
            About Us
          </a>
          <a href="#contact" className="text-gray-600 hover:text-blue-700 text-sm">
            Contact
          </a>
          <a href="#privacy" className="text-gray-600 hover:text-blue-700 text-sm">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
