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
  searchQuery?: string;
  useAI?: boolean;
  onCitySelect: (city: string) => void;
  onDaysChange: (days: number) => void;
  onSearchChange?: (query: string) => void;
  onAIToggle?: (useAI: boolean) => void;
  onGenerateItinerary: () => void;
}

export default function DestinationSection({
  cities,
  selectedCity,
  days,
  searchQuery = "",
  useAI = true,
  onCitySelect,
  onDaysChange,
  onSearchChange,
  onAIToggle,
  onGenerateItinerary
}: DestinationSectionProps) {
  const handleCityCardClick = (slug: string) => {
    onCitySelect(slug);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

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
        
        {/* Search box */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search for a Canadian city or attraction..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="ps-10 py-6"
          />
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
                  className="h-56 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${city.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white text-2xl">{city.name}</h3>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-neutral-dark">{city.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <h3 className="text-xl font-medium text-neutral-dark mb-2">No destinations found</h3>
              <p className="text-neutral-muted">Try another search term or browse all Canadian cities</p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => onSearchChange?.("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Destination Selection Form */}
        <div className="bg-neutral-lightest rounded-xl p-6 shadow-md max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-full md:w-1/2">
              <label htmlFor="selected-destination" className="block text-neutral-dark font-medium mb-2">Selected Destination</label>
              <Select value={selectedCity} onValueChange={onCitySelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.slug}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/2">
              <label htmlFor="trip-duration" className="block text-neutral-dark font-medium mb-2">Number of Days</label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDaysDecrease}
                  disabled={days <= 1}
                  className="rounded-r-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-full text-center py-3 px-4 border-t border-b border-neutral-light">
                  {days} {days === 1 ? 'Day' : 'Days'}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDaysIncrease}
                  disabled={days >= 7}
                  className="rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
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
          
          <div className="mt-4 text-center">
            <Button 
              onClick={onGenerateItinerary} 
              disabled={!selectedCity}
              className="bg-secondary hover:bg-secondary-dark text-white"
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
