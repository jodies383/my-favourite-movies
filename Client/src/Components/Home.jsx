import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import InputAdornment from '@mui/material/InputAdornment';
import axios from "axios"
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { useNavigate } from "react-router";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';

import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './Header';
import BookmarkRemove from '@mui/icons-material/BookmarkRemove';

const baseURL = "https://api.themoviedb.org/3/movie/popular?api_key=511ebf4540231b1f06e7bec72f6b4a05&language=en-US&page=1";
const URL_BASE = 'https://favourite-movie-server.herokuapp.com'

export default function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [movieResults, setMovieResults] = useState('');
  const [playlist, setPlaylist] = useState('');

  const [user, setUser] = useState('')

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const username = localStorage.getItem('username')
    axios.get(`${URL_BASE}/api/playlist/${username}`).then(async (response) => {
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
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    axios.get(baseURL).then((response) => {
      const { results } = response.data
      //console.log(results)
      setPost(results);
      setMovieResults(`Trending movies`)
    });
  }, []);


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
  const addToFavourites = async (id) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const username = localStorage.getItem('username')
    axios
      .post(`${URL_BASE}/api/playlist/${username}`, { movieId: id })
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
              <SearchIcon />
            </InputAdornment>}
        />
      </Box>

      <h2 style={{ textAlign: 'center' }}>{movieResults}</h2>
      <Box className='movieCard' spacing={2}>
        {post.map((res, index) => <div container spacing={2} className='movieCardItems'>
          <div item xs={12} key={index}>

            <img className='moviePoster' src={`https://image.tmdb.org/t/p/original/${res.poster_path}`} width='100%' />
            <br />
            {bookmark(res.id) == true ? <IconButton key={index} onClick={() => removeMovie(res.id)}>
              <BookmarkRemoveIcon sx={{ color: 'black' }} />
            </IconButton> : <IconButton key={index} onClick={() => addToFavourites(res.id)}>
              <BookmarkAddIcon />
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
    </div>
  )
}


