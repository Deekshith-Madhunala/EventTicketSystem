import React, { useEffect, useState } from 'react';
import {
  getVenueById,
  getAllBookings,
  getEventById,
  cancelBooking,
} from '../../service/RestService';

const MyBookings = () => {
  const [bookingsWithDetails, setBookingsWithDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchBookingsDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))?.id;
        if (!user) throw new Error('User not found in localStorage');

        let bookings = await getAllBookings();
        bookings = bookings.filter((booking) => booking.userId === user);

        const detailedBookings = await Promise.all(
          bookings.map(async (booking) => {
            try {
              const event = await getEventById(booking.eventId);
              let venueName = 'Unknown Venue';

              if (event.venueId) {
                try {
                  const venue = await getVenueById(event.venueId);
                  venueName = venue.venueName || venueName;
                } catch (venueError) {
                  console.warn(`Failed to fetch venue:`, venueError);
                }
              }

              return {
                ...booking,
                eventName: event.eventName,
                eventImage:
                  event.eventPhotoUrl ||
                  'https://source.unsplash.com/400x200/?event',
                venueName,
                eventDate: event.startDateTime,
              };
            } catch {
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
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsDetails();
  }, []);

  const handleCancelBooking = async (booking) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    setCancellingId(booking.id);
    try {
      await cancelBooking(booking);

      setTimeout(() => {
        setBookingsWithDetails((prev) =>
          prev.map((b) =>
            b.id === booking.id ? { ...b, bookingStatus: 'CANCELLED' } : b
          )
        );
        setToast({ type: 'success', message: 'Booking cancelled successfully.' });
      }, 2000);
    } catch (err) {
      console.error('Cancel failed:', err);
      setToast({ type: 'error', message: 'Failed to cancel booking. Try again.' });
    } finally {
      setTimeout(() => setCancellingId(null), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow text-white z-50 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{
            animation:
              'slideInToast 0.4s ease forwards, fadeOutToast 0.4s ease 2.6s forwards',
          }}
        >
          {toast.message}
        </div>
      )}

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
              <img
                src={booking.eventImage}
                alt={booking.eventName}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-indigo-700">
                  {booking.eventName}
                </h2>
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
                  <strong>Total Paid:</strong> $
                  {booking.totalAmount?.toFixed(2)}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      booking.bookingStatus === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>

                  {booking.bookingStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      disabled={cancellingId === booking.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border 
                        ${
                          cancellingId === booking.id
                            ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                            : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200 transition'
                        }`}
                    >
                      {cancellingId === booking.id ? (
                        <svg
                          className="animate-spin h-4 w-4 text-red-600"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Cancel
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🎯 Scoped Toast Animation */}
      <style>{`
        @keyframes slideInToast {
          0% { opacity: 0; transform: translateX(100%) translateY(20px); }
          100% { opacity: 1; transform: translateX(0) translateY(0); }
        }
        @keyframes fadeOutToast {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
