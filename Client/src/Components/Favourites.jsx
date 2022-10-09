import { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router";
import Header from './Header';
import UserContext from '../Contexts/UserContext';
import {
  Box,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { BookmarkRemove } from '@mui/icons-material';
import AxiosInstance from "../Hooks/AxiosInstance";

export default function Favourites() {
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState('');
  const { username, setUsername, focusPlaylist } = useContext(UserContext);

  const axios = AxiosInstance();

  useEffect(() => {
    if (username == undefined) setUsername(localStorage.getItem('username'))

    axios.get(`/api/playlist_titles/${username}/${focusPlaylist}`).then(async response => {
      const { data } = response
      console.log(data)
      let res = data.playlist
      const movies = res.map(async element => {
        try {
          const result = await axios.get(`https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=511ebf4540231b1f06e7bec72f6b4a05`);
          console.log(result.data);
          return result.data;
        } catch (e) {
          return console.log(e);
        }

      });
      setPlaylist(await Promise.all(movies))

    }).catch(e => console.log(e))


  }, [username, focusPlaylist]);

  const removeMovie = (movie) => {

    axios
      .delete(`/api/playlist?username=${username}&movie_id=${movie}`)
      .then((result) => {
        console.log('removed from favourites')
      });
  }
  return (
    <div className="App">
      <Header />
      <Button variant="contained" sx={{ m: 1 }} onClick={() => navigate('/my-favourite-movies/Home')}>Back to Movies</Button>
      
      <Box className='circularProgress'>
        {!playlist ? <CircularProgress  /> : playlist.length > 0 ? <h2 style={{ textAlign: 'center' }}>Your favourites</h2> : <h2 style={{ textAlign: 'center' }}>You have no favourites yet...</h2>}
      </Box>

      <Box className='movieCard' spacing={2}>
        {playlist ? playlist.map((res, index) => <div key={index} container spacing={2} className='movieCardItems'>

          <div item xs={12} key={index}>
            <img className='moviePoster' src={`https://image.tmdb.org/t/p/original/${res.poster_path}`} width='100%' />
            <br />
            <IconButton onClick={() => removeMovie(res.id)}>
              <BookmarkRemove sx={{ color: 'black' }} />
            </IconButton>
            <br />
            <b>{res.title}</b>
            <br />
            <b>{res.release_date.substr(0, 4)}</b>
            <br />
            <b>{res.vote_average}★</b>
          </div>
        </div>
        ) : null
        }

      </Box>
    </div>
  )
}
