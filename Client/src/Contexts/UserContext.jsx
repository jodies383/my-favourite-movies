import { createContext, useState, useEffect } from 'react';
import AxiosInstance from "../Hooks/AxiosInstance";
    

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const axios = AxiosInstance()
  const [focusPlaylist, setFocusPlaylist] = useState()
  const [username, setUsername] = useState()
  const [userId, setUserId] = useState()
  const [movieId, setMovieId] = useState()
  const [userData, setUserData] = useState()

  useEffect(() => {

    if (username == undefined || null) setUsername(localStorage.getItem('username'))
    axios.get(`/api/playlists/${username}`).then(async (res) => {
      const { data } = res
      setUserId(data.user_id)
      setUserData(data)
    
    })
    console.log(username)
  }, [username, userId]);

  

  return (
    <UserContext.Provider
      value={{
        focusPlaylist, setFocusPlaylist, username, setUsername,
        userId, setUserId, movieId, setMovieId, userData, setUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;