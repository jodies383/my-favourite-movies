import { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import Header from './Header';

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  InputBase,
  Modal,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  Checkbox,
} from '@mui/material';

import {
  Menu,
  Search,
  BookmarkAdd,
  Bookmarks,
  BookmarkRemove,
  Add,
  Delete
} from '@mui/icons-material';


import axios from "axios"

const baseURL = "https://api.themoviedb.org/3/movie/popular?api_key=511ebf4540231b1f06e7bec72f6b4a05&language=en-US&page=1";
const URL_BASE = 'https://favourite-movie-server.herokuapp.com'

export default function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [movieResults, setMovieResults] = useState('');
  const [playlist, setPlaylist] = useState('');
  const [playlist_name, setPlaylist_Name] = useState('')
  const [allPlaylists, setAllPlaylists] = useState('')
  const [movieId, setMovieId] = useState('')

  const [user, setUser] = useState('')


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const username = localStorage.getItem('username')
    axios.get(`${URL_BASE}/api/all_playlist_titles/${username}`).then(async (response) => {
      const { data } = response
      //console.log(results)
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
  }, []);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      const { results } = response.data
      //console.log(results)
      setPost(results);
      setMovieResults(`Trending movies`)
    });
  }, []);
  const createNewPlaylist = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

    const username = localStorage.getItem('username')
    axios.post(`${URL_BASE}/api/new_playlist/${username}`, { playlist_name }).then((response) => {
      axios.get(`${URL_BASE}/api/playlists/${username}`).then((response) => {
        const { data } = response
        setAllPlaylists(data.playlist)
      })
    })
  }

  const searchMovies = async () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    if (searchInput) {
      await axios
        .get(`https://api.themoviedb.org/3/search/movie?api_key=511ebf4540231b1f06e7bec72f6b4a05&query=${searchInput}`)
        .then((result) => {
          const results = result.data.results
          if (results.length < 1) {
            console.log('no movies found')
          } else {
            setMovieResults(`${results.length} movies found`)
            setPost(results)
            console.log(results)

          }
        })
    } else {
      axios.get(baseURL).then((response) => {
        const { results } = response.data
        //console.log(results)
        setPost(results);
        setMovieResults(`Trending movies`)
      });
    }
  }
  const removeMovie = (movie) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const username = localStorage.getItem('username')
    axios
      .delete(`${URL_BASE}/api/playlist?username=${username}&movie_id=${movie}`)
      .then((result) => {
        if (result.data.message == 'success') {
          axios
            .get(`${URL_BASE}/api/playlist/${username}`)
            .then(async (result) => {
              setUser(result.data.user)
              let res = result.data.playlist
              const movies = res.map(element => {
                return axios
                  .get(`https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=511ebf4540231b1f06e7bec72f6b4a05`)
                  .then((result) => {

                    return result.data
                  }).catch(e => console.log(e))

              });
              setPlaylist(await Promise.all(movies))
            });
        }
      });
  }
  const bookmark = (id) => {
    let movieIdList = []
    playlist ? playlist.map((el) => movieIdList.push(el.id)) : null
    if (movieIdList.includes(id)) {
      return true
    }
    return
  }
  const checkPlaylist = (playlistName) => {
    let list = []
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const username = localStorage.getItem('username')
    axios.get(`${URL_BASE}/api/playlist_titles/${username}/${playlistName}`).then(async (response) => {
      const { data } = response

      data.playlist.map((elem) => { list.push(elem.movie_id) })
      
    })
    if (list.includes(movieId)) {
      console.log('the condition is true')
    
      return true
    }
    return
  }

  const addToFavourites = async (id, playlist_name) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const username = localStorage.getItem('username')
    axios
      .post(`${URL_BASE}/api/playlist_titles/${username}/${playlist_name}`, { movieId: id })
      .then((result) => {

        if (result.data.message == 'success') {
          axios
            .get(`${URL_BASE}/api/playlist/${username}`)
            .then(async (result) => {
              setUser(result.data.user)
              let res = result.data.playlist
              const movies = res.map(element => {
                return axios
                  .get(`https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=511ebf4540231b1f06e7bec72f6b4a05`)
                  .then((result) => {

                    return result.data
                  }).catch(e => console.log(e))

              });
              setPlaylist(await Promise.all(movies))
              console.log(playlist)
            });
        }
      });
  }
  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const username = localStorage.getItem('username')
    axios.get(`${URL_BASE}/api/playlists/${username}`).then((response) => {
      const { data } = response
      setAllPlaylists(data.playlist)
    })
  }, []);

  if (!post) return null;

  return (
    <div className="App">
      <Header />
      <Box margin={5} alignContent='center' justifyContent={'center'}>

        <InputBase
          sx={{
            ml: 3.5, flex: 1, width: 400, alignContent: 'center', borderRadius: '3px',
            border: '1.5px solid rgba(0, 0, 0, 0.5)',
          }}
          placeholder="Search movies..." onChange={({ target }) => setSearchInput(target.value)} onKeyUp={searchMovies}
          endAdornment={
            <InputAdornment position="end">
              <Search />
            </InputAdornment>}
        />
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FormControl variant="standard">
            <InputLabel htmlFor="input-with-icon-adornment">
              Create new playlist
            </InputLabel>
            <Input
              id="input-with-icon-adornment"
              value={playlist_name}
              onChange={({ target }) => setPlaylist_Name(target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => createNewPlaylist()}>
                    <Add />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {Array.isArray(playlist) ? allPlaylists.map((res, index) =>
              <ListItem key={index}>
                {  console.log(checkPlaylist(res.playlist_name)) && checkPlaylist(res.playlist_name) === true ? 
                <Checkbox defaultChecked /> : <Checkbox onChange={() => addToFavourites(movieId, res.playlist_name)} />
                }
                <ListItemIcon><Bookmarks /></ListItemIcon>
                <ListItemText primary={`${res.playlist_name}`} onClick={() => navigate('/my-favourite-movies/Favourites')} sx={{ cursor: 'pointer' }} />
              </ListItem>
            )
              : null}
          </Typography>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>

      <h2 style={{ textAlign: 'center' }}>{movieResults}</h2>
      <Box className='movieCard' spacing={2}>
        {post.map((res, index) => <div key={index} container spacing={2} className='movieCardItems'>
          <div item xs={12}>

            <img className='moviePoster' src={`https://image.tmdb.org/t/p/original/${res.poster_path}`} width='100%' />
            <br />
            {!res.id ? <CircularProgress /> : bookmark(res.id) == true ? <IconButton key={index} onClick={() => { handleOpen(); setMovieId(res.id) }}>
              <BookmarkRemove sx={{ color: 'black' }} />
            </IconButton> : <IconButton onClick={() => { handleOpen(); setMovieId(res.id) }}>
              <BookmarkAdd />
            </IconButton>}
            <br />
            <b>{res.title}</b>
            <br />
            <b>{res.release_date.substr(0, 4)}</b>
            <br />
            <b>{res.vote_average}★</b>
          </div>
        </div>
        )
        }

      </Box>
    </div >
  )
}


