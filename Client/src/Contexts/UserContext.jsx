import { createContext, useState, useEffect } from 'react';
import AxiosInstance from "../Hooks/AxiosInstance";


const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const axios = AxiosInstance();
  const [focusPlaylist, setFocusPlaylist] = useState();
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();
  const [movieId, setMovieId] = useState();
  const [userData, setUserData] = useState();
  const [playlist, setPlaylist] = useState();
  const [playlistNames, setPlaylistNames] = useState();

  useEffect(() => {
    if (username == undefined || null) setUsername(localStorage.getItem('username'))
    if (username !== undefined)
    axios.get(`/api/user/${username}`).then(async (res) => {
      const {data} = res
      setUserId(data.user.id)
      setUserData(data)
    })
  }, [username, userId])
  // useEffect(() => {
  //   if (username == undefined || null) setUsername(localStorage.getItem('username'))
  //   if (username !== undefined)
  //     axios.get(`/api/playlists/${username}`).then(async (res) => {
  //       const { data } = res
  //       setUserId(data.user.id)
  //       setUserData(data)
  //     })
  // }, [username, userId]);

  useEffect(() => {
    if (username == undefined) setUsername(localStorage.getItem('username'))
    if (username !== undefined)
      axios.get(`/api/all_playlist_titles/${userId}`).then(async (response) => {
        const { data } = response

        let playlistData = data.playlist
        const movies = playlistData.map(async element => {
          try {
            const result = await axios
              .get(`https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=511ebf4540231b1f06e7bec72f6b4a05`);
            console.log(result.data);
            return result.data;
          } catch (e) {
            return console.log(e);
          }
        });
        playlistData = await Promise.all(movies)
        setPlaylist(playlistData)
      });
  }, [username]);

  useEffect(() => {
    if (username == undefined) setUsername(localStorage.getItem('username'))
    if (username !== undefined)
      axios.get(`/api/playlists/${userId}`).then((response) => {
        const { data } = response
        setPlaylistNames(data.playlistNames)
      })
  }, [username]);


  return (
    <UserContext.Provider
      value={{
        focusPlaylist, setFocusPlaylist, username, setUsername,
        userId, setUserId, movieId, setMovieId, userData, setUserData,
        playlist, setPlaylist, playlistNames, setPlaylistNames
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;