import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { createBooking } from '../../service/RestService';

// PaymentModal Component
const PaymentModal = ({ isOpen, onClose, eventData, attendees, total, tax, basePrice }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  // Get user from localStorage (adjust key if needed)
  const user = JSON.parse(localStorage.getItem("user"))?.id;

  if (!user) {
    throw new Error("User not found in localStorage");
  }

  const isFreeEvent = eventData?.ticketDetails?.[0]?.ticketPriceDetails === 'free';

  const handlePayment = () => {
    if (isFreeEvent) {
      handlePurchase();  // Directly handle purchase if the event is free
    } else {
      setPaymentModalOpen(true);  // Open the modal if the event is paid
    }
  };

  const handlePurchase = async () => {
    const now = new Date();

    const bookingPayload = {
      totalAmount: total,
      numberOfTickets: attendees.length,
      bookingStatus: 'CONFIRMED',
      paymentStatus: isFreeEvent ? 'PAID' : 'UNPAID', // For free events, payment is "paid"
      bookingDate: now.toISOString().split('T')[0],
      cancellationDeadline: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // e.g. 2 hours later
      userId: user,
      eventId: eventData.id, // Ensure eventData contains event ID
      bookingPaymentIds: [], // Or pass actual payment ID references
    };

    try {
      await createBooking(bookingPayload);

      setBookingSuccess(true);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        navigate('/success', {
          state: {
            eventData,
            attendees,
            total,
          },
        });
      }, 2000);
    } catch (error) {
      alert('Booking failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-20 backdrop-blur-md transition-all">
      <div className="bg-white max-w-4xl w-full p-8 rounded-xl shadow-2xl border border-gray-300 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>

        {!bookingSuccess ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 space-y-4">
              <img
                src={eventData.eventPhotoUrl || 'https://via.placeholder.com/300'}
                alt={eventData.eventName}
                className="w-full h-64 object-cover rounded-md"
              />
              <div className="text-gray-700 space-y-2">
                <h2 className="text-2xl font-bold">{eventData.eventName}</h2>
                <p><strong>Date:</strong> {new Date(eventData.startDateTime).toLocaleString()}</p>
                <p><strong>Location:</strong> {eventData.venue?.venueName || 'TBD'}</p>
                <p><strong>Tickets:</strong> {attendees.length}</p>
                <p><strong>Total:</strong> ${total.toFixed(2)} (incl. ${tax.toFixed(2)} tax)</p>
              </div>
            </div>
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-xl font-semibold">Payment Information</h2>

              {isFreeEvent ? (
                <div className="text-lg text-green-600">
                  <p>This event is free! You're all set to book.</p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-1/2 p-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-1/2 p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handlePurchase}
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircleIcon className="h-12 w-12 text-green-500" />
            <p className="text-xl font-semibold text-gray-800">Booking Confirmed!</p>
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md font-medium animate-pulse">
              🎉 Thank you! Redirecting to confirmation...
            </div>
          </div>
        )}

        {showToast && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded shadow-lg animate-fade-in">
            ✅ Booking Successful!
          </div>
        )}
      </div>
    </div>
  );
};


// TicketBooking Component
const TicketBooking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Expect full event and venue objects
  const { event, venue, basePrice = 50 } = state || {};

  const [ticketCount, setTicketCount] = useState(1);
  const [peopleDetails, setPeopleDetails] = useState([{ name: '', email: '' }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (peopleDetails.length < ticketCount) {
      setPeopleDetails((prev) => [
        ...prev,
        ...Array(ticketCount - prev.length).fill({ name: '', email: '' }),
      ]);
    } else if (peopleDetails.length > ticketCount) {
      setPeopleDetails((prev) => prev.slice(0, ticketCount));
    }
    calculatePrice(ticketCount);
  }, [ticketCount]);

  const calculatePrice = (count) => {
    const subtotal = basePrice * count;
    const taxAmount = subtotal * 0.1;
    const roundedSubtotal = parseFloat(subtotal.toFixed(2));
    const roundedTaxAmount = parseFloat(taxAmount.toFixed(2));
    const roundedTotalPrice = parseFloat((roundedSubtotal + roundedTaxAmount).toFixed(2));
    setTax(roundedTaxAmount);
    setTotalPrice(roundedTotalPrice);
  };

  const handleTicketCountChange = (e) => {
    const val = Math.max(1, Number(e.target.value));
    setTicketCount(val);
  };

  const handleInputChange = (index, event) => {
    const updatedDetails = [...peopleDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [event.target.name]: event.target.value,
    };
    setPeopleDetails(updatedDetails);
  };

  const addPerson = () => setTicketCount((prev) => prev + 1);

  const deletePerson = (index) => {
    setPeopleDetails((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setTicketCount(updated.length);
      return updated;
    });
  };

  if (!event) {
    return (
      <div className="text-center py-10 text-red-600">
        Event information is missing. Please go back and select an event.
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto mt-12 px-4 md:px-8 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-2/3 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Book Your Tickets</h2>
        <div>
          <label htmlFor="ticketCount" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Tickets
          </label>
          <input
            id="ticketCount"
            type="number"
            value={ticketCount}
            onChange={handleTicketCountChange}
            min="1"
            className="p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="space-y-6">
          {peopleDetails.map((person, index) => (
            <div key={index} className="border p-5 rounded-md shadow-sm bg-white relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Attendee {index + 1}</h3>
                {peopleDetails.length > 1 && (
                  <button
                    onClick={() => deletePerson(index)}
                    type="button"
                    className="text-red-500 hover:text-red-600 text-xl font-bold"
                  >
                    &times;
                  </button>
                )}
              </div>
              <input
                name="name"
                type="text"
                value={person.name}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Full Name"
                className="p-2 w-full border rounded mb-2"
              />
              <input
                name="email"
                type="email"
                value={person.email}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Email Address"
                className="p-2 w-full border rounded"
              />
            </div>
          ))}
          <button
            onClick={addPerson}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Add Another Attendee
          </button>
        </div>
      </div>

      <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <p className="text-2xl font-bold text-gray-900">Event:</p>
        <p className="text-xl font-light text-gray-800 mb-6">{event.eventName}</p>

        <h3 className="text-2xl font-bold text-gray-800 mb-6">Price Summary</h3>
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <span>Base Price</span>
            <span>${(basePrice * ticketCount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <button
          className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          onClick={() => setPaymentModalOpen(true)}
        >
          Proceed to Payment
        </button>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        eventData={event}
        attendees={peopleDetails}
        total={totalPrice}
        tax={tax}
        basePrice={basePrice}
      />
    </div>
  );
};

export default TicketBooking;
