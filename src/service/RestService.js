
const BASE_URL = "http://localhost:8080/api";

/**
 * Create a new event.
 */
export const createEvent = async (formData) => {
  console.log("formData:", formData);
  
  try {
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString();

    const eventCategory = formData.category.toUpperCase(); // Must match enum in backend


    const user = JSON.parse(localStorage.getItem("user"))?.id;

    if (!user) {
      throw new Error("User not found in localStorage");
    }

    const venueId = await createVenue({
      venueName: formData.venueName,
      capacity: formData.ticketQuantity,
      address: formData.address,
      city: formData.venueCity,
      zipCode: formData.venueZipCode,
      manager: user
    });
    console.log("venueId createed ::: ", venueId);
    // return
    
    // const venueId = "new-" + formData.venueName + '-' + formData.ticketQuantity + '-' + formData.address;

    const payload = {
      eventName: formData.eventName,
      eventDescription: formData.description,
      eventCategory,
      eventType: formData.eventType,
      startDateTime,
      endDateTime,
      venueId,
      //   venueName,
      ticketDetails: [
        {
          ticketName: formData.ticketName,
          ticketQuantity: parseInt(formData.ticketQuantity, 10),
          ticketPrice: parseFloat(formData.ticketPrice),
          ticketPriceDetails: formData.ticketType
        }
      ],
      contact: formData.contactDetails,
      additionalMessage: formData.additionalMessage,
      eventPhotoUrl: formData.posterPhoto, // placeholder
      coverPhotoUrl: formData.coverPhoto  // placeholder
    };

    const response = await fetch(BASE_URL + '/events', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Create failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("createEvent error:", error);
    throw error;
  }
};

/**
 * Get all events.
 */
export const getAllEvents = async () => {
  try {
    const response = await fetch(BASE_URL + '/events', {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Get events failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getAllEvents error:", error);
    throw error;
  }
};


// This function will fetch bookings from the API.
export const getBookings = async () => {
  try {
    // Make the GET request to the API
    const response = await fetch('http://localhost:8080/api/bookings', {
      method: 'GET',
      headers: {
        'accept': 'application/json', // Set the expected response type
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching bookings:', error);
    throw error;
  }
};


/**
 * Get all venues.
 */
export const getAllVenues = async () => {
  try {
    const response = await fetch(BASE_URL + '/venues', {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Get events failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getAllEvents error:", error);
    throw error;
  }
};

/**
 * 
 * @param {createBooking} bookingData 
 * @returns 
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(BASE_URL + '/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Booking failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * 
 * @param {Object} venueData - Data to create a new venue
 * @param {string} venueData.venueName
 * @param {number} venueData.capacity
 * @param {string} venueData.address
 * @param {string} venueData.city
 * @param {string} venueData.zipCode
 * @param {string} venueData.manager
 * @returns {Promise<Object>} - Created venue data
 */
export const createVenue = async (venueData) => {
  try {
    const response = await fetch('http://localhost:8080/api/venues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(venueData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Venue creation failed');
    }

    return await response.text();
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};


/**
 * Get all Bookings.
 */
export const getAllBookings = async () => {
  try {
    const response = await fetch(BASE_URL + '/bookings', {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Get bookings failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getAllBookings error:", error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  try {
    const response = await fetch(`${BASE_URL}/events/${eventId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Get event failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getEventById error:", error);
    throw error;
  }
};


export const getVenueById = async (venueId) => {
  try {
    const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Get venue failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getVenueById error:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(BASE_URL + '/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed. Please try again.');
    }

    const result = await response.json();
    return result; // Handle the success response
  } catch (error) {
    throw new Error(error.message || 'An error occurred while registering.');
  }
};

export async function fetchGoogleImages(query) {
  const API_KEY = 'AIzaSyB_AnFyzbr5_3b0Z3sg-N1iyk9yyuTmvYk';  // Replace with your API key
  const CSE_ID = '25b85bf266a0e4c19';  // Replace with your Custom Search Engine ID

  if (!query) return [];

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${CSE_ID}&searchType=image&key=${API_KEY}`
    );
    const data = await response.json();

    // Check if the response contains items
    if (data.items && data.items.length > 0) {
      return data.items.map(item => item.link);  // Extract image URLs
    }

    return [];
  } catch (error) {
    console.error('Error fetching images from Google:', error);
    return [];
  }
}

