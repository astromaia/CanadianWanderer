import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  DollarSign, 
  Lightbulb,
  Download,
  Edit
} from "lucide-react";
import { CompleteItinerary, ItineraryDay } from "@shared/schema";

interface ItinerarySectionProps {
  itinerary: CompleteItinerary;
  onEditItinerary: () => void;
}

export default function ItinerarySection({ 
  itinerary,
  onEditItinerary 
}: ItinerarySectionProps) {
  const [activeDay, setActiveDay] = useState<number>(1);
  
  // Find the currently active day data
  const currentDayData = itinerary.days.find(day => day.dayNumber === activeDay) || itinerary.days[0];
  
  return (
    <section id="itinerary" className="py-16 bg-neutral-lightest">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-semibold text-3xl md:text-4xl text-primary mb-2">
            Your <span className="text-secondary">{itinerary.city.name}</span> Itinerary
          </h2>
          <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
            We've created a {itinerary.days.length}-day adventure packed with the best experiences
          </p>
        </div>
        
        {/* Itinerary Navigation */}
        <div className="max-w-4xl mx-auto mb-6 overflow-x-auto custom-scrollbar">
          <div className="flex space-x-2 min-w-max">
            {itinerary.days.map((day) => (
              <button
                key={day.dayNumber}
                className={`py-2 px-6 rounded-t-lg font-medium transition-colors duration-200 ${
                  activeDay === day.dayNumber
                    ? 'bg-primary text-white'
                    : 'bg-white border-b-2 border-transparent hover:border-primary-light'
                }`}
                onClick={() => setActiveDay(day.dayNumber)}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>
        </div>
        
        {/* Itinerary Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {currentDayData && (
            <div>
              <div className="bg-primary p-6">
                <h3 className="font-semibold text-white text-2xl flex items-center">
                  <CalendarDays className="mr-3 h-6 w-6" /> Day {currentDayData.dayNumber}: {currentDayData.title}
                </h3>
              </div>
              
              <div className="p-6">
                {currentDayData.activities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className={`mb-8 border-l-4 border-primary pl-4 ${
                      index === currentDayData.activities.length - 1 ? '' : 'pb-8'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="bg-primary-light text-white rounded-full p-2 mr-4 mt-1">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="w-full">
                        <div className="flex items-center mb-2">
                          <span className="text-neutral-medium text-sm font-medium">
                            {activity.startTime} - {activity.endTime}
                          </span>
                          <span className="ml-3 bg-accent-light text-primary text-xs py-1 px-2 rounded-full">
                            {activity.duration}
                          </span>
                        </div>
                        <h4 className="font-semibold text-xl text-primary-dark mb-2">{activity.title}</h4>
                        
                        {/* Activity with image */}
                        <div className="flex flex-col md:flex-row gap-4 mb-3">
                          {/* Add image based on activity title keywords */}
                          {/* Landmarks & Attractions */}
                          {(activity.title.toLowerCase().includes('cn tower') || 
                            activity.title.toLowerCase().includes('landmark') ||
                            activity.title.toLowerCase().includes('attraction') ||
                            activity.title.toLowerCase().includes('view') ||
                            activity.title.toLowerCase().includes('tower') ||
                            activity.title.toLowerCase().includes('monument')) && (
                            <div className="w-full md:w-1/3 h-40 rounded-lg overflow-hidden shadow-md">
                              <img 
                                src="https://images.unsplash.com/photo-1503556567555-53e8b1705c19?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                                alt="Landmark" 
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                              />
                            </div>
                          )}
                          
                          {/* Outdoor & Nature */}
                          {(activity.title.toLowerCase().includes('park') || 
                            activity.title.toLowerCase().includes('nature') ||
                            activity.title.toLowerCase().includes('outdoor') ||
                            activity.title.toLowerCase().includes('garden') ||
                            activity.title.toLowerCase().includes('hike') ||
                            activity.title.toLowerCase().includes('trail') ||
                            activity.title.toLowerCase().includes('walk')) && (
                            <div className="w-full md:w-1/3 h-40 rounded-lg overflow-hidden shadow-md">
                              <img 
                                src="https://images.unsplash.com/photo-1610400906066-4380a165db9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                                alt="Nature" 
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                              />
                            </div>
                          )}
                          
                          {/* Museums & Galleries */}
                          {(activity.title.toLowerCase().includes('museum') || 
                            activity.title.toLowerCase().includes('gallery') ||
                            activity.title.toLowerCase().includes('art') ||
                            activity.title.toLowerCase().includes('exhibit') ||
                            activity.title.toLowerCase().includes('collection') ||
                            activity.title.toLowerCase().includes('historic') ||
                            activity.title.toLowerCase().includes('heritage')) && (
                            <div className="w-full md:w-1/3 h-40 rounded-lg overflow-hidden shadow-md">
                              <img 
                                src="https://images.unsplash.com/photo-1553522399-ce7533c598c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                                alt="Museum" 
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                              />
                            </div>
                          )}
                          
                          {/* Food & Dining */}
                          {(activity.title.toLowerCase().includes('dinner') || 
                            activity.title.toLowerCase().includes('lunch') ||
                            activity.title.toLowerCase().includes('breakfast') ||
                            activity.title.toLowerCase().includes('restaurant') ||
                            activity.title.toLowerCase().includes('food') ||
                            activity.title.toLowerCase().includes('café') ||
                            activity.title.toLowerCase().includes('cafe') ||
                            activity.title.toLowerCase().includes('eatery') ||
                            activity.title.toLowerCase().includes('cuisine') ||
                            activity.title.toLowerCase().includes('bistro') ||
                            activity.title.toLowerCase().includes('bar') ||
                            activity.title.toLowerCase().includes('pub') ||
                            activity.title.toLowerCase().includes('dining')) && (
                            <div className="w-full md:w-1/3 h-40 rounded-lg overflow-hidden shadow-md">
                              <img 
                                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                                alt="Restaurant" 
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                              />
                            </div>
                          )}
                          
                          {/* Shopping & Markets */}
                          {(activity.title.toLowerCase().includes('shopping') || 
                            activity.title.toLowerCase().includes('market') ||
                            activity.title.toLowerCase().includes('store') ||
                            activity.title.toLowerCase().includes('shop') ||
                            activity.title.toLowerCase().includes('mall') ||
                            activity.title.toLowerCase().includes('boutique') ||
                            activity.title.toLowerCase().includes('vendor')) && (
                            <div className="w-full md:w-1/3 h-40 rounded-lg overflow-hidden shadow-md">
                              <img 
                                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                                alt="Market" 
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                              />
                            </div>
                          )}
                          
                          {/* Entertainment & Nightlife */}
                          {(activity.title.toLowerCase().includes('entertainment') || 
                            activity.title.toLowerCase().includes('show') ||
                            activity.title.toLowerCase().includes('concert') ||
                            activity.title.toLowerCase().includes('theater') ||
                            activity.title.toLowerCase().includes('theatre') ||
                            activity.title.toLowerCase().includes('cinema') ||
                            activity.title.toLowerCase().includes('nightlife') ||
                            activity.title.toLowerCase().includes('club')) && (
                            <div className="w-full md:w-1/3 h-40 rounded-lg overflow-hidden shadow-md">
                              <img 
                                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                                alt="Entertainment" 
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                              />
                            </div>
                          )}
                          
                          <div className={`${(activity.title.toLowerCase().includes('cn tower') || 
                                          activity.title.toLowerCase().includes('landmark') ||
                                          activity.title.toLowerCase().includes('attraction') ||
                                          activity.title.toLowerCase().includes('view') ||
                                          activity.title.toLowerCase().includes('tower') ||
                                          activity.title.toLowerCase().includes('monument') ||
                                          activity.title.toLowerCase().includes('park') || 
                                          activity.title.toLowerCase().includes('nature') ||
                                          activity.title.toLowerCase().includes('outdoor') ||
                                          activity.title.toLowerCase().includes('garden') ||
                                          activity.title.toLowerCase().includes('hike') ||
                                          activity.title.toLowerCase().includes('trail') ||
                                          activity.title.toLowerCase().includes('walk') ||
                                          activity.title.toLowerCase().includes('museum') || 
                                          activity.title.toLowerCase().includes('gallery') ||
                                          activity.title.toLowerCase().includes('art') ||
                                          activity.title.toLowerCase().includes('exhibit') ||
                                          activity.title.toLowerCase().includes('collection') ||
                                          activity.title.toLowerCase().includes('historic') ||
                                          activity.title.toLowerCase().includes('heritage') ||
                                          activity.title.toLowerCase().includes('dinner') || 
                                          activity.title.toLowerCase().includes('lunch') ||
                                          activity.title.toLowerCase().includes('breakfast') ||
                                          activity.title.toLowerCase().includes('restaurant') ||
                                          activity.title.toLowerCase().includes('food') ||
                                          activity.title.toLowerCase().includes('café') ||
                                          activity.title.toLowerCase().includes('cafe') ||
                                          activity.title.toLowerCase().includes('eatery') ||
                                          activity.title.toLowerCase().includes('cuisine') ||
                                          activity.title.toLowerCase().includes('bistro') ||
                                          activity.title.toLowerCase().includes('bar') ||
                                          activity.title.toLowerCase().includes('pub') ||
                                          activity.title.toLowerCase().includes('dining') ||
                                          activity.title.toLowerCase().includes('shopping') || 
                                          activity.title.toLowerCase().includes('market') ||
                                          activity.title.toLowerCase().includes('store') ||
                                          activity.title.toLowerCase().includes('shop') ||
                                          activity.title.toLowerCase().includes('mall') ||
                                          activity.title.toLowerCase().includes('boutique') ||
                                          activity.title.toLowerCase().includes('vendor') ||
                                          activity.title.toLowerCase().includes('entertainment') || 
                                          activity.title.toLowerCase().includes('show') ||
                                          activity.title.toLowerCase().includes('concert') ||
                                          activity.title.toLowerCase().includes('theater') ||
                                          activity.title.toLowerCase().includes('theatre') ||
                                          activity.title.toLowerCase().includes('cinema') ||
                                          activity.title.toLowerCase().includes('nightlife') ||
                                          activity.title.toLowerCase().includes('club')
                                          ) ? 'w-full md:w-2/3' : 'w-full'}`}>
                            <p className="text-neutral-dark">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {activity.location && (
                            <span className="bg-neutral-lightest px-3 py-1 rounded-full text-sm text-neutral-dark flex items-center">
                              <MapPin className="text-primary-light h-3 w-3 mr-1" /> {activity.location}
                            </span>
                          )}
                          {activity.cost && (
                            <span className="bg-neutral-lightest px-3 py-1 rounded-full text-sm text-neutral-dark flex items-center">
                              <DollarSign className="text-primary-light h-3 w-3 mr-1" /> {activity.cost}
                            </span>
                          )}
                        </div>
                        {activity.tipTitle && activity.tipDescription && (
                          <div className="bg-neutral-lightest rounded-lg p-4 text-sm text-neutral-dark">
                            <p className="font-medium mb-2 flex items-center">
                              <Lightbulb className="text-accent h-4 w-4 mr-2" /> {activity.tipTitle}
                            </p>
                            <p>{activity.tipDescription}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="mt-8 text-center">
          <Button 
            className="bg-primary hover:bg-primary-dark text-white mr-4"
            onClick={() => window.print()}
          >
            <Download className="mr-2 h-4 w-4" /> Download Itinerary
          </Button>
          <Button 
            variant="default"
            className="bg-primary hover:bg-primary-dark text-white"
            onClick={onEditItinerary}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Itinerary
          </Button>
        </div>
      </div>
    </section>
  );
}
