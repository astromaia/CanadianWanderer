import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Minus, Search, Sparkles } from "lucide-react";
import { formatCityName } from "@/lib/utils";
import type { City } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DestinationSectionProps {
  cities: City[];
  selectedCity: string;
  days: number;
  useAI?: boolean;
  onCitySelect: (city: string) => void;
  onDaysChange: (days: number) => void;
  onAIToggle?: (useAI: boolean) => void;
  onGenerateItinerary: () => void;
  allCities?: City[];  // Full list of all cities for the dropdown
}

export default function DestinationSection({
  cities,
  selectedCity,
  days,
  useAI = true,
  onCitySelect,
  onDaysChange,
  onAIToggle,
  onGenerateItinerary,
  allCities
}: DestinationSectionProps) {
  const handleCityCardClick = (slug: string) => {
    onCitySelect(slug);
    
    // Scroll to the trip duration section
    setTimeout(() => {
      document.getElementById('travel-duration')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center' 
      });
    }, 100);
  };
  
  const handleDaysDecrease = () => {
    if (days > 1) {
      onDaysChange(days - 1);
    }
  };
  
  const handleDaysIncrease = () => {
    if (days < 7) {
      onDaysChange(days + 1);
    }
  };

  // No search functionality with dropdown menu

  const handleAIToggle = (checked: boolean) => {
    if (onAIToggle) {
      onAIToggle(checked);
    }
  };

  return (
    <section id="destinations" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-semibold text-3xl md:text-4xl text-primary mb-4">Choose Your Destination</h2>
          <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
            Select a Canadian city to explore and we'll create the perfect itinerary for your trip
          </p>
        </div>
        
        {/* Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cities.length > 0 ? (
            cities.map((city) => (
              <div 
                key={city.id}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group relative ${
                  selectedCity === city.slug ? 'ring-2 ring-secondary' : ''
                }`}
                onClick={() => handleCityCardClick(city.slug)}
              >
                <div 
                  className="h-64 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${city.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70 group-hover:from-black/5 group-hover:to-black/60 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white text-2xl drop-shadow-md">{city.name}</h3>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-neutral-dark mb-3">{city.description}</p>
                  <h4 className="font-medium text-primary text-sm mb-2">Top 5 Attractions:</h4>
                  <ul className="text-sm text-neutral-dark space-y-1">
                    {city.slug === 'toronto' && (
                      <>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>CN Tower</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Royal Ontario Museum</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Ripley's Aquarium</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Toronto Islands</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Distillery District</li>
                      </>
                    )}
                    {city.slug === 'vancouver' && (
                      <>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Stanley Park</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Granville Island</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Capilano Suspension Bridge</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Gastown</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Grouse Mountain</li>
                      </>
                    )}
                    {city.slug === 'montreal' && (
                      <>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Old Montreal</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Mount Royal Park</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Notre-Dame Basilica</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Montreal Biodome</li>
                        <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-primary mr-2"></span>Jean-Talon Market</li>
                      </>
                    )}
                  </ul>
                  <div className="mt-4">
                    <Button
                      variant="default"
                      onClick={() => handleCityCardClick(city.slug)}
                      className="w-full text-white bg-[#000080] hover:bg-[#000066]"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <h3 className="text-xl font-medium text-neutral-dark mb-2">No destinations found</h3>
              <p className="text-neutral-muted">Please select a city from the dropdown menu below</p>
            </div>
          )}
        </div>
        
        {/* Destination Selection Form */}
        <div className="bg-neutral-lightest rounded-xl p-6 shadow-md max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-full md:w-1/2">
              <label htmlFor="selected-destination" className="block text-neutral-dark font-medium mb-2">Select Your Destination</label>
              <div className="relative">
                <Select
                  value={selectedCity || ""}
                  onValueChange={(value) => onCitySelect(value)}
                >
                  <SelectTrigger className="w-full py-6">
                    <SelectValue placeholder="Choose a Canadian city" />
                  </SelectTrigger>
                  <SelectContent>
                    {(allCities || cities)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((city) => (
                        <SelectItem key={city.id} value={city.slug}>
                          {city.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="w-full md:w-1/2" id="travel-duration">
              <div className={`transition-all duration-300 ${selectedCity ? 'bg-blue-50 p-4 rounded-lg border border-blue-100' : ''}`}>
                {selectedCity && (
                  <div className="mb-3 text-center">
                    <p className="text-primary font-medium">How many days are you travelling?</p>
                  </div>
                )}
                <label htmlFor="trip-duration" className="block text-neutral-dark font-medium mb-2">Number of Days</label>
                <div className="flex items-center">
                  <Button 
                    variant="default" 
                    size="icon" 
                    onClick={handleDaysDecrease}
                    disabled={days <= 1}
                    className="rounded-r-none bg-[#000080] text-white hover:bg-[#000066]"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-full text-center py-3 px-4 border-t border-b border-neutral-light">
                    {days} {days === 1 ? 'Day' : 'Days'}
                  </div>
                  <Button 
                    variant="default" 
                    size="icon" 
                    onClick={handleDaysIncrease}
                    disabled={days >= 7}
                    className="rounded-l-none bg-[#000080] text-white hover:bg-[#000066]"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Toggle */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Label htmlFor="ai-toggle" className="flex items-center cursor-pointer">
              <Sparkles className="h-4 w-4 text-secondary mr-2" />
              <span>Use AI for personalized itinerary</span>
            </Label>
            <Switch
              id="ai-toggle"
              checked={useAI}
              onCheckedChange={handleAIToggle}
            />
          </div>
          {useAI && (
            <div className="mt-2 text-center text-sm text-gray-600">
              AI generates unique, tailored itineraries for your trip
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Button 
              onClick={onGenerateItinerary} 
              disabled={!selectedCity}
              className="bg-[#000080] hover:bg-[#000066] text-white"
              size="lg"
            >
              <Calendar className="mr-2 h-5 w-5" /> Generate Itinerary
            </Button>
            {useAI && (
              <p className="text-sm text-neutral-muted mt-2">
                Using AI to create a custom itinerary with the latest information
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
