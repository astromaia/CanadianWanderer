import { Progress } from "@/components/ui/progress";
import { formatCityName } from "@/lib/utils";

interface LoadingOverlayProps {
  isOpen: boolean;
  progress: number;
  cityName: string;
}

export default function LoadingOverlay({ 
  isOpen, 
  progress,
  cityName
}: LoadingOverlayProps) {
  if (!isOpen) return null;
  
  const formattedCityName = cityName ? formatCityName(cityName) : 'your destination';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="font-semibold text-xl text-primary mb-2 text-center">Creating Your Perfect Itinerary</h2>
          <p className="text-neutral-dark text-center">We're curating the best experiences for your {formattedCityName} adventure!</p>
          <div className="w-full mt-6">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
