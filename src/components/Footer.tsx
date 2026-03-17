import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import design from "../../config/design.json";

const { brand, services } = design;

export default function Footer() {
  return (
    <footer className="bg-footer-background text-footer-foreground">
      <div className="max-w-[100rem] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Church Info */}
          <div>
            <h3 className="font-heading text-2xl mb-6">{brand.name}</h3>
            <p className="font-paragraph text-sm text-footer-foreground/80 leading-relaxed">
              A community of believers seeking to worship God and serve others
              with love and dedication.
            </p>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="font-heading text-xl mb-6">Service Times</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-paragraph text-sm font-semibold">
                    {services.sunday.day} Worship
                  </p>
                  <p className="font-paragraph text-sm text-footer-foreground/80">
                    {services.sunday.time}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-paragraph text-sm font-semibold">
                    {services.bibleStudy.day} Bible Study
                  </p>
                  <p className="font-paragraph text-sm text-footer-foreground/80">
                    {services.bibleStudy.time}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xl mb-6">Contact Us</h4>
            <div className="space-y-4">
              {/* Phone — hidden for now, remove 'hidden' class to re-enable */}
              <div className="flex items-start hidden">
                <Phone className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <p className="font-paragraph text-sm">{brand.phone}</p>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <p className="font-paragraph text-sm">{brand.email}</p>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <p className="font-paragraph text-sm">
                  {brand.address.line1}<br />
                  {brand.address.city}, {brand.address.state} {brand.address.zip}
                </p>
              </div>
              {/* WhatsApp — hidden for now, remove 'hidden' class to re-enable */}
              <a
                href={`https://wa.me/${brand.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm hover:text-highlight-hover transition-colors hidden"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl mb-6">Quick Links</h4>
            <nav className="space-y-3">
              {[
                { label: "Watch Live", to: "/watch-live" },
                { label: "Sermons", to: "/sermons" },
                { label: "Prayer Request", to: "/prayer-requests" },
                { label: "Events", to: "/events" },
                { label: "Gallery", to: "/gallery" },
                { label: "Contact", to: "/contact" },
                { label: "About Us", to: "/about" },
              ].map(({ label, to }) => (
                <a
                  key={to}
                  href={to}
                  className="block font-paragraph text-sm hover:text-highlight-hover transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-footer-foreground/20 pt-8 text-center">
          <p className="font-paragraph text-sm text-footer-foreground/70">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}