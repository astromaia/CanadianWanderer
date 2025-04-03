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
  
  // State for storing the itinerary
  const [itinerary, setItinerary] = useState<CompleteItinerary | null>(null);
  
  // Fetch itinerary data when requested
  const { refetch: refetchItinerary } = useQuery<CompleteItinerary>({
    queryKey: [`/api/itinerary`, selectedCity, days, useAI],
    queryFn: async () => {
      const endpoint = `/api/itinerary?city=${selectedCity}&days=${days}${useAI ? '&useAI=true' : ''}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate itinerary');
      }
      const data = await response.json();
      setItinerary(data);
      return data;
    },
    enabled: false
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
  
  // Flag to track if we should skip AI generation due to quota issues
  const [skipAI, setSkipAI] = useState<boolean>(false);
  
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
      const simulationTime = useAI && !skipAI ? 8000 : 3000;
      
      // Simulate progress while generating the itinerary
      await simulateProgress(setLoadingProgress, simulationTime);
      
      // Prepare the endpoint with proper flags
      const endpoint = `/api/itinerary?city=${selectedCity}&days=${days}${
        useAI && !skipAI ? '&useAI=true' : ''
      }${skipAI ? '&skipAI=true' : ''}`;
      
      // Manual fetch to better handle errors
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Check if this is a quota error
        if (response.status === 429 || (errorData.error && errorData.error.includes('quota'))) {
          setSkipAI(true); // Mark to skip AI for future requests
          
          toast({
            title: "AI Service at Capacity",
            description: "We're using pre-built itineraries instead. You can still enjoy great travel recommendations!",
            variant: "default"
          });
          
          // Try again immediately with skipAI=true
          const fallbackResponse = await fetch(`/api/itinerary?city=${selectedCity}&days=${days}&skipAI=true`);
          
          if (!fallbackResponse.ok) {
            throw new Error("Failed to load pre-built itinerary");
          }
          
          const data = await fallbackResponse.json();
          setItinerary(data);
          setShowItinerary(true);
        } else {
          throw new Error(errorData.message || "Failed to generate itinerary");
        }
      } else {
        const data = await response.json();
        
        // Check if we got a fallback response
        if (data._fallback) {
          toast({
            title: "Using Pre-built Itinerary",
            description: data._fallbackReason || "AI-generated content unavailable",
            variant: "default"
          });
          setSkipAI(true);
        }
        
        setItinerary(data);
        setShowItinerary(true);
      }
      
      // Scroll to itinerary section
      document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error: any) {
      console.error("Error generating itinerary:", error);
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
