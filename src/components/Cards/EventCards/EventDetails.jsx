import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const EventDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { event, venue } = state || {};

  useEffect(() => {
    if (event) {
      const basePrice = event?.ticketDetails[0]?.ticketPrice;
    }
  }, [event]); // The effect runs when event changes

  if (!event) return <div className="text-center py-8">Event data not available.</div>;

  const handleTicketClick = () => {
    const basePrice = event?.ticketDetails[0]?.ticketPrice;

    navigate('/book-tickets', {
      state: {
        event,
        venue,
        basePrice,
      },
    });
  };

  const basePrice = event?.ticketDetails[0]?.ticketPrice;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Banner Section with Image */}
      <div className="relative w-full h-[500px]">
        <img
          src={event.coverPhotoUrl || 'https://via.placeholder.com/1200x500'}
          alt={event.eventName}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* Title, Date, Location Overlay */}
        <div className="absolute inset-0 bg-opacity-20 flex items-end px-8 py-6 z-10">
          <div className="text-white max-w-4xl space-y-3 relative z-20">
            <div className="flex items-center gap-2 text-lg">
              {venue?.venueName || 'Unknown Venue'}
            </div>
            <h1 className="text-4xl font-bold">{event.eventName}</h1>
            <div className="flex items-center gap-2 text-lg">
              <CalendarIcon className="h-5 w-5 text-white" />
              <span>{new Date(event.startDateTime).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <MapPinIcon className="h-5 w-5 text-white" />
              <span>{venue?.address || 'TBD'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Section */}
      <div className="max-w-7xl mx-auto mt-12 px-4 md:px-8 flex flex-col md:flex-row gap-8">
        {/* Left */}
        <div className="w-full md:w-2/3 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">About the Event</h2>
          <p className="text-gray-700">{event.eventDescription || "No description available."}</p>

          <div className="mt-6 space-y-3 text-gray-700">
            <div className="flex items-start gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-500" />
              <span className="text-base">{new Date(event.startDateTime).toLocaleString()}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPinIcon className="h-5 w-5 text-indigo-500" />
              <span className="text-base">{venue?.address || 'TBD'}</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 border border-gray-200">
            <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
              <CurrencyDollarIcon className="h-6 w-6" />
              <span>{basePrice || 'Free'}</span> {/* Display value correctly here */}
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span>{new Date(event.startDateTime).toLocaleString()}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-4 w-4 text-gray-500" />
                <span>{venue?.address || 'TBD'}</span>
              </div>
            </div>

            <button
              onClick={handleTicketClick}
              className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md text-center text-sm font-medium hover:bg-indigo-700 transition"
            >
              Get Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
