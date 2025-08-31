import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle,
  Home,
  Car,
  ShoppingCart,
  Briefcase,
  Clock,
  Users,
  MapPin,
  MessageCircle,
  GraduationCap,
  Building,
  Heart,
  Navigation,
  Sparkles,
  Globe,
  Zap,
  Shield,
  Plus,
  Search,
  Facebook,
  Youtube,
  Instagram,
  Twitter,
} from "lucide-react";

import { FaXTwitter } from "react-icons/fa6";

import heroAbstract from "@/assets/hero-abstract.jpg";
import community3d from "@/assets/community-3d.jpg";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import AboutFooter from "./AboutFooter";

// Call the function to clear content based on the date

const AboutUs = () => {
  const navigate = useNavigate();
  // Function to check if the current date has passed the custom date

  const { user } = useAuth();

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePostListing = () => {
    navigate("/create-listing");
  };

  const handleBrowseListings = () => {
    navigate("/");
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Post a listing in under 60 seconds",
    },
    {
      icon: MapPin,
      title: "Location Smart",
      description: "Choose your city and radius for better local search",
    },
    {
      icon: Clock,
      title: "Instant Live",
      description: "Listings go live instantly",
    },
    {
      icon: MessageCircle,
      title: "Built-in Chat",
      description: "In-built chat system",
    },
    {
      icon: Globe,
      title: "USA Wide Reach",
      description: "Select listings can reach a USA-wide audience upon review",
    },
    {
      icon: Shield,
      title: "Desi First",
      description: "Built for Desis living across the U.S.",
    },
  ];

  const categories = [
    {
      icon: ShoppingCart,
      title: "Marketplace",
      description: "Buy/sell items or promote your services",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Car,
      title: "Rides",
      description: "Post or find rides between cities or local areas",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Home,
      title: "Accommodations",
      description: "Find roommates or post rental spaces",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Briefcase,
      title: "Jobs",
      description: "Share job openings or explore work opportunities",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const postingSteps = [
    {
      step: "1",
      title: "Select & Fill",
      description: "Select a category and fill in your listing details",
    },
    {
      step: "2",
      title: "Set Location",
      description: "Pick your preferred location settings",
    },
    {
      step: "3",
      title: "Go Live",
      description: "Hit post — it goes live immediately",
    },
  ];

  const browsingSteps = [
    {
      step: "1",
      title: "Search Smart",
      description: "Search by location, category, or keyword",
    },
    {
      step: "2",
      title: "Filter Perfect",
      description: "Refine with radius or filters if needed",
    },
    {
      step: "3",
      title: "Connect Direct",
      description: "Connect directly with the poster via chat",
    },
  ];

  const whoItHelps = [
    {
      icon: GraduationCap,
      text: "Students looking for roommates",
      color: "text-purple-600",
    },
    {
      icon: Building,
      text: "Professionals relocating for jobs",
      color: "text-blue-600",
    },
    {
      icon: Users,
      text: "Families offering or finding local help",
      color: "text-green-600",
    },
    {
      icon: Car,
      text: "Ride-sharers looking to split miles",
      color: "text-orange-600",
    },
    {
      icon: Briefcase,
      text: "Small business owners offering services",
      color: "text-red-600",
    },
    {
      icon: Heart,
      text: "Anyone who prefers a desi-first local platform",
      color: "text-pink-600",
    },
  ];



  return (
    <div className="max-w-3xl mx-auto  bg-white min-h-[calc(100vh-110px)]">
      <div>
        {/* Old Code */}
        {/* <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            Connecting the South Asian Community Abroad
          </h2>
          <p className="text-gray-700 mb-4">
            Desieasy is a community-powered marketplace built to help South
            Asians living abroad feel more connected and at home. Whether you're
            new to a city or just looking to connect with others in the local
            Desi network, our platform makes it easy to find housing, buy and
            sell items, discover job opportunities, and share rides — all within
            a culturally familiar space.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            Built by the Community, for the Community
          </h2>
          <p className="text-gray-700 mb-4">
            At DesiEasy, we believe in the power of connection. We don't offer
            services ourselves; we create the platform where you and your fellow
            community members can come together, support one another, and share
            what you need. It's a space for Desis to help Desis — whether it's
            finding a roommate, getting a ride, or sharing a job opportunity.
            It's simple, easy to use, and designed for anyone, anywhere — so you
            can always be a part of your community, no matter where life takes
            you.
          </p>
        </section>

        <section className="mb-8"></section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="text-gray-700">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <p className="text-gray-700 mt-2">
            Email:{" "}
            <a
              href="mailto:support@desieasy.com"
              className="text-brand hover:underline"
            >
              support@desieasy.com
            </a>
          </p>
        </section>
        <div className="mt-10">
          <div className="flex  gap-2">
            <p
              onClick={() => navigate("/privacy-policy")}
              className="text-xs text-gray-500 hover:underline cursor-pointer"
            >
              Privacy Policy
            </p>
            <p
              onClick={() => navigate("/user-agreement")}
              className="text-xs text-gray-500 hover:underline cursor-pointer"
            >
              User Agreement
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Desieasy © 2025. All rights reserved.
          </p>
        </div> */}

        {/* ========================== New Code ========================== */}

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${heroAbstract})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/60"></div>

          <div className="relative z-[1px] text-center px-4 sm:px-6 md:px-8 w-full ">
            <h1 className="text-6xl sm:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Discover
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Desieasy
              </span>
            </h1>

            <p className="text-lg sm:text-xl  mb-8 sm:mb-10 md:mb-12 leading-relaxed text-white/90 px-2 lg:px-4 xl:px-2">
              Whether you're looking for accommodation, a ride, a job, or local
              services, Desieasy makes it easy for South Asians in the U.S. to
              post and find listings that matter — simple, local, and free.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 lg:px-4 xl:px-2 w-full">
              <Button
                size="lg"
                onClick={handlePostListing}
                className="text-base sm:text-lg px-6 sm:px-8 md:px-10 lg:px-7 xl:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Post a Listing
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleBrowseListings}
                className="text-base sm:text-lg px-6 sm:px-8 md:px-10 lg:px-7 xl:px-10 py-3 sm:py-4 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white hover:text-white transform hover:scale-105 transition-all duration-300"
              >
                <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Explore Listings
              </Button>
            </div>
          </div>
        </section>

        {/* Why Desieasy Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-background via-background to-accent/5">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 flex items-center justify-center">
                <span>Why</span>
                <img
                  src="/lovable-uploads/734bcb13-cbaa-4ead-b63a-d6fa46648627.png"
                  alt="DesiEasy Logo"
                  className="h-14 sm:h-20 lg:h-24"
                />
              </h2>
              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-4 xl:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="relative bg-gradient-to-br from-card via-card to-card/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 h-full overflow-hidden">
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4 sm:mb-6 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                        <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 sm:mt-16">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                And it's all <span className="text-primary">free</span>.
              </p>
            </div>
          </div>
        </section>

        {/* What You Can Post Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-accent/5 via-background to-background">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                What You Can Post
              </h2>
              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto">
              {categories.map((category, index) => (
                <div key={index} className="group">
                  <div className="relative bg-gradient-to-br from-card to-card/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-3 h-full overflow-hidden">
                    {/* Animated background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    ></div>

                    <div className="relative z-10">
                      <div
                        className={`bg-gradient-to-br ${category.gradient} rounded-xl sm:rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      >
                        <category.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center justify-center text-center w-full">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-accent/5 via-background to-primary/5">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                How It Works
              </h2>
              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
              {/* For Posting */}
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center mb-8 sm:mb-12">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    For Posting
                  </h3>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {postingSteps.map((step, index) => (
                    <div key={index}>
                      <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-border/50 xl:h-[160px]">
                        <div className="flex items-center space-x-4 sm:space-x-6">
                          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg sm:text-xl">
                              {step.step}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">
                              {step.title}
                            </h4>
                            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* For Browsing */}
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center mb-8 sm:mb-12">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Search className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    For Browsing
                  </h3>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {browsingSteps.map((step, index) => (
                    <div key={index}>
                      <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-border/50 xl:h-[160px]">
                        <div className="flex items-center space-x-4 sm:space-x-6">
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg sm:text-xl">
                              {step.step}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">
                              {step.title}
                            </h4>
                            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who It Helps Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-background via-accent/5 to-background">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                Who It Helps
              </h2>
              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {whoItHelps.map((item, index) => (
                <div key={index} className="group">
                  <div className="relative bg-gradient-to-br from-card to-card/80 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                        <item.icon
                          className={`h-6 w-6 sm:h-8 sm:w-8 ${item.color} group-hover:scale-110 transition-transform duration-300`}
                        />
                      </div>
                      <p className="text-foreground font-medium leading-relaxed text-sm sm:text-base">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Your Local Community Platform
              </h2>
              <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            </div>

            <div className="text-foreground/80 leading-relaxed space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg max-w-4xl mx-auto">
              <p>
                Desieasy is a community listings platform created for South
                Asians living in the United States. Whether you're in Dallas,
                Jersey City, Fremont, Edison, Irving, or any other U.S. city
                with a thriving desi community, Desieasy helps you stay locally
                connected with ease.
              </p>
              <p>
                Users can find Indian roommates in the USA, explore desi
                rideshares, buy or sell items, share job openings, or offer
                local services — all through a location + radius-based search
                that keeps everything relevant and hyperlocal.
              </p>
              <p>
                From renting out a room, to hiring help for a small business, to
                sharing a ride, Desieasy is where desis connect and help each
                other — a simple collaboration platform.
              </p>
              <p>
                We don't control the listings — you do. Our goal is to keep the
                platform community-driven, location-based, and completely free
                for all desis in the U.S.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                Contact Us
              </h2>
              <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full mb-8 sm:mb-12"></div>

              <div className="bg-gradient-to-br from-card to-card/80 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-base sm:text-lg">
                  Have questions or suggestions? We'd love to hear from you!
                </p>
                <p className="text-foreground text-lg sm:text-xl">
                  Email:{" "}
                  <a
                    href="mailto:support@desieasy.com"
                    className="text-primary hover:underline transition-colors"
                  >
                    support@desieasy.com
                  </a>
                </p>
              </div>

              {/* CTA Button */}
              <div className="mt-8 sm:mt-12">
                <Button
                  size="lg"
                  onClick={handleBrowseListings}
                  className="text-base sm:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Explore Listings
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <AboutFooter />
      </div>
    </div>
  );
};
export default AboutUs;
