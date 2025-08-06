import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', current: true },
];

const profilePics = [
  "https://randomuser.me/api/portraits/men/1.jpg",  // Random Male 1
  "https://randomuser.me/api/portraits/women/1.jpg", // Random Female 1
  "https://randomuser.me/api/portraits/men/2.jpg",  // Random Male 2
  "https://randomuser.me/api/portraits/women/2.jpg", // Random Female 2
  "https://randomuser.me/api/portraits/men/3.jpg",  // Random Male 3
  "https://randomuser.me/api/portraits/women/3.jpg", // Random Female 3
  "https://randomuser.me/api/portraits/men/4.jpg",  // Random Male 4
  "https://randomuser.me/api/portraits/women/4.jpg", // Random Female 4
];


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { logout, user } = useAuth();  // Get user data from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');  // Redirect to login page after logout
  };

  // Randomly select a profile picture from the array
  const randomProfilePic = profilePics[Math.floor(Math.random() * profilePics.length)];

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block size-6 group-data-open:hidden" />
              <XMarkIcon className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* Logo - click navigates to home */}
            <div className="flex shrink-0 items-center cursor-pointer" onClick={() => navigate('/')}>
              <img
                className="h-8 w-auto"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="Logo"
              />
              <span className="text-white ml-2 font-semibold text-lg hidden sm:block">BookMyEvent</span>
            </div>
          </div>

          {/* Right side: My Events button + Profile */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-4">
            <button
              onClick={() => navigate('/my-bookings')}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              My Events
            </button>

            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-hidden">
                  <img
                    className="size-8 rounded-full"
                    src={randomProfilePic} // Use the random profile picture here
                    alt="User profile"
                  />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

                {/* Conditionally show Admin menu item if user role is 'ADMIN' */}
                {user?.role === 'ADMIN' && (
                  <MenuItem>
                    <a href="/admin" className="block px-4 py-2 text-sm text-gray-700">Admin</a>
                  </MenuItem>
                )}
                {user?.role === 'MANAGER' && (
                  <MenuItem>
                    <a href="/admin" className="block px-4 py-2 text-sm text-gray-700">Manager</a>
                  </MenuItem>
                )}

                {/* Display logged-in user name */}
                {user && (
                  <MenuItem className="px-4 py-2 text-sm text-gray-700">
                    <span className="block text-gray-700 font-semibold">Hello, {user.username}</span>
                  </MenuItem>
                )}

                {/* Sign out button */}
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
                    type="button"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default Navbar;
