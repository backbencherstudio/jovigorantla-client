import { useAuth } from "@/context/AuthContext";
import { Facebook, Youtube, Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { useLocationContext } from "@/context/LocationContext";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

export default function AboutFooter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateLocation } = useLocationContext();

  const topCity = [
    {
      city: "Fremont",
      state_id: "CA",
      state_name: "California",
      lat: 37.5265,
      lng: -121.9843,
      search: "Fremont, CA, USA",
      zips: ["94560 94536 94538 94539 94555 94537"],
    },
    {
      city: "San Jose",
      state_id: "CA",
      state_name: "California",
      lat: 37.3012,
      lng: -121.848,
      search: "San Jose, CA, USA",
      zips: [
        "95118 95128 95124 95125 95126 95127 95120 95122 95123 95008 95002 95117 95116 95111 95110 95113 95112 95119 95148 95133 95132 95131 95130 95136 95134 95139 95138 95037 95013 95129 95121 95101 95103 95106 95109 95115 95141 95150 95151 95153 95154 95155 95156 95157 95158 95159 95160 95161 95164 95172 95173 95190 95191 95192 95193 95194 95196",
      ],
    },
    {
      city: "Dallas",
      state_id: "TX",
      state_name: "Texas",
      lat: 32.7935,
      lng: -96.7667,
      search: "Dallas, TX, USA",
      zips: [
        "75098 75287 75230 75231 75236 75237 75235 75254 75251 75252 75253 75043 75032 75227 75238 75232 75233 75234 75089 75088 75087 75247 75244 75249 75248 75051 75166 75210 75211 75212 75214 75215 75216 75217 75218 75219 75390 75182 75229 75228 75220 75223 75225 75224 75226 75243 75241 75240 75246 75270 75207 75206 75204 75203 75202 75201 75209 75208 75019 75221 75222 75242 75250 75260 75262 75263 75264 75266 75267 75277 75283 75284 75285 75301 75303 75312 75313 75315 75320 75336 75339 75342 75354 75355 75356 75357 75358 75359 75360 75367 75370 75371 75372 75373 75374 75376 75378 75379 75380 75382 75389 75392 75393 75394 75395 75397 75398",
      ],
    },
    {
      city: "Houston",
      state_id: "TX",
      state_name: "Texas",
      lat: 29.786,
      lng: -95.3885,
      search: "Houston, TX, USA",
      zips: [
        "77069 77068 77061 77060 77063 77062 77065 77064 77067 77066 77346 77571 77036 77037 77034 77035 77032 77033 77030 77031 77038 77449 77489 77044 77043 77042 77204 77598 77018 77019 77015 77016 77017 77010 77011 77012 77013 77094 77093 77092 77345 77547 77025 77024 77027 77026 77021 77020 77023 77022 77029 77028 77096 77090 77091 77098 77099 77078 77079 77072 77073 77070 77071 77076 77077 77074 77075 77407 77047 77046 77045 77041 77040 77048 77336 77339 77338 77003 77002 77007 77006 77005 77004 77009 77008 77450 77082 77084 77089 77088 77083 77081 77080 77087 77086 77085 77053 77054 77055 77056 77057 77058 77059 77396 77051 77506 77504 77001 77052 77201 77202 77203 77205 77206 77207 77208 77210 77212 77213 77215 77216 77217 77218 77219 77220 77221 77222 77223 77225 77226 77227 77228 77229 77230 77231 77233 77234 77235 77236 77237 77241 77242 77243 77244 77245 77248 77249 77251 77252 77253 77254 77255 77256 77257 77259 77261 77262 77263 77266 77269 77270 77271 77272 77273 77274 77275 77282 77284 77287 77288 77289 77291 77292 77293 77297 77299 77315 77325 77411",
      ],
    },
    {
      city: "Jersey City",
      state_id: "NJ",
      state_name: "New Jersey",
      lat: 40.7184,
      lng: -74.0686,
      search: "Jersey City, NJ, USA",
      zips: [
        "07310 07311 07302 07307 07306 07305 07304 07097 07303 07308 07395 07399",
      ],
    },
    {
      city: "Tampa",
      state_id: "FL",
      state_name: "Florida",
      lat: 27.9945,
      lng: -82.4447,
      search: "Tampa, FL, USA",
      zips: [
        "33629 33621 33620 33619 33616 33613 33617 33614 33610 33611 33612 33637 33647 33609 33605 33604 33607 33606 33603 33602 33608 33622 33623 33630 33631 33633 33646 33650 33655 33664 33672 33673 33674 33677 33679 33681 33684 33686 33689",
      ],
    },
    {
      city: "Austin",
      state_id: "TX",
      state_name: "Texas",
      lat: 30.3005,
      lng: -97.7522,
      search: "Austin, TX, USA",
      zips: [
        "78749 78748 78741 78742 78745 78744 78747 78746 78717 78712 78719 78617 78739 78735 78736 78730 78731 78732 78733 78705 78704 78701 78703 78702 78758 78759 78752 78753 78750 78751 78756 78757 78754 78652 78723 78722 78721 78727 78726 78725 78724 78729 78728 73301 73344 78651 78708 78709 78710 78711 78713 78714 78715 78718 78720 78755 78760 78761 78762 78763 78765 78766 78767 78768 78772 78773 78774 78778 78779 78783 78799",
      ],
    },
    {
      city: "Overland Park",
      state_id: "KS",
      state_name: "Kansas",
      lat: 38.887,
      lng: -94.687,
      search: "Overland Park, KS, USA",
      zips: [
        "66214 66210 66211 66212 66213 66221 66223 66209 66202 66207 66204 66013 66251 66085 66224 66201 66225 66276 66282 66283",
      ],
    },
    {
      city: "Edison",
      state_id: "NJ",
      state_name: "New Jersey",
      lat: 40.536,
      lng: -74.3697,
      search: "Edison, NJ, USA",
      zips: ["08820 08817 08837 08818 08855 08899 08989"],
    },
  ];

  return (
    <footer
      className={`py-6 sm:pt-8 ${
        user ? "pb-8" : "pb-[70px]"
      } lg:pb-8 bg-white border-t border-border/50`}
    >
      <div className="w-full px-2">
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Social Media Icons */}
          <div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                {
                  icon: FaXTwitter,
                  href: "https://x.com/desieasyteam",
                  label: "X",
                },
                {
                  icon: Facebook,
                  href: "https://www.facebook.com/desieasy",
                  label: "Facebook",
                },
                {
                  icon: Youtube,
                  href: "https://www.youtube.com/@desieasy",
                  label: "YouTube",
                },
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/desieasyofficial/",
                  label: "Instagram",
                },
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
              {topCity.map((city, index, array) => (
                <span key={index} className="flex items-center">
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("home_cached_data");
                      sessionStorage.removeItem("home_scroll_position");

                      // Update location context immediately
                      updateLocation(city);
                      navigate("/");
                      scrollTo(0, 0);
                    }}
                    className="text-muted-foreground hover:text-primary hover:underline transition-all duration-200 font-medium px-1 py-0.5 rounded"
                  >
                    {city.city}
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
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground ${
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
