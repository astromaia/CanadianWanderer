import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin } from "lucide-react";

export default function HeroSection() {
  const scrollToDestinations = () => {
    document
      .getElementById("destinations")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>

      {/* Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 pt-16">
        <h1 className="font-serif text-4xl md:text-6xl text-white text-center mb-6 leading-tight">
          Discover the Beauty of{" "}
          <span className="text-accent-light">Canada</span>
        </h1>
        <p className="text-xl md:text-2xl text-white text-center mb-10 max-w-2xl">
          Create a personalized travel itinerary for your Canadian adventure
        </p>
        <Button
          onClick={scrollToDestinations}
          className="bg-secondary hover:bg-secondary-dark text-black font-semibold py-3 px-8 rounded-full"
          size="lg"
        >
          Get Started <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Visual map pin indicators scattered across the hero */}
      <div className="absolute top-1/4 left-1/4 text-white/40 animate-pulse">
        <MapPin className="h-8 w-8" />
      </div>
      <div
        className="absolute top-1/3 right-1/4 text-white/30 animate-pulse"
        style={{ animationDelay: "1s" }}
      >
        <MapPin className="h-6 w-6" />
      </div>
      <div
        className="absolute bottom-1/4 left-1/3 text-white/20 animate-pulse"
        style={{ animationDelay: "1.5s" }}
      >
        <MapPin className="h-7 w-7" />
      </div>
    </section>
  );
}
