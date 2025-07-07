import React from 'react';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, venue }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/event-details', {
      state: { event, venue },  // Pass full objects here too
    });
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full h-[500px]"
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
  );
};

export default EventCard;
