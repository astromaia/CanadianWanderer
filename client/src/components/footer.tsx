import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-xl mb-4">Canadian Explorer</h3>
            <p className="text-neutral-light">Your perfect Canadian itinerary generator for unforgettable adventures.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Popular Destinations</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-light hover:text-white transition-colors">Toronto</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white transition-colors">Vancouver</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white transition-colors">Montreal</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white transition-colors">Quebec City</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-light hover:text-white transition-colors">Travel Tips</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white transition-colors">COVID-19 Updates</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white transition-colors">About Canada</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="text-neutral-light">Subscribe to our newsletter for travel updates and special offers.</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-dark text-center text-neutral-light">
          <p>&copy; {new Date().getFullYear()} Canadian Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
