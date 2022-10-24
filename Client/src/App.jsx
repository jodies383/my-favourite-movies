import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home'
import Login from './Components/Login'
import SignUp from './Components/Signup'
import Favourites from './Components/Favourites'
import AddToFavsModal from './Components/AddToFavsModal';
import { UserProvider } from './Contexts/UserContext';
import './App.css'

function App() {

  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/my-favourite-movies/" element={<Login />} />
            <Route path="/my-favourite-movies/Signup" element={<SignUp />} />
            <Route path="/my-favourite-movies/Home" element={<Home />} />
            <Route path="/my-favourite-movies/Favourites" element={<Favourites />} />
            <Route path="/my-favourite-movies/AddToFavsModal" element={<AddToFavsModal />} />
          </Routes>
        </Router>
      </UserProvider>
    </>
  )
}

export default App
