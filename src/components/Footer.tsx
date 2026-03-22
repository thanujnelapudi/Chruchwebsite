import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import design from "../../config/design.json";

const { brand, services } = design;

export default function Footer() {
  return (
    <footer className="relative z-[100] bg-white border-t border-gray-100 text-[#0B1221]">
      <div className="max-w-[100rem] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">

          {/* Church Info */}
          <div>
            <h3 className="font-heading text-2xl mb-6 text-[#0B1221]">The Pillar of Fire Ministries</h3>
            <p className="font-paragraph text-sm text-[#0B1221]/70 leading-relaxed">
              A community of believers seeking to worship God and serve others
              with love and dedication.
            </p>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="font-heading text-xl mb-6 text-[#0B1221]">Church Timings</h4>
            <div className="space-y-4">
              {/* Sunday */}
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-[#0B1221]/50" />
                <div>
                  <p className="font-paragraph text-sm font-semibold text-[#0B1221]">
                    Sunday Worship
                  </p>
                  <p className="font-paragraph text-xs text-[#0B1221]/70 mt-0.5">
                    10:00 AM
                  </p>
                </div>
              </div>

              {/* Wednesday */}
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-[#0B1221]/50" />
                <div>
                  <p className="font-paragraph text-sm font-semibold text-[#0B1221]">
                    Wednesday Service
                  </p>
                  <p className="font-paragraph text-xs text-[#0B1221]/70 mt-0.5">
                    7:00 PM
                  </p>
                </div>
              </div>

              {/* Friday */}
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-[#0B1221]/50" />
                <div>
                  <p className="font-paragraph text-sm font-semibold text-[#0B1221]">
                    Friday Services
                  </p>
                  <p className="font-paragraph text-xs text-[#0B1221]/70 mt-0.5">
                    10:30 AM & 07:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xl mb-6 text-[#0B1221]">Contact Us</h4>
            <div className="space-y-4">
              {/* Phone — hidden for now, remove 'hidden' class to re-enable */}
              <div className="flex items-start hidden">
                <Phone className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-[#0B1221]/50" />
                <p className="font-paragraph text-sm text-[#0B1221]/80">{brand.phone}</p>
              </div>
              <div className="flex items-start group">
                <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-[#0B1221]/50 group-hover:text-[#C0A87D] transition-colors duration-300" />
                <p className="font-paragraph text-sm text-[#0B1221]/80 group-hover:text-[#C0A87D] transition-colors duration-300 cursor-pointer">{brand.email}</p>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-[#0B1221]/50" />
                <p className="font-paragraph text-sm text-[#0B1221]/80 leading-relaxed">
                  {brand.address.line1}<br />
                  {brand.address.city}, {brand.address.state} {brand.address.zip}
                </p>
              </div>
              {/* WhatsApp — hidden for now, remove 'hidden' class to re-enable */}
              <a
                href={`https://wa.me/${brand.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center text-sm text-[#0B1221]/80 hover:text-[#C0A87D] transition-colors duration-300 hidden"
              >
                <MessageCircle className="w-5 h-5 mr-2 text-[#0B1221]/50 group-hover:text-[#C0A87D] transition-colors duration-300" />
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl mb-6 text-[#0B1221]">Quick Links</h4>
            <nav className="space-y-3">
              {[
                { label: "Watch Live", to: "/watch-live" },
                { label: "Sermons", to: "/sermons" },
                { label: "Prayer Request", to: "/prayer-requests" },
                //  { label: "Events", to: "/events" },
                // { label: "Gallery", to: "/gallery" },
                { label: "Contact", to: "/contact" },
                { label: "About Us", to: "/about" },
              ].map(({ label, to }) => (
                <a
                  key={to}
                  href={to}
                  className="block font-paragraph text-sm text-[#0B1221]/80 hover:text-[#C0A87D] transition-colors duration-300 font-medium"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/5 pt-8 text-center text-[#0B1221]/50">
          <p className="font-paragraph text-sm">
            © {new Date().getFullYear()} The Pillar of Fire Ministries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}