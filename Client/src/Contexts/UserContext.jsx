import { createContext, useState, useEffect } from 'react';
import AxiosInstance from "../Hooks/AxiosInstance";


const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const axios = AxiosInstance();
  const [focusPlaylist, setFocusPlaylist] = useState();
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();
  const [movieId, setMovieId] = useState();
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [playlist, setPlaylist] = useState();
  const [playlistNames, setPlaylistNames] = useState();
  const api_key = import.meta.env.VITE_API_KEY

  useEffect(() => {
    if (username == undefined)
    setUsername('harryP')
  }, [username])

  useEffect(() => {
    if (username == undefined) setUsername(localStorage.getItem('username'))
   
    const getUserId = () => {
      axios.get(`/api/user/${username}`).then(async (res) => {
        const { data } = res
        setUserId(data.user.id)
        setUser(data.user)
        setUserData(data)
      })
    }
    if (userId == undefined && username !== undefined) {
      getUserId();
    }
  }, [username, userId, user])

  useEffect(() => {
    if (username == undefined) setUsername(localStorage.getItem('username'))
    if (userId !== undefined)
      axios.get(`/api/all_playlist_titles/${userId}`).then(async (response) => {
        const { data } = response

        let playlistData = data.playlist
        const movies = playlistData.map(async element => {
          try {
            const result = await axios
              .get(`https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=${api_key}`);
            return result.data;
          } catch (e) {
            return console.log(e);
          }
        });
        playlistData = await Promise.all(movies)
        setPlaylist(playlistData)
      });
  }, [username, userId]);

  useEffect(() => {
   if (username == undefined) setUsername(localStorage.getItem('username'))
    if (userId !== undefined)
      axios.get(`/api/playlists/${userId}`).then((response) => {
        const { data } = response
        setPlaylistNames(data.playlistNames)
      })
  }, [username, userId]);


  return (
    <UserContext.Provider
      value={{
        focusPlaylist, setFocusPlaylist, username, setUsername,
        userId, setUserId, movieId, setMovieId, user, setUser, userData, setUserData,
        playlist, setPlaylist, playlistNames, setPlaylistNames
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;