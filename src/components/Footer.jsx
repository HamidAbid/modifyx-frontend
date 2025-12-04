import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-14 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-extrabold text-red-600 mb-4 tracking-wide uppercase">
              RevX Customs
            </h3>
            <p className="text-gray-300 mb-5 leading-relaxed">
              Precision meets passion. From custom body kits to alloy upgrades,
              we redefine what your car can be — style, performance, and power.
            </p>
            <div className="flex space-x-5">
              {[
                {
                  href: "#",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797
                      c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26
                      c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343
                      21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  href: "#",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06
                      1.064.049 1.791.218 2.427.465a4.902 4.902 0
                      011.772 1.153 4.902 4.902 0 011.153
                      1.772c.247.636.416 1.363.465 2.427.048
                      1.067.06 1.407.06 4.123v.08c0
                      2.643-.012 2.987-.06 4.043-.049
                      1.064-.218 1.791-.465
                      2.427a4.902 4.902 0
                      01-1.153 1.772 4.902 4.902 0
                      01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643
                      0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902
                      4.902 0 01-1.772-1.153 4.902 4.902 0
                      01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902
                      4.902 0 011.153-1.772A4.902 4.902 0 015.45
                      2.525c.636-.247 1.363-.416
                      2.427-.465C8.901 2.013 9.256 2
                      11.685 2h.63z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  href: "#",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0
                    11.675-6.253 11.675-11.675
                    0-.178 0-.355-.012-.53A8.348
                    8.348 0 0022 5.92a8.19 8.19 0
                    01-2.357.646 4.118 4.118 0
                    001.804-2.27 8.224 8.224 0
                    01-2.605.996 4.107 4.107 0
                    00-6.993 3.743 11.65 11.65 0
                    01-8.457-4.287 4.106 4.106 0
                    001.27 5.477A4.072 4.072 0
                    012.8 9.713v.052a4.105 4.105 0
                    003.292 4.022 4.095 4.095 0
                    01-1.853.07 4.108 4.108 0
                    003.834 2.85A8.233 8.233 0
                    012 18.407a11.616 11.616 0
                    006.29 1.84" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="text-gray-400 hover:text-red-600 transition duration-200"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-4 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/" className="hover:text-red-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/custom-consultation" className="hover:text-red-500">
                  Customized car Modificaition
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-red-500">
                  Packages
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-red-500">
                  Blog & Tips
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-red-500">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-4 uppercase">
              Our Specialties
            </h3>
          <ul className="text-gray-300">
              <li>Body Kits & Aero Mods</li>
              <li>Alloy Wheels & Tires</li>
              <li>Performance Upgrades</li>
              <li>Interior Customization</li>
              <li>Detailing & Coatings</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-4 uppercase">
              Contact Us
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                📍 <span>AutoZone Plaza, Lahore, Pakistan</span>
              </li>
              <li>📞 +92 300 1234567</li>
              <li>📧 info@revxcustoms.com</li>
              <li>🕘 Mon–Sat: 10 AM – 8 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} RevX Customs. All rights reserved.  
            Built with 💪 Passion for Performance.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
