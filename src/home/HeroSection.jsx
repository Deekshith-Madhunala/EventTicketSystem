import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/events');
  };

  return (
    <section className="relative h-[100vh] w-full overflow-hidden bg-gray-800">
      {/* Background image with enhanced overlay for contrast */}
      <img
        src="https://images.unsplash.com/photo-1531058020387-3be344556be6"
        alt="Event background"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
      />
      <div className="relative z-10 h-full flex items-center justify-start px-10 py-16">
        {/* Left: Text content */}
        <div className="text-white max-w-[60%]">
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6 text-shadow">
            Discover and Book <br /> Unforgettable Events
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Concerts, conferences, workshops, and more – all in one place. Don't miss out!
          </p>
          <div className="mt-8">
            <button
              onClick={handleClick}
              className="px-8 py-4 bg-indigo-600 text-white rounded-full text-lg
                relative overflow-hidden group shadow-lg transition-all duration-300 ease-in-out
                transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 active:scale-95 active:bg-indigo-700"
            >
              <span className="relative z-10 transition duration-300 ease-in-out">
                Find Events
              </span>
              <span
                className="absolute inset-0 bg-indigo-800 group-hover:bg-indigo-700 group-hover:w-full w-0 transition-all duration-500 ease-out"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
