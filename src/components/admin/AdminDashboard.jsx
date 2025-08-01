import React, { useState, useEffect } from 'react';
import {
    CalendarDaysIcon,
    MapPinIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    PlusIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // State for storing API data
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventResponse = await fetch('http://localhost:8080/api/events');
                const bookingResponse = await fetch('http://localhost:8080/api/bookings');
                const venueResponse = await fetch('http://localhost:8080/api/venues');

                if (!eventResponse.ok || !bookingResponse.ok || !venueResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const eventsData = await eventResponse.json();
                const bookingsData = await bookingResponse.json();
                const venuesData = await venueResponse.json();

                setEvents(eventsData);
                setBookings(bookingsData);
                setVenues(venuesData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate stats
    const totalBookings = bookings.length;
    const totalAttendees = bookings.reduce((sum, b) => sum + b.numberOfTickets, 0);
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const upcomingEvents = events.filter((event) => new Date(event.startDateTime) > new Date()).length;

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <p className="text-lg text-gray-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <p className="text-lg text-red-600">{`Error: ${error}`}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 font-sans space-y-6 bg-gray-50 min-h-screen">
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mb-6">
                <button
                    type="button"
                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-md shadow-sm hover:bg-blue-200 transition font-medium text-sm"
                    onClick={() => navigate('/create-event')}
                >
                    <PlusIcon className="h-5 w-5" />
                    Create Event
                </button>
                <button
                    type="button"
                    className="bg-gray-100 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-200 transition font-medium text-sm"
                >
                    Other Action
                </button>
            </div>

            {/* Summary Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[{
                    icon: UserGroupIcon,
                    label: 'Total Attendees',
                    value: totalAttendees,
                }, {
                    icon: CalendarDaysIcon,
                    label: 'Total Bookings',
                    value: totalBookings,
                }, {
                    icon: CurrencyDollarIcon,
                    label: 'Total Revenue',
                    value: `$${totalRevenue.toFixed(2)}`,
                }, {
                    icon: ChartBarIcon,
                    label: 'Upcoming Events',
                    value: upcomingEvents,
                }].map(({ icon: Icon, label, value }) => (
                    <div
                        key={label}
                        className="bg-white rounded-lg shadow-lg p-5 flex flex-col items-center text-center"
                    >
                        <Icon className="h-8 w-8 text-blue-400 mb-3" />
                        <p className="text-gray-500 uppercase tracking-wide text-xs font-semibold mb-1">{label}</p>
                        <p className="text-gray-900 text-2xl font-semibold">{value}</p>
                    </div>
                ))}
            </div>

            {/* Event Cards */}
            <div className="space-y-6">
                {events.length === 0 && (
                    <p className="text-center text-gray-400 italic">No events found.</p>
                )}

                {events.map((event) => {
                    const venue = venues.find((v) => v.id === event.venueId);

                    return (
                        <div
                            key={event.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row mb-6 hover:shadow-xl transition"
                        >
                            {/* Event Image */}
                            <div className="flex-shrink-0 h-50 sm:w-1/3">
                                <img
                                    src={event.eventPhotoUrl}
                                    alt={event.eventName}
                                    className="w-full h-90 object-cover rounded-t-lg sm:rounded-l-lg"
                                />
                            </div>

                            {/* Event Content */}
                            <div className="p-6 flex flex-col justify-between bg-white">
                                <h3 className="text-2xl font-semibold text-gray-900">{event.eventName}</h3>
                                <p className="text-gray-600 mt-2">{event.eventDescription}</p>

                                {/* Event Date */}
                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                    <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                                    <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
                                </div>

                                {/* Venue Info */}
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                    <span>{venue?.venueName}, {venue?.address}</span>
                                </div>

                                {/* Ticket Info */}
                                <div className="mt-4 space-y-2">
                                    {event.ticketDetails.map((ticket, idx) => {
                                        const isFreeEvent = ticket.ticketPrice === 0; // Check if the event is free

                                        return (
                                            <div key={idx} className="flex items-center justify-between text-sm text-gray-700">
                                                <p className="font-semibold">{ticket.ticketName}</p>

                                                {/* Show availability and price for non-free events */}
                                                {isFreeEvent ? (
                                                    <p className="text-green-500 font-medium">Free</p>
                                                ) : (
                                                    <>
                                                        <p>{ticket.ticketQuantity} tickets available</p>
                                                        <p className="font-medium">${ticket.ticketPrice} each</p>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Additional Message */}
                                {event.additionalMessage && (
                                    <p className="mt-4 text-gray-500 text-xs italic">{event.additionalMessage}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminDashboard;
