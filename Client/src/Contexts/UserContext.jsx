import { createContext, useState, useEffect } from 'react';


const UserContext = createContext({});

export const UserProvider = ({ children }) => {

  const [focusPlaylist, setFocusPlaylist] = useState();
  const [username, setUsername] = useState();
  const [movieId, setMovieId] = useState()

  useEffect(() => {
    
   if (username == undefined || null) setUsername(localStorage.getItem('username'))
   console.log(username)
}, [username]);

  return (
    <UserContext.Provider
      value={{
        focusPlaylist, setFocusPlaylist, username, setUsername, movieId, setMovieId
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;