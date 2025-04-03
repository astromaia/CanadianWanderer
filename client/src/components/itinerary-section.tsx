import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  MapPin,
  DollarSign,
  Lightbulb,
  Download,
  Edit,
} from "lucide-react";
import { CompleteItinerary, ItineraryDay } from "@shared/schema";

interface ItinerarySectionProps {
  itinerary: CompleteItinerary;
  onEditItinerary: () => void;
}

export default function ItinerarySection({
  itinerary,
  onEditItinerary,
}: ItinerarySectionProps) {
  const [activeDay, setActiveDay] = useState<number>(1);

  // Find the currently active day data
  const currentDayData =
    itinerary.days.find((day) => day.dayNumber === activeDay) ||
    itinerary.days[0];

  return (
    <section id="itinerary" className="py-16 bg-neutral-lightest">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-semibold text-3xl md:text-4xl text-primary mb-2">
            Your <span className="text-black">{itinerary.city.name}</span>{" "}
            Itinerary
          </h2>
          <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
            We've created a {itinerary.days.length}-day adventure packed with
            the best experiences
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
                    ? "bg-primary text-white"
                    : "bg-white border-b-2 border-transparent hover:border-primary-light"
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
                  <CalendarDays className="mr-3 h-6 w-6" /> Day{" "}
                  {currentDayData.dayNumber}: {currentDayData.title}
                </h3>
              </div>

              <div className="p-6">
                {currentDayData.activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`mb-8 border-l-4 border-primary pl-4 ${
                      index === currentDayData.activities.length - 1
                        ? ""
                        : "pb-8"
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
                        <h4 className="font-semibold text-xl text-primary-dark mb-2">
                          {activity.title}
                        </h4>

                        {/* Activity with image */}
                        <div className="flex flex-col gap-4 mb-3">
                          <div className="w-full">
                            <p className="text-neutral-dark">
                              {activity.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {activity.location && (
                            <span className="bg-neutral-lightest px-3 py-1 rounded-full text-sm text-neutral-dark flex items-center">
                              <MapPin className="text-primary-light h-3 w-3 mr-1" />{" "}
                              {activity.location}
                            </span>
                          )}
                          {activity.cost && (
                            <span className="bg-neutral-lightest px-3 py-1 rounded-full text-sm text-neutral-dark flex items-center">
                              <DollarSign className="text-primary-light h-3 w-3 mr-1" />{" "}
                              {activity.cost}
                            </span>
                          )}
                        </div>
                        {activity.tipTitle && activity.tipDescription && (
                          <div className="bg-neutral-lightest rounded-lg p-4 text-sm text-neutral-dark">
                            <p className="font-medium mb-2 flex items-center">
                              <Lightbulb className="text-accent h-4 w-4 mr-2" />{" "}
                              {activity.tipTitle}
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
            className="bg-[#000080] hover:bg-[#000066] text-white mr-4"
            onClick={() => window.print()}
          >
            <Download className="mr-2 h-4 w-4" /> Download Itinerary
          </Button>
          <Button
            variant="default"
            className="bg-[#000080] hover:bg-[#000066] text-white"
            onClick={onEditItinerary}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Itinerary
          </Button>
        </div>
      </div>
    </section>
  );
}
