import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Home from './Components/Home'
import Login from './Components/Login'
import SignUp from './Components/Signup'
import Favourites from './Components/Favourites'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/my-favourite-movies/" element={<SignUp />} />
        <Route path="/my-favourite-movies/Login" element={<Login />} />
        <Route path="/my-favourite-movies/Home" element={<Home />} />
        <Route path="/my-favourite-movies/Favourites" element={<Favourites />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
