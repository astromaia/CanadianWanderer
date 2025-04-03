import { useState, useEffect } from "react";
import HeroSection from "@/components/hero-section";
import DestinationSection from "@/components/destination-section";
import ItinerarySection from "@/components/itinerary-section";
import LoadingOverlay from "@/components/loading-overlay";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import { useQuery } from "@tanstack/react-query";
import { simulateProgress } from "@/lib/utils";
import { CompleteItinerary } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [days, setDays] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [showItinerary, setShowItinerary] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [useAI, setUseAI] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Fetch cities for destination selection, with optional search query
  const { data: cities, refetch: refetchCities } = useQuery({
    queryKey: ['/api/cities', searchQuery],
    queryFn: async () => {
      const endpoint = searchQuery 
        ? `/api/cities?search=${encodeURIComponent(searchQuery)}` 
        : '/api/cities';
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      return response.json();
    },
  });
  
  // Fetch itinerary data when requested
  const { data: itinerary, refetch: refetchItinerary } = useQuery<CompleteItinerary>({
    queryKey: [`/api/itinerary`, selectedCity, days, useAI],
    queryFn: async () => {
      const endpoint = `/api/itinerary?city=${selectedCity}&days=${days}${useAI ? '&useAI=true' : ''}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate itinerary');
      }
      return response.json();
    },
    enabled: false,
  });
  
  // Handle search query changes with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        refetchCities();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, refetchCities]);
  
  // Handle itinerary generation
  const handleGenerateItinerary = async () => {
    if (!selectedCity) {
      toast({
        title: "Please select a city",
        description: "Choose a Canadian city from the list to generate an itinerary.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setLoadingProgress(0);
    
    try {
      // AI generation takes longer, so adjust the time accordingly
      const simulationTime = useAI ? 8000 : 3000;
      
      // Simulate progress while generating the itinerary
      await simulateProgress(setLoadingProgress, simulationTime);
      
      // Fetch itinerary data
      await refetchItinerary();
      setShowItinerary(true);
      
      // Scroll to itinerary section
      document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error: any) {
      toast({
        title: "Failed to generate itinerary",
        description: error.message || "Please try again or select a different city.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
        searchQuery={searchQuery}
        useAI={useAI}
        onCitySelect={setSelectedCity}
        onDaysChange={setDays}
        onSearchChange={setSearchQuery}
        onAIToggle={setUseAI}
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
        isAI={useAI}
      />
      
      <Footer />
    </div>
  );
}
