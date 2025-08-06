import React, { useState, useEffect } from 'react';
import {
    CalendarDaysIcon,
    MapPinIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    PlusIcon,
    ChartBarIcon,
    TrashIcon,
    PencilIcon,  // Add trash icon for the delete button
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // State for storing API data
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [venues, setVenues] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userFromStorage = JSON.parse(localStorage.getItem('user'));
                if (!userFromStorage) {
                    throw new Error("User not found in localStorage.");
                }

                const eventResponse = await fetch('http://localhost:8080/api/events');
                const bookingResponse = await fetch('http://localhost:8080/api/bookings');
                const venueResponse = await fetch('http://localhost:8080/api/venues');
                const userResponse = await fetch('http://localhost:8080/api/users');

                if (!eventResponse.ok || !bookingResponse.ok || !venueResponse.ok || !userResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const eventsData = await eventResponse.json();
                const bookingsData = await bookingResponse.json();
                const venuesData = await venueResponse.json();
                const usersData = await userResponse.json();

                let filteredEvents = eventsData;
                let filteredBookings = bookingsData;

                if (userFromStorage.role === 'MANAGER') {
                    // Find venueIds managed by this user
                    const managedVenueIds = venuesData
                        .filter(venue => venue.manager === userFromStorage.id)
                        .map(venue => venue.id);

                    // Filter events by venueId
                    filteredEvents = eventsData.filter(event =>
                        managedVenueIds.includes(event.venueId)
                    );

                    // Get event IDs that belong to this manager
                    const managerEventIds = filteredEvents.map(event => event.id);

                    // Filter bookings to only include those related to manager's events
                    filteredBookings = bookingsData.filter(booking =>
                        managerEventIds.includes(booking.eventId)
                    );
                }

                setEvents(filteredEvents);
                setBookings(filteredBookings);
                setVenues(venuesData);
                setUsers(usersData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Delete an event
    const deleteEvent = async (eventId) => {
        const confirmed = window.confirm('Are you sure you want to delete this event?');
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            // Update the state to remove the event from the list
            setEvents(events.filter(event => event.id !== eventId));
        } catch (error) {
            alert(error.message);
        }
    };

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

                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteEvent(event.id)}
                                    className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-800"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                    Delete
                                </button>
                                <button
                                    onClick={() => navigate(`/edit-event/${event.id}`)}
                                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                    Edit
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminDashboard;
