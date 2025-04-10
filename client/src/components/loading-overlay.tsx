import { Progress } from "@/components/ui/progress";
import { formatCityName } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingOverlayProps {
  isOpen: boolean;
  progress: number;
  cityName: string;
  isAI?: boolean;
}

export default function LoadingOverlay({ 
  isOpen, 
  progress,
  cityName,
  isAI = false
}: LoadingOverlayProps) {
  const [statusMessage, setStatusMessage] = useState("Initializing itinerary generation...");
  
  // Format city name for display
  const formattedCityName = cityName ? formatCityName(cityName) : 'your destination';
  
  // Update status message based on progress and city
  useEffect(() => {
    if (isAI) {
      if (progress < 20) {
        setStatusMessage(`Analyzing ${formattedCityName}'s attractions and local favorites...`);
      } else if (progress < 40) {
        setStatusMessage(`Finding the best activities in ${formattedCityName}...`);
      } else if (progress < 60) {
        setStatusMessage(`Creating your day-by-day ${formattedCityName} adventure...`);
      } else if (progress < 80) {
        setStatusMessage(`Optimizing your route through ${formattedCityName}...`);
      } else if (progress < 95) {
        setStatusMessage(`Adding insider tips for ${formattedCityName}...`);
      } else {
        setStatusMessage(`Finalizing your personalized ${formattedCityName} itinerary...`);
      }
    } else {
      if (progress < 30) {
        setStatusMessage(`Loading ${formattedCityName} highlights...`);
      } else if (progress < 60) {
        setStatusMessage(`Preparing your ${formattedCityName} schedule...`);
      } else if (progress < 90) {
        setStatusMessage(`Gathering the best of ${formattedCityName}...`);
      } else {
        setStatusMessage(`Almost ready for your ${formattedCityName} adventure!`);
      }
    }
  }, [progress, isAI, formattedCityName]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            {isAI ? (
              <div className="relative">
                <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-secondary animate-pulse" />
              </div>
            ) : (
              <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
          <h2 className="font-semibold text-xl text-primary mb-2 text-center">Creating Your Perfect Itinerary</h2>
          <p className="text-neutral-dark text-center">
            We're curating the best experiences for your {formattedCityName} adventure!
          </p>
          {isAI && (
            <p className="mt-2 flex items-center justify-center text-sm text-secondary">
              <Sparkles className="h-4 w-4 mr-1" />
              Using AI to personalize your trip
            </p>
          )}
          <div className="w-full mt-4">
            <Progress value={progress} className="h-2" />
          </div>
          <p className="text-sm text-neutral-muted mt-3 text-center">{statusMessage}</p>
        </div>
      </div>
    </div>
  );
}