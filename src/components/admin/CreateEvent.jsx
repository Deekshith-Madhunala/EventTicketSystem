import React, { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, PhotoIcon, TagIcon, TicketIcon, UserIcon, ChatBubbleBottomCenterTextIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import { fetchGoogleImages, createEvent, fetchUsers } from '../../service/RestService';

const TABS = ['Basic Info', 'Schedule & Venue', 'Tickets', 'Contact & Media'];
const CATEGORIES = [
    { id: 1, name: 'Music' },
    { id: 2, name: 'Tech' },
    { id: 3, name: 'Sports' },
    { id: 4, name: 'Business' },
    { id: 5, name: 'Health' },
    { id: 6, name: 'Education' },
    { id: 7, name: 'Art' },
    { id: 8, name: 'Party' },
    { id: 9, name: 'Charity' },
    { id: 10, name: 'Festival' }
];
const ImageSelectionModal = ({ images, isOpen, onClose, onSelect, selectedImage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
                <div className="mb-3 flex justify-between items-center">
                    <h2 className="text-base font-semibold text-gray-800">Select an Image</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black text-xl font-bold">&times;</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {images.map((imageUrl, index) => (
                        <div
                            key={index}
                            className="relative cursor-pointer"
                            onClick={() => {
                                onSelect(imageUrl);
                                onClose();
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt={`Image ${index}`}
                                className="w-full h-auto rounded-md shadow"
                            />
                            {selectedImage === imageUrl && (
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-semibold rounded-md">
                                    Selected
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CreateEvent = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [coverImageResults, setCoverImageResults] = useState([]);
    const [posterImageResults, setPosterImageResults] = useState([]);
    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [selectedPosterImage, setSelectedPosterImage] = useState(null);
    const [loadingCoverImages, setLoadingCoverImages] = useState(false);
    const [loadingPosterImages, setLoadingPosterImages] = useState(false);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
    const [managers, setManagers] = useState([]);

    const [formData, setFormData] = useState({
        eventName: '',
        description: '',
        category: '',
        eventType: 'PAID_LIMITED',
        startDate: new Date().toISOString().split('T')[0],  // today's date in yyyy-mm-dd format
        startTime: '09:00',  // 9:00 AM
        endDate: new Date().toISOString().split('T')[0],  // today's date in yyyy-mm-dd format
        endTime: '18:00',  // 6:00 PM        address: '',
        venueName: '',
        venueCapacity: '0',
        venueCity: '',
        venueZipCode: '',
        ticketName: '',
        ticketQuantity: '0',
        ticketPrice: '0',
        ticketType: 'Paid',
        contactDetails: '',
        additionalMessage: '',
        coverPhoto: null,
        posterPhoto: null,
        manager: '',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextTab = () => setActiveTab(prev => Math.min(prev + 1, TABS.length - 1));
    const prevTab = () => setActiveTab(prev => Math.max(prev - 1, 0));

    const onSubmit = async () => {
        try {
            await createEvent(formData);
            navigate("/");
            alert("Event successfully created!");
        } catch (err) {
            alert("Failed to create event. Check console for errors.");
        }
    };

    const handleImageSearch = async (type) => {
        if (!formData.eventName) {
            alert('Please enter the event name first!');
            return;
        }

        if (type === 'cover') {
            setLoadingCoverImages(true);
            const images = await fetchGoogleImages(formData.eventName, 1024, 900);
            setCoverImageResults(images);
            setLoadingCoverImages(false);
        } else if (type === 'poster') {
            setLoadingPosterImages(true);
            const images = await fetchGoogleImages(formData.eventName, 300, 400);
            setPosterImageResults(images);
            setLoadingPosterImages(false);
        }
    };

    const handleSelectImage = (imageUrl, type) => {
        if (type === 'cover') {
            setSelectedCoverImage(imageUrl);
            handleChange('coverPhoto', imageUrl);
        } else if (type === 'poster') {
            setSelectedPosterImage(imageUrl);
            handleChange('posterPhoto', imageUrl);
        }
    };

    useEffect(() => {
        if (formData.eventType === 'PAID_LIMITED') {
            setFormData(prev => ({ ...prev, ticketType: 'paid' }));
        } else if (formData.eventType === 'FREE_LIMITED' || formData.eventType === 'FREE_UNLIMITED') {
            setFormData(prev => ({ ...prev, ticketType: 'free' }));
        }
    }, [formData.eventType]);

    useEffect(() => {
        // Fetch users from the API using the imported method
        const getUsers = async () => {
            try {
                const data = await fetchUsers();

                // Filter out the managers from the list of users
                const managerList = data.filter(user => user.role === 'MANAGER');
                setManagers(managerList);

            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, []);

    // console.log("Managers", managers);

    const LabelWithIcon = ({ icon: Icon, text }) => (
        <label className="flex items-center text-gray-700 font-medium mb-1">
            <Icon className="w-4 h-4 mr-2 text-blue-500" /> {text}
        </label>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6 font-sans">
            <div className="flex border-b border-gray-200">
                {TABS.map((tab, idx) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(idx)}
                        className={`flex-grow py-3 text-center font-medium transition-all duration-200 ${activeTab === idx ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 0 && (
                <div className="space-y-5">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Tell the world about your event</h2>
                        <p className="text-sm text-gray-500">Provide the title, description, and category of your event.</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-700">Event Type?</p>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="PAID_LIMITED"
                                    checked={formData.eventType === 'PAID_LIMITED'}
                                    onChange={e => handleChange('eventType', e.target.checked ? 'PAID_LIMITED' : '')}
                                    className="mr-2"
                                />
                                Paid, Limited Capacity – e.g. Concerts, Sports Games
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="FREE_LIMITED"
                                    checked={formData.eventType === 'FREE_LIMITED'}
                                    onChange={e => handleChange('eventType', e.target.checked ? 'FREE_LIMITED' : '')}
                                    className="mr-2"
                                />
                                Free, Limited Capacity – e.g. Conferences, Meetings
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    value="FREE_UNLIMITED"
                                    checked={formData.eventType === 'FREE_UNLIMITED'}
                                    onChange={e => handleChange('eventType', e.target.checked ? 'FREE_UNLIMITED' : '')}
                                    className="mr-2"
                                />
                                Free, Unlimited Capacity – e.g. Exhibitions, Fairs
                            </label>
                        </div>
                    </div>



                    <div>
                        <p className="text-sm text-gray-700">What is your event name?</p>
                        <input
                            type="text"
                            value={formData.eventName}
                            onChange={e => handleChange('eventName', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <p className="text-sm text-gray-700">Describe your event</p>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={e => handleChange('description', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <h3 className="text-xl text-gray-700">Tell the world about your event</h3>
                        <p className="text-sm text-gray-500">This will help others find your event.</p>
                        <select
                            value={formData.category}
                            onChange={e => handleChange('category', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white"
                        >
                            <option value="">Select a category</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {activeTab === 1 && (
                <div className="space-y-5">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Choose a time and place for your event</h2>
                        <p className="text-sm text-gray-500">Add the start/end date, time, and the location details of the event.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div>
                            <LabelWithIcon icon={CalendarIcon} text="Start Date" />
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={e => handleChange('startDate', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                onFocus={(e) => e.target.showPicker()}  // Focus will trigger date picker
                            />
                        </div>

                        {/* Start Time */}
                        <div>
                            <LabelWithIcon icon={ClockIcon} text="Start Time" />
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={e => handleChange('startTime', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                onFocus={(e) => e.target.showPicker()}  // Focus will trigger time picker
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <LabelWithIcon icon={CalendarIcon} text="End Date" />
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={e => handleChange('endDate', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                onFocus={(e) => e.target.showPicker()}  // Focus will trigger date picker
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <LabelWithIcon icon={ClockIcon} text="End Time" />
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={e => handleChange('endTime', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                onFocus={(e) => e.target.showPicker()}  // Focus will trigger time picker
                            />
                        </div>
                        {/* Venue Name */}
                        <div>
                            <LabelWithIcon icon={MapPinIcon} text="Venue Name" />
                            <input
                                type="text"
                                value={formData.venueName}
                                onChange={e => handleChange('venueName', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Venue Address */}
                        <div>
                            <LabelWithIcon icon={MapPinIcon} text="Venue Address" />
                            <input
                                type="text"
                                value={formData.address}
                                onChange={e => handleChange('address', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Venue City */}
                        <div>
                            <LabelWithIcon icon={MapPinIcon} text="Venue City" />
                            <input
                                type="text"
                                value={formData.venueCity}
                                onChange={e => handleChange('venueCity', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Venue zipCode */}
                        <div>
                            <LabelWithIcon icon={MapPinIcon} text="Venue Zip Code" />
                            <input
                                type="text"
                                value={formData.venueZipCode}
                                onChange={e => handleChange('venueZipCode', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>


                    </div>
                </div>
            )}

            {activeTab === 2 && (
                <div className="space-y-5">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Add ticket details including name, price, and quantity.
                    </h2>

                    {/* Ticket Type Selection - Button Style */}
                    <div className="mb-4">
                        <LabelWithIcon icon={TicketIcon} text="Ticket Type" />
                        <div className="flex space-x-4">
                            {/* If PAID_LIMITED, only show Paid */}
                            {formData.eventType === 'PAID_LIMITED' && (
                                <button
                                    disabled
                                    className="w-full p-2 rounded-md text-white bg-blue-600 cursor-default"
                                >
                                    Paid
                                </button>
                            )}

                            {/* If FREE_LIMITED or FREE_UNLIMITED, only show Free */}
                            {(formData.eventType === 'FREE_LIMITED' || formData.eventType === 'FREE_UNLIMITED') && (
                                <button
                                    disabled
                                    className="w-full p-2 rounded-md text-white bg-blue-600 cursor-default"
                                >
                                    Free
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Conditionally Render Ticket Name */}
                    {formData.eventType === 'PAID_LIMITED' && (
                        <div>
                            <LabelWithIcon icon={TicketIcon} text="Ticket Name" />
                            <input
                                type="text"
                                value={formData.ticketName}
                                onChange={e => handleChange('ticketName', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    )}

                    {/* Conditionally Render Ticket Quantity (Hide for FREE_UNLIMITED) */}
                    {(formData.eventType === 'PAID_LIMITED' || formData.eventType === 'FREE_LIMITED') && (
                        <div>
                            <LabelWithIcon icon={TicketIcon} text="Quantity" />
                            <input
                                type="number"
                                value={formData.ticketQuantity}
                                onChange={e => handleChange('ticketQuantity', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    )}

                    {/* Conditionally Render Ticket Price */}
                    {formData.eventType === 'PAID_LIMITED' && (
                        <div>
                            <LabelWithIcon icon={TicketIcon} text="Price" />
                            <input
                                type="text"
                                value={formData.ticketPrice || '$9.99'}
                                onChange={e => handleChange('ticketPrice', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    )}
                </div>
            )}


            {activeTab === 3 && (
                <div className="space-y-5">
                    <div>
                        <LabelWithIcon icon={UserIcon} text="Contact Details" />
                        <textarea
                            rows={3}
                            value={formData.contactDetails}
                            onChange={e => handleChange('contactDetails', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <LabelWithIcon icon={ChatBubbleBottomCenterTextIcon} text="Additional Message" />
                        <textarea
                            rows={3}
                            value={formData.additionalMessage}
                            onChange={e => handleChange('additionalMessage', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <LabelWithIcon icon={UserCircleIcon} text="Add Manager for this Event to maintain" />
                        <select
                            value={formData.manager}
                            onChange={e => handleChange('manager', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select a Manager</option>
                            {managers.map(manager => (
                                <option key={manager.id} value={manager.id}>
                                    {manager.username}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <LabelWithIcon icon={PhotoIcon} text="Cover Photo" />
                        <button
                            onClick={async () => {
                                await handleImageSearch('cover');
                                setIsCoverModalOpen(true);
                            }}
                            disabled={loadingCoverImages}
                            className="bg-blue-600 text-white p-2 rounded-md"
                        >
                            {loadingCoverImages ? 'Loading cover images...' : 'Search Cover Image'}
                        </button>
                    </div>

                    <div>
                        <LabelWithIcon icon={PhotoIcon} text="Poster Photo" />
                        <button
                            onClick={async () => {
                                await handleImageSearch('poster');
                                setIsPosterModalOpen(true);
                            }}
                            disabled={loadingPosterImages}
                            className="bg-blue-600 text-white p-2 rounded-md"
                        >
                            {loadingPosterImages ? 'Loading poster images...' : 'Search Poster Image'}
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-6 flex justify-between">
                <button onClick={prevTab} disabled={activeTab === 0} className="bg-gray-500 text-white p-2 rounded-md">
                    Previous
                </button>
                <button onClick={nextTab} disabled={activeTab === TABS.length - 1} className="bg-blue-600 text-white p-2 rounded-md">
                    Next
                </button>
                {activeTab === TABS.length - 1 && (
                    <button onClick={onSubmit} className="bg-green-600 text-white p-2 rounded-md">
                        Create Event
                    </button>
                )}
            </div>

            <ImageSelectionModal
                images={coverImageResults}
                isOpen={isCoverModalOpen}
                onClose={() => setIsCoverModalOpen(false)}
                onSelect={(url) => handleSelectImage(url, 'cover')}
                selectedImage={selectedCoverImage}
            />

            <ImageSelectionModal
                images={posterImageResults}
                isOpen={isPosterModalOpen}
                onClose={() => setIsPosterModalOpen(false)}
                onSelect={(url) => handleSelectImage(url, 'poster')}
                selectedImage={selectedPosterImage}
            />
        </div>
    );
};

export default CreateEvent;
