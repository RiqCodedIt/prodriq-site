// import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
// import { CardProvider } from './context/CardContext'
import About from './pages/About'
import Beats from './pages/Beats'
import Mixing from './pages/Mixing'
import Booking from './pages/Booking'
import Success from './pages/Success'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/beats" element={<Beats />} />
        <Route path="/mixing" element={<Mixing />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  )
}

export default App
