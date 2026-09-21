import { BrowserRouter, Routes, Route } from 'react-router-dom'

// ================================
// ADMIN PAGES
// ================================
import Dashboard from './pages/admin/Dashboard'
import Events from './pages/admin/Events'
import CreateEvent from './pages/admin/CreateEvent'
import EventDetails from './pages/admin/EventDetails'
import TeamMembers from './pages/admin/TeamMembers'
import Photos from './pages/admin/Photos'
import UploadPhotos from './pages/admin/UploadPhotos'
import Galleries from './pages/admin/Galleries'
import GalleryManagement from './pages/admin/GalleryManagement'

// ================================
// HOME PAGE
// ================================
import Home from './pages/Home'

// ================================
// TEAM PAGES
// ================================
import TeamDashboard from './pages/team/Dashboard'
import TeamEventDetails from './pages/team/EventDetails'
import TeamUploadPhotos from './pages/team/UploadPhotos'

// ================================
// CUSTOMER PAGES
// ================================
import GalleryPin from './pages/customer/GalleryPin'
import Gallery from './pages/customer/Gallery'

// ================================
// AUTH PAGES
// ================================
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================
            HOME
        ================================= */}
        <Route path="/" element={<Home />} />


        {/* ================================
            ADMIN ROUTES
        ================================= */}
        <Route path="/admin" element={<Dashboard />} />

        <Route
          path="/admin/events"
          element={<Events />}
        />

        <Route
          path="/admin/events/create"
          element={<CreateEvent />}
        />

        <Route
          path="/admin/events/:eventId"
          element={<EventDetails />}
        />

        <Route
          path="/admin/team"
          element={<TeamMembers />}
        />

        <Route
          path="/admin/photos"
          element={<Photos />}
        />

        <Route
          path="/admin/photos/upload"
          element={<UploadPhotos />}
        />

        <Route
          path="/admin/upload-photos"
          element={<UploadPhotos />}
        />

        <Route
          path="/admin/galleries"
          element={<Galleries />}
        />

        <Route
          path="/admin/galleries/:galleryId"
          element={<GalleryManagement />}
        />


        {/* ================================
            TEAM ROUTES
        ================================= */}
        <Route
          path="/team"
          element={<TeamDashboard />}
        />

        <Route
          path="/team/events/:eventId"
          element={<TeamEventDetails />}
        />

        <Route
          path="/team/events/:eventId/upload"
          element={<TeamUploadPhotos />}
        />


        {/* ================================
            CUSTOMER GALLERY ROUTES
        ================================= */}
        <Route
          path="/gallery/:galleryToken"
          element={<GalleryPin />}
        />

        <Route
          path="/gallery/:galleryToken/photos"
          element={<Gallery />}
        />


        {/* ================================
            AUTH ROUTES
        ================================= */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================================
            FALLBACK
        ================================= */}
        <Route
          path="*"
          element={<Login />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App