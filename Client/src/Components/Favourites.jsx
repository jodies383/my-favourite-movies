import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router";
import Header from './Header';
import UserContext from '../Contexts/UserContext';
import {
  Box,
  Button,
  IconButton,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { BookmarkRemove, Close } from '@mui/icons-material';
import AxiosInstance from "../Hooks/AxiosInstance";

export default function Favourites() {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState('');
  const { username, setUsername, focusPlaylist, userId, playlist, setPlaylist } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const axios = AxiosInstance();

  const getPlaylistData = async () => {
    if (userId !== undefined)
      await axios.get(`/api/playlists/${userId}`).then(async (response) => {
        const { data } = response

        let playlistData = data.playlist
        const movies = playlistData.map(async element => {
          try {
            const result = await axios.get(`https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=511ebf4540231b1f06e7bec72f6b4a05`);
            return result.data;
          } catch (e) {
            return console.log(e);
          }
        });
        playlistData = await Promise.all(movies)
        setPlaylist(playlistData)
      });
  }
  const getMoviesInPlaylist = async () => {
    if (userId !== undefined)
      await axios.get(`/api/playlist_titles/${userId}/${focusPlaylist}`).then(async response => {
        const { data } = response
        let res = data.playlist
        const movies = res.map(async element => {
          try {
            const result = await axios.get(`https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=511ebf4540231b1f06e7bec72f6b4a05`);
            return result.data;
          } catch (e) {
            return console.log(e);
          }
        });
        setFavourites(await Promise.all(movies))
      }).catch(e => console.log(e))
  }
  const removeMovie = async (movie) => {
    await axios
      .delete(`/api/playlist_titles?id=${userId}&movie_id=${movie}&playlist_name=${focusPlaylist}`)
      .then((result) => {
        getMoviesInPlaylist()
        getPlaylistData()
        openSnackbar()
      });
  }
  useEffect(() => {
    getPlaylistData
  }, [username, playlist]);

  const openSnackbar = () => {
    setOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getMoviesInPlaylist()
  }, [username, focusPlaylist, userId, favourites]);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="App">
      <Header />
      <Button variant="contained" sx={{ m: 1 }} onClick={() => navigate('/my-favourite-movies/Home')}>Back to Movies</Button>
      <h2 style={{ textAlign: 'center', fontSize: '44px' }}>{focusPlaylist}</h2>
      <Box className='circularProgress'>
        {!favourites ? <CircularProgress /> : favourites.length > 0 ? <h2>Your favourites in this playlist</h2> : <h2 style={{ textAlign: 'center' }}>You have no favourites here yet...</h2>}
      </Box>
      <Box className='movieCard'>
        {favourites ? favourites.map((res, index) => <Box key={index} className='movieCardItems'>

          <Box>
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
          </Box>
        </Box>
        ) : null
        }
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        message={'removed from playlist'}
        action={action}
      />
    </div>
  )
}
