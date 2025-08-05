import React, { useState } from 'react';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { TicketIcon } from '@heroicons/react/24/solid';

const EventCard = ({ event, venue }) => {
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false); // For snackbar visibility

  const currentDate = new Date();

  // Determine if the card should be disabled based on the event type
  const isDisabled = () => {
    const ticketDetails = event?.ticketDetails[0];

    if (!ticketDetails) return false; // If ticketDetails are missing, the event should not be disabled

    const eventStartDate = new Date(event.startDateTime); // Event start date

    // Case 1: PAID_LIMITED - Check ticket quantity and event date
    if (event?.eventType === 'PAID_LIMITED') {
      if (ticketDetails?.ticketQuantity <= 0 || eventStartDate < currentDate) {
        return true; // Tickets are sold out or event has passed
      }
      return false; // Tickets available and event has not passed
    }

    // Case 2: FREE_LIMITED - Check ticket quantity and event date
    if (event?.eventType === 'FREE_LIMITED') {
      if (ticketDetails?.ticketQuantity <= 0 || eventStartDate < currentDate) {
        return true; // No tickets left or event has passed
      }
      return false; // Tickets available and event has not passed
    }

    // Case 3: FREE_UNLIMITED - Check only event date
    if (event?.eventType === 'FREE_UNLIMITED') {
      if (eventStartDate < currentDate) {
        return true; // Event date has passed
      }
      return false; // Event is open and future
    }

    return false; // Default case: event is not disabled
  };

  const handleClick = () => {
    if (isDisabled()) {
      // Show the snackbar when registration is closed
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false); // Hide snackbar after 3 seconds
      }, 3000);
    } else {
      // Navigate to event details if the card is not disabled
      navigate('/event-details', {
        state: { event, venue },
      });
    }
  };

  // Get ticket details message
  const getTicketDetailsMessage = () => {
    if (!event) return "Event details unavailable";

    const { eventType, ticketDetails } = event;
    const ticket = ticketDetails[0];

    const eventStartDate = new Date(event.startDateTime); // Event start date

    // For PAID_LIMITED and FREE_LIMITED, check ticket quantity and event date
    if (eventType === 'PAID_LIMITED' || eventType === 'FREE_LIMITED') {
      if (ticket.ticketQuantity <= 0 || eventStartDate < currentDate) {
        return "Registrations closed"; // Tickets are sold out or event date has passed
      } else {
        return `${ticket.ticketQuantity} tickets available for ${eventType === 'PAID_LIMITED' ? `$${ticket.ticketPrice}` : 'free'}`; // Tickets available
      }
    }

    // For FREE_UNLIMITED, only check the event date
    if (eventType === 'FREE_UNLIMITED') {
      if (eventStartDate < currentDate) {
        return "Registrations closed"; // Event date has passed
      } else {
        return "Free and open to register"; // Event is upcoming
      }
    }

    return "Event details unavailable"; // Default case
  };

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
              <span>{getTicketDetailsMessage()}</span>
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
