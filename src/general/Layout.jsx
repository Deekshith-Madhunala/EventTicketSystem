import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../components/ErrorFallback.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";

export const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {children}
      </ErrorBoundary>
    </>
  );
};
