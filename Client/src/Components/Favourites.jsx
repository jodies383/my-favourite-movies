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

const baseURL = "https://api.themoviedb.org/3/movie/popular?api_key=511ebf4540231b1f06e7bec72f6b4a05&language=en-US&page=1";
const URL_BASE = 'https://favourite-movie-server.herokuapp.com'

export default function Favourites() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [playlist, setPlaylist] = useState('');
  const [user, setUser] = useState('')

  useEffect(() => {
    const username = localStorage.getItem('username')
    axios.get(`${URL_BASE}/api/playlist/${username}`).then(async (response) => {
      const { data } = response
      //console.log(results)
      let res = data.playlist
      const movies = res.map(async element => {
        try {
          const result = await axios
            .get(`https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=511ebf4540231b1f06e7bec72f6b4a05`);
          console.log(result.data);
          return result.data;
        } catch (e) {
          return console.log(e);
        }

      });
      setPlaylist(await Promise.all(movies))
    });
  }, []);

  const removeMovie = (movie) => {
    const username = localStorage.getItem('username')
    axios
      .delete(`${URL_BASE}/api/playlist?username=${username}&movie_id=${movie}`)
      .then((result) => {
        console.log('removed from favourites')
      });
  }
  return (
    <div className="App">
      <Header />
      <Button variant="contained" sx={{ m: 1 }} onClick={() => navigate('/my-favourite-movies/Home')}>Back to Movies</Button>
      <Box margin={5} alignContent='center' justifyContent={'center'}>
        
        {!playlist ? <CircularProgress style={{ textAlign: 'center' }}/> : playlist.length > 0 ? <h2 style={{ textAlign: 'center' }}>Your favourites</h2> : <h2 style={{ textAlign: 'center' }}>You have no favourites yet...</h2>}
      </Box>
      <Box className='movieCard' spacing={2}>
        {playlist ? playlist.map((res, index) => <div container spacing={2} className='movieCardItems'  >

          <div item xs={12} key={index}>
            <img className='moviePoster' src={`https://image.tmdb.org/t/p/original/${res.poster_path}`} width='100px' />
            <br />
            <IconButton onClick={() => removeMovie(res.id)}>
              <BookmarkRemoveIcon sx={{color: 'black'}}/>
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