import React from 'react'

function Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-12 px-6 md:px-20">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
    {/* Brand & Description */}
    <div>
    <img
          src="https://i.ibb.co/TxC947Cw/thumbnail-Image-2025-07-09-at-2-10-AM-removebg-preview.png"
          alt="Logo"
          className="w-24 object-contain filter brightness-0 invert -ml-2"
        />
      <p className="text-gray-400 text-sm">
      Book a driver. We pick up. We deliver. You relax. Fast, reliable delivery and errands made easy.
      </p>
    </div>

    {/* Navigation */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Company</h3>
      <ul className="space-y-2 text-gray-400 text-sm">
        <li><a href="/about" className="hover:text-white">About Us</a></li>
        <li><a href="/careers" className="hover:text-white">Careers</a></li>
        <li><a href="/drivers" className="hover:text-white">Become a Rider</a></li>
        <li><a href="/support" className="hover:text-white">Support</a></li>
      </ul>
    </div>

    {/* Resources */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Resources</h3>
      <ul className="space-y-2 text-gray-400 text-sm">
        <li><a href="/help" className="hover:text-white">Help Center</a></li>
        <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
        <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
        <li><a href="/safety" className="hover:text-white">Safety Guidelines</a></li>
      </ul>
    </div>

    {/* App Download */}
    {/* <div>
      <h3 className="text-lg font-semibold mb-4">Get the App</h3>
      <div className="flex flex-col gap-3">
        <a href="#" className="w-32">
          <img src="/appstore.png" alt="Download on App Store" />
        </a>
        <a href="#" className="w-32">
          <img src="/playstore.png" alt="Get it on Google Play" />
        </a>
      </div>
    </div> */}
  </div>

  <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
    <p>© {new Date().getFullYear()} LocalRun. All rights reserved.</p>
    <div className="flex gap-4 mt-4 md:mt-0">
      <a href="#" className="hover:text-white">Facebook</a>
      <a href="#" className="hover:text-white">Twitter</a>
      <a href="#" className="hover:text-white">Instagram</a>
    </div>
  </div>
</footer>
  )
}

export default Footer