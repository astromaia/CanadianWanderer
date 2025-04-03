import { useState } from "react";
import HeroSection from "@/components/hero-section";
import DestinationSection from "@/components/destination-section";
import ItinerarySection from "@/components/itinerary-section";
import LoadingOverlay from "@/components/loading-overlay";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import { useQuery } from "@tanstack/react-query";
import { simulateProgress } from "@/lib/utils";
import { CompleteItinerary } from "@shared/schema";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [days, setDays] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [showItinerary, setShowItinerary] = useState<boolean>(false);
  
  // Fetch cities for destination selection
  const { data: cities } = useQuery({
    queryKey: ['/api/cities'],
  });
  
  // Fetch itinerary data when requested
  const { data: itinerary, refetch: refetchItinerary } = useQuery<CompleteItinerary>({
    queryKey: [`/api/itinerary?city=${selectedCity}&days=${days}`],
    enabled: false,
  });
  
  // Handle itinerary generation
  const handleGenerateItinerary = async () => {
    if (!selectedCity) {
      // Show an error or notification to select a city
      return;
    }
    
    setLoading(true);
    setLoadingProgress(0);
    
    // Start progress simulation
    simulateProgress(setLoadingProgress, 3000)
      .then(async () => {
        // Fetch itinerary data
        await refetchItinerary();
        setLoading(false);
        setShowItinerary(true);
        
        // Scroll to itinerary section
        document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth' });
      });
  };
  
  // Handle itinerary edit (go back to destinations)
  const handleEditItinerary = () => {
    setShowItinerary(false);
    // Scroll back to destinations section
    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <HeroSection />
      
      <DestinationSection
        cities={cities || []}
        selectedCity={selectedCity}
        days={days}
        onCitySelect={setSelectedCity}
        onDaysChange={setDays}
        onGenerateItinerary={handleGenerateItinerary}
      />
      
      {showItinerary && itinerary && (
        <ItinerarySection
          itinerary={itinerary}
          onEditItinerary={handleEditItinerary}
        />
      )}
      
      <LoadingOverlay
        isOpen={loading}
        progress={loadingProgress}
        cityName={selectedCity}
      />
      
      <Footer />
    </div>
  );
}
