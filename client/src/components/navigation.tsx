import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-primary shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <MapPin className="text-white h-6 w-6 mr-3" />
          <h1 className="font-semibold text-white text-xl md:text-2xl">Canadian Explorer</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-white hover:text-accent-light transition-colors duration-200">Home</a>
          <a href="#destinations" className="text-white hover:text-accent-light transition-colors duration-200">Destinations</a>
          <a href="#itinerary" className="text-white hover:text-accent-light transition-colors duration-200">Itinerary</a>
          <a href="#" className="text-white hover:text-accent-light transition-colors duration-200">About</a>
        </nav>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-primary-dark absolute w-full transition-all duration-300 ease-in-out", 
        mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <a 
            href="#" 
            className="text-white hover:text-accent-light transition-colors duration-200 py-2 border-b border-primary-light"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>
          <a 
            href="#destinations" 
            className="text-white hover:text-accent-light transition-colors duration-200 py-2 border-b border-primary-light"
            onClick={() => setMobileMenuOpen(false)}
          >
            Destinations
          </a>
          <a 
            href="#itinerary" 
            className="text-white hover:text-accent-light transition-colors duration-200 py-2 border-b border-primary-light"
            onClick={() => setMobileMenuOpen(false)}
          >
            Itinerary
          </a>
          <a 
            href="#" 
            className="text-white hover:text-accent-light transition-colors duration-200 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
        </div>
      </div>
    </header>
  );
}
