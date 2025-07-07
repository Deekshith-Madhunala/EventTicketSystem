import React from 'react';
import {
    CalendarDaysIcon,
    MapPinIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    PlusIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const bookingsMock = [
    {
        id: '1',
        eventTitle: 'React Conference 2025',
        date: '2025-07-20',
        location: 'San Francisco, CA',
        attendeeCount: 3,
        totalPaid: 150.0,
    },
    {
        id: '2',
        eventTitle: 'Vue Meetup',
        date: '2025-08-10',
        location: 'New York, NY',
        attendeeCount: 1,
        totalPaid: 50.0,
    },
];

const AdminDashboard = ({ bookings = bookingsMock }) => {

    const navigate = useNavigate();

    // Calculate stats
    const totalBookings = bookings.length;
    const totalAttendees = bookings.reduce((sum, b) => sum + b.attendeeCount, 0);
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPaid, 0);
    const upcomingEvents = bookings.filter(b => new Date(b.date) > new Date()).length;

    return (
        <div className=" mx-auto p-6 font-sans space-y-6 bg-gray-50 min-h-screen">
            {/* Buttons */}
            <div className="flex justify-end justifygap-4 mb-6">
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
                        className="bg-white rounded-lg shadow-sm p-5 flex flex-col items-center text-center"
                    >
                        <Icon className="h-8 w-8 text-blue-400 mb-3" />
                        <p className="text-gray-500 uppercase tracking-wide text-xs font-semibold mb-1">
                            {label}
                        </p>
                        <p className="text-gray-900 text-2xl font-semibold">{value}</p>
                    </div>
                ))}
            </div>

            {/* Booking Cards */}
            <div className="space-y-3">
                {bookings.length === 0 && (
                    <p className="text-center text-gray-400 italic">No bookings found.</p>
                )}

                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition cursor-pointer"
                        onClick={() => alert(`Clicked booking: ${booking.eventTitle}`)}
                    >
                        {/* Event Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 w-full sm:w-auto">
                            <div className="flex items-center gap-1 text-blue-600 font-semibold text-base truncate">
                                {booking.eventTitle}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-sm whitespace-nowrap">
                                <CalendarDaysIcon className="h-5 w-5" />
                                <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-sm max-w-xs truncate">
                                <MapPinIcon className="h-5 w-5" />
                                <span>{booking.location}</span>
                            </div>
                        </div>

                        {/* Attendees and Total */}
                        <div className="flex items-center gap-8 mt-3 sm:mt-0">
                            <div className="flex items-center gap-1 text-gray-500 text-sm whitespace-nowrap">
                                <UserGroupIcon className="h-5 w-5" />
                                <span>
                                    {booking.attendeeCount} Attendee
                                    {booking.attendeeCount > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-600 font-semibold text-base whitespace-nowrap">
                                <CurrencyDollarIcon className="h-5 w-5" />
                                <span>${booking.totalPaid.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
