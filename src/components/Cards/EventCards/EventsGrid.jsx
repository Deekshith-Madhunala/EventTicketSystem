import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { getAllEvents, getAllVenues } from "../../../service/RestService";

const EventsGrid = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events and venues in parallel
        const [eventsData, venuesData] = await Promise.all([getAllEvents(), getAllVenues()]);

        // Map events to include full venue details
        const eventsWithVenue = eventsData.map(event => {
          const venue = venuesData.find(v => v.id === event.venueId);
          return {
            ...event,
            venue: venue || null,
          };
        });

        setEvents(eventsWithVenue);
      } catch (err) {
        setError("Failed to fetch events or venues");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading events...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Featured Events Header */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 relative">
        Featured Events
        {/* Accent Line Under the Title */}
        <div className="absolute bottom-[-10px] left-0 w-16 h-1 bg-indigo-600"></div>
      </h1>

      {/* Grid of Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.map((event, index) => (
          <EventCard
            key={index}
            event={event}   // Pass full event object
            venue={event.venue} // Pass full venue object or null
          />
        ))}
      </div>
    </div>
  );
};

export default EventsGrid;
