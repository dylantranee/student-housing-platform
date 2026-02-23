

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ComparePricesPage from './pages/ComparePricesPage';
import AddRentalPropertyPage from './pages/AddRentalPropertyPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PrivateRoute from './components/auth/PrivateRoute';
import PropertyDetailPage from './pages/PropertyDetailPage';
import { BrowseRoommatesPage } from './pages/BrowseRoommatesPage';
import MyRequestsPage from './pages/MyRequestsPage';
import ScrollToTop from './components/common/ScrollToTop';


import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          <Route path="/requests" element={
            <PrivateRoute>
              <MyRequestsPage />
            </PrivateRoute>
          } />
          <Route path="/roommates/browse" element={
            <PrivateRoute>
              <BrowseRoommatesPage />
            </PrivateRoute>
          } />
          <Route path="/compare-prices" element={<ComparePricesPage />} />
          <Route path="/add-rental-property" element={<AddRentalPropertyPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
