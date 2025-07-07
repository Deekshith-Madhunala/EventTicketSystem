import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../components/ErrorFallback.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import { useLocation } from "react-router-dom";  // Import useLocation to check the current path

export const Layout = ({ children }) => {
  const location = useLocation();  // Get the current location (path)

  // Don't show Navbar on Login or Register pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbar && <Navbar />}
      
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {children}
      </ErrorBoundary>
    </>
  );
};
