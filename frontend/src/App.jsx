import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'

// Single scrolling page — every section lives on home and the navbar
// scrolls between sections. Unknown URLs bounce back to home.
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-cream text-ink">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
