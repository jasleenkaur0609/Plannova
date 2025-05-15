import { Routes, Route } from 'react-router-dom'
import './input.css'
import Home from './components/Home'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'

import VendorLayout from './components/Vendor/VendorLayout'
import VendorDashboard from './components/Vendor/VendorDashboard'
import VendorServices from './components/Vendor/VendorServices'
import AddService from './components/Vendor/AddService'
import ManageBookings from './components/Vendor/ManageBookings'
import VendorEarnings from './components/Vendor/VendorEarnings'
import VendorProfile from './components/Vendor/VendorProfile'
import VendorReviews from './components/Vendor/VendorReviews'
//import VendorAvailability from './components/Vendor/VendorAvailability'

import AdminLayout from "./components/Admin/AdminLayout"
import AdminDashboard from "./components/Admin/AdminDashboard";
import VendorList from "./components/Admin/VendorList";
import UserList from "./components/Admin/UserList";
import EventList from "./components/Admin/EventList";
import ServiceList from "./components/Admin/ServiceList";
import TransactionList from "./components/Admin/TransactionList";
import VendorPayments from "./components/Admin/VendorPayments";

import UserDashboard from './components/Customer/UserDashboard'
import AddEvent from './components/Customer/AddEvent'
import SelectServices from './components/Customer/SelectServices'
import EventPreview from './components/Customer/EventPreview'
import PaymentPage from "./components/Customer/PaymentPage";


import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className='w-screen h-screen'>
      <Routes>
        
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        <Route path="/" element={<Home />} />

        
        <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
          <Route path="/vendor" element={<VendorLayout />}>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="services" element={<VendorServices />} />
            <Route path="add-service" element={<AddService />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="earnings" element={<VendorEarnings />} />
            <Route path="reviews" element={<VendorReviews />} />
            <Route path="profile" element={<VendorProfile />} />
          </Route>
        </Route>

        
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="vendor-list" element={<VendorList />} />
            <Route path="user-list" element={<UserList />} />
            <Route path="event-list" element={<EventList />} />
            <Route path="services" element={<ServiceList />} />
            <Route path="transactions" element={<TransactionList />} />
            <Route path="payments" element={<VendorPayments />} />
          </Route>
        </Route>

        
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/customer/dashboard" element={<UserDashboard />} />
          <Route path="/customer/add-event" element={<AddEvent />} />
          <Route path="/customer/select-services" element={<SelectServices />} />
          <Route path="/customer/event-preview" element={<EventPreview />} />
          <Route path="/customer/payment" element={<PaymentPage />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App