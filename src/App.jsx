import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter here
import { AppRouter } from './general/Router.jsx';  // Import AppRouter
import { Loading } from './components/Loading.jsx';
import { AuthProvider } from './components/Auth/AuthContext.jsx';

// PageWithHeader component for layout consistency
export const PageWithHeader = ({ children }) => (
  <div className="flex h-full flex-col">{children}</div>
);

export const App = () => (
  <BrowserRouter> {/* Ensure that BrowserRouter is wrapping the entire app */}
    <AuthProvider>
      <Suspense
        fallback={
          <PageWithHeader>
            <Loading name="suspense" />  {/* Show a loading component while the app is loading */}
          </PageWithHeader>
        }
      >
        <div>
          <AppRouter />  {/* Use AppRouter to handle the routing */}
        </div>
      </Suspense>
    </AuthProvider>
  </BrowserRouter >
);
