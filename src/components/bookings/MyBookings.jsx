import React, { useEffect, useState } from 'react';
import { getVenueById, getAllBookings, getEventById } from '../../service/RestService';

const MyBookings = () => {
  const [bookingsWithDetails, setBookingsWithDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingsDetails = async () => {
      try {

        const user = JSON.parse(localStorage.getItem("user"))?.id;

        if (!user) {
          throw new Error("User not found in localStorage");
        }
        let bookings = await getAllBookings();

        // console.log("booking before filter:", bookings);

        bookings = bookings.filter((booking) => booking.userId === user);
        // console.log("booking after filter:", bookings);

        const detailedBookings = await Promise.all(
          bookings.map(async (booking) => {
            try {
              const event = await getEventById(booking.eventId);

              // Fetch venue data using event.venueId
              let venueName = 'Unknown Venue';
              if (event.venueId) {
                try {
                  const venue = await getVenueById(event.venueId);
                  venueName = venue.venueName || venueName;
                } catch (venueError) {
                  console.warn(`Failed to fetch venue for event ${event.id}:`, venueError);
                }
              }

              return {
                ...booking,
                eventName: event.eventName,
                eventImage: event.eventPhotoUrl || 'https://source.unsplash.com/400x200/?event',
                venueName,
                eventDate: event.startDateTime,
              };
            } catch (err) {
              console.warn(`Failed to fetch event for booking ${booking.id}:`, err);
              return {
                ...booking,
                eventName: 'Unknown Event',
                eventImage: 'https://source.unsplash.com/400x200/?event,unknown',
                venueName: 'Unknown Venue',
                eventDate: booking.bookingDate,
              };
            }
          })
        );

        setBookingsWithDetails(detailedBookings);
      } catch (err) {
        console.error('Error fetching bookings with event and venue:', err);
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsDetails();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {loading && <p className="text-gray-500">Loading your bookings...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && bookingsWithDetails.length === 0 && (
        <p className="text-gray-500">You haven't booked any events yet.</p>
      )}

      {!loading && bookingsWithDetails.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookingsWithDetails.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition"
            >
              <img src={booking.eventImage} alt={booking.eventName} className="w-full h-40 object-cover" />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-indigo-700">{booking.eventName}</h2>
                <p className="text-gray-600 text-sm">
                  <strong>Venue:</strong> {booking.venueName}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Date:</strong>{' '}
                  {new Date(booking.eventDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Attendees:</strong> {booking.numberOfTickets}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Total Paid:</strong> ${booking.totalAmount?.toFixed(2)}
                </p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {booking.bookingStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
