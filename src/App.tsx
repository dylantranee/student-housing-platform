

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ComparePricesPage from './pages/ComparePricesPage';
import AddRentalPropertyPage from './pages/AddRentalPropertyPage';
import LoginPage from './screen/auth/LoginPage';
import RegisterPage from './screen/auth/RegisterPage';
import PrivateRoute from './components/auth/PrivateRoute';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="/compare-prices" element={<ComparePricesPage />} />
        <Route path="/add-rental-property" element={<AddRentalPropertyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
