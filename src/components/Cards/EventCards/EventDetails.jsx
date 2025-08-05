import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, CheckIcon, CogIcon } from '@heroicons/react/24/outline';
import { createBooking, getBookings } from '../../../service/RestService';

const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${bgColor} fixed bottom-4 right-4 px-4 py-2 rounded shadow text-white z-50`}
      style={{
        animation: 'slideInToast 0.4s ease forwards, fadeOutToast 0.4s ease 2.6s forwards',
      }}
      role="alert"
      aria-live="assertive"
    >
      {message}

      <style>{`
        @keyframes slideInToast {
          0% {
            opacity: 0;
            transform: translateX(100%) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
        @keyframes fadeOutToast {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};


// Reusable Button with loading & success state & animation
const LoadingButton = ({ isLoading, isRegistered, onClick, children, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-live="polite"
    className={`
      w-full mt-4 py-2 rounded-md text-center text-sm font-medium transition
      ${isRegistered ? 'bg-green-600 cursor-not-allowed text-white' : ''}
      ${isLoading ? 'bg-indigo-700 cursor-wait text-white' : ''}
      ${!isRegistered && !isLoading ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer' : ''}
      flex justify-center items-center gap-2
    `}
  >
    {isLoading && <div className="loader" />}
    {!isLoading && isRegistered && (
      <CheckIcon className="h-5 w-5 animate-fade-scale" />
    )}
    {!isLoading && !isRegistered && children}
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes fadeScale {
        0% { opacity: 0; transform: scale(0.7); }
        100% { opacity: 1; transform: scale(1); }
      }
      .loader {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid transparent;
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      .animate-fade-scale {
        animation: fadeScale 0.3s ease forwards;
      }
    `}</style>
  </button>
);

const EventDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { event, venue } = state || {};

  const [buttonState, setButtonState] = useState('Register');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    throw new Error('User not found in localStorage');
  }
  const userId = user.id;
  const userName = user.username;
  const userEmail = user.email;
  const eventId = event?.id;

  const checkIfAlreadyRegistered = async () => {
    try {
      const response = await getBookings();
      const existingBooking = response.find(
        (booking) => booking.userId === userId && booking.eventId === eventId && booking.bookingStatus === 'CONFIRMED'
      );
      if (existingBooking) setButtonState('Registered');
      else setButtonState('Register');
    } catch (error) {
      console.error('Error checking booking status:', error);
    }
  };

  useEffect(() => {
    checkIfAlreadyRegistered();
  }, [eventId, userId]);

  const handleBooking = async () => {
    if (buttonState === 'Registered' || isLoading) return;

    setIsLoading(true);
    setButtonState('Loading');

    const now = new Date();
    const attendees = [{ name: userName, email: userEmail }];
    const total = 0;

    const bookingPayload = {
      totalAmount: total,
      numberOfTickets: attendees.length,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      bookingDate: now.toISOString().split('T')[0],
      cancellationDeadline: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      userId,
      eventId,
      bookingPaymentIds: [],
    };

    try {
      await createBooking(bookingPayload);
      // Show loading spinner for 2 sec before confirming registration
      setTimeout(() => {
        setBookingSuccess(true);
        setButtonState('Registered');
        setIsLoading(false);
        setToast({ message: 'Successfully registered!', type: 'success' });
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setButtonState('Register');
      setToast({ message: 'Booking failed. Please try again.', type: 'error' });
    }
  };

  const basePrice = event?.ticketDetails?.[0]?.ticketPrice;
  const eventType = event?.eventType;

  if (!event) return <div className="text-center py-8">Event data not available.</div>;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full min-h-screen bg-gray-50">
        {/* Banner Section */}
        <div className="relative w-full h-[500px]">
          <img
            src={event.coverPhotoUrl || 'https://via.placeholder.com/1200x500'}
            alt={event.eventName}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-opacity-20 flex items-end px-8 py-6 z-10">
            <div className="text-white max-w-4xl space-y-3 relative z-20">
              <div className="flex items-center gap-2 text-lg">{venue?.venueName || 'Unknown Venue'}</div>
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

        {/* Details Section */}
        <div className="max-w-7xl mx-auto mt-12 px-4 md:px-8 flex flex-col md:flex-row gap-8">
          {/* Left side */}
          <div className="w-full md:w-2/3 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">About the Event</h2>
            <p className="text-gray-700">{event.eventDescription || 'No description available.'}</p>

            <div className="mt-6 space-y-3 text-gray-700">
              <div className="flex items-start gap-2">
                <CalendarIcon className="h-5 w-5 text-indigo-500" />
                <span>{new Date(event.startDateTime).toLocaleString()}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-indigo-500" />
                <span>{venue?.address || 'TBD'}</span>
              </div>
            </div>
          </div>

          {/* Right side */}
          {eventType === 'PAID_LIMITED' && (
            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 border border-gray-200">
                <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
                  <CurrencyDollarIcon className="h-6 w-6" />
                  <span>{basePrice || 'Free'}</span>
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
                  onClick={() => navigate('/book-tickets', { state: { event, venue, basePrice } })}
                  className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md text-center text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Get Tickets
                </button>
              </div>
            </div>
          )}

          {eventType === 'FREE_LIMITED' && (
            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 border border-gray-200">
                <div className="flex items-center gap-2 text-xl font-bold text-indigo-600">
                  <CurrencyDollarIcon className="h-6 w-6" />
                  <span>Free</span>
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

                <LoadingButton
                  onClick={handleBooking}
                  isLoading={isLoading}
                  isRegistered={buttonState === 'Registered'}
                  disabled={isLoading || buttonState === 'Registered'}
                >
                  Register
                </LoadingButton>
              </div>
            </div>
          )}

          {eventType === 'FREE_UNLIMITED' && null}
        </div>
      </div>
    </>
  );
};

export default EventDetails;
