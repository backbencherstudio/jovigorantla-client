import { useAuth } from "@/context/AuthContext";
import { Facebook, Youtube, Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

export default function AboutFooter() {
  const navigate = useNavigate();

  const { user } = useAuth();

  return (
    <footer className="py-6 sm:pt-8 pb-[70px] lg:pb-8 bg-white border-t border-border/50">
      <div className="w-full px-2">
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Social Media Icons */}
          <div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                { icon: FaXTwitter, href: "#", label: "X" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: Instagram, href: "#", label: "Instagram" },
              ].map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-border/30 hover:border-primary/30"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Top Cities Section */}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-foreground mb-2">
              Top Cities
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-1 text-xs sm:text-sm leading-relaxed">
              {[
                "Fremont",
                "San Jose",
                "Dallas",
                "Houston",
                "Jersey City",
                "Tampa",
                "Austin",
                "Overland Park",
                "Edison",
              ].map((city, index, array) => (
                <span key={city} className="flex items-center">
                  <button
                    onClick={() =>
                      navigate(`/?location=${encodeURIComponent(city)}`)
                    }
                    className="text-muted-foreground hover:text-primary hover:underline transition-all duration-200 font-medium px-1 py-0.5 rounded"
                  >
                    {city}
                  </button>
                  {index < array.length - 1 && (
                    <span className="mx-[2px] text-muted-foreground/40">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Legal Links & Copyright */}
          <div
            className={`flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground ${
              user ? "flex" : "lg:flex hidden"
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="/privacy-policy"
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="/user-agreement"
                className="hover:text-primary transition-colors cursor-pointer"
              >
                User Agreement
              </a>
            </div>
            <span className="hidden sm:inline text-muted-foreground/40">|</span>
            <span>Desieasy © 2025. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
