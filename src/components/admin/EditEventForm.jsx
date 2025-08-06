import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/24/outline';

const EditEventForm = () => {
    const navigate = useNavigate();
    const { eventId } = useParams(); // To get the eventId from the URL
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch event details on component mount
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }
                const eventData = await response.json();
                setEvent(eventData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchEventData();
    }, [eventId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // If the ticket price is being updated, modify the ticketDetails array
        if (name === "ticketPrice") {
            setEvent({
                ...event,
                ticketDetails: [{
                    ...event.ticketDetails[0], // Retain other ticket details
                    ticketPrice: value
                }]
            });
        } else {
            setEvent({
                ...event,
                [name]: value, // For other fields, just update the event
            });
        }
    };

    // Handle form submission (PUT request)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });

            if (!response.ok) {
                throw new Error('Failed to update event');
            }

            // Navigate back to the dashboard after successful update
            navigate('/admin');
        } catch (error) {
            alert(error.message);
        }
    };

    // Loading and error handling
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
            <h2 className="text-3xl font-semibold text-gray-900">Edit Event</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                    <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        value={event.eventName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700">Event Description</label>
                    <textarea
                        id="eventDescription"
                        name="eventDescription"
                        value={event.eventDescription}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-700">Start Date and Time</label>
                    <input
                        type="datetime-local"
                        id="startDateTime"
                        name="startDateTime"
                        value={new Date(event.startDateTime).toISOString().slice(0, 16)}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="endDateTime" className="block text-sm font-medium text-gray-700">End Date and Time</label>
                    <input
                        type="datetime-local"
                        id="endDateTime"
                        name="endDateTime"
                        value={new Date(event.endDateTime).toISOString().slice(0, 16)}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="eventCategory" className="block text-sm font-medium text-gray-700">Event Category</label>
                    <input
                        type="text"
                        id="eventCategory"
                        name="eventCategory"
                        value={event.eventCategory}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Ensure ticket price is handled as part of the ticketDetails */}
                <div>
                    <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">Ticket Price</label>
                    <input
                        type="number"
                        id="ticketPrice"
                        name="ticketPrice"
                        value={event.ticketDetails && event.ticketDetails[0] ? event.ticketDetails[0].ticketPrice : ''}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
                >
                    Update Event
                </button>
            </form>
        </div>
    );
};

export default EditEventForm;
