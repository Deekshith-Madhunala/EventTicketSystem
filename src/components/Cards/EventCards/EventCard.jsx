import React, { useState } from 'react';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { TicketIcon } from '@heroicons/react/24/solid';

const EventCard = ({ event, venue }) => {
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);  // For snackbar visibility

  // Determine if the card should be disabled based on the event type
  const isDisabled = () => {
    const ticketDetails = event?.ticketDetails[0];

    // Use case 1: Limited-Capacity Paid Event
    if (ticketDetails?.ticketPrice > 0 && ticketDetails?.ticketPriceDetails === "paid") {
      return ticketDetails?.ticketQuantity === 0;
    }

    // Use case 2: Limited-Capacity Free Event (requires registration)
    if (ticketDetails?.ticketPrice === 0 && ticketDetails?.ticketPriceDetails === "free") {
      return ticketDetails?.ticketQuantity === 0;
    }

    // Use case 3: Unlimited-Capacity Free Event (open to everyone)
    if (ticketDetails?.ticketPrice === 0 && ticketDetails?.ticketPriceDetails === "free" && ticketDetails?.ticketQuantity === undefined) {
      return false; // Always available for unlimited capacity events
    }

    return false; // Default, should never hit here
  };

  const handleClick = () => {
    if (isDisabled()) {
      // Show the snackbar when registration is closed
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);  // Hide snackbar after 3 seconds
      }, 3000);
    } else {
      // Navigate to event details if the card is not disabled
      navigate('/event-details', {
        state: { event, venue },
      });
    }
  };

  console.log("event data", event);

  return (
    <>
      <div
        onClick={handleClick}
        className={`cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full h-[500px] ${isDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <img
          className="w-full h-48 object-cover"
          src={event.eventPhotoUrl || "https://via.placeholder.com/300x200"}
          alt={event.eventName}
        />

        <div className="p-4 flex flex-col h-[calc(100%-12rem)] justify-between">
          <p className="text-gray-500">{venue?.venueName || "Unknown Venue"}</p>
          <p className="text-gray-900 text-2xl font-semibold">{event.eventName}</p>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span>{new Date(event.startDateTime).toLocaleString()}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPinIcon className="h-5 w-5 text-gray-500" />
              <span>{venue?.address || "TBD"}</span>
            </div>

            <div className="flex items-start gap-2">
              <TicketIcon className="h-5 w-5 text-gray-500" />
              <span>
                {
                  event?.ticketDetails[0]?.ticketPriceDetails === "free"
                    ? event?.ticketDetails[0]?.ticketQuantity
                      ? "Free and open to register"
                      : "Registrations closed"
                    : event?.ticketDetails[0]?.ticketQuantity
                      ? `${event.ticketDetails[0].ticketQuantity} tickets available for $${event.ticketDetails[0].ticketPrice} each`
                      : "Registrations closed"
                }
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent bubbling to div
              handleClick();
            }}
            className="flex items-start text-indigo-600 font-medium text-lg hover:underline"
          >
            See details →
          </button>
        </div>
      </div>

      {/* Snackbar for closed registration */}
      {showSnackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-sm py-2 px-4 rounded-lg shadow-lg">
          Registrations closed
        </div>
      )}
    </>
  );
};

export default EventCard;
