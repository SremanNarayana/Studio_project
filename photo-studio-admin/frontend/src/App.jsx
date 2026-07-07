import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookingList from './pages/BookingList.jsx';
import BookingForm from './pages/BookingForm.jsx';
import BookingDetails from './pages/BookingDetails.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/bookings/new" element={<BookingForm />} />
        <Route path="/bookings/:id/edit" element={<BookingForm />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AdminLayout>
  );
}
