import { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router";
import Header from './Header';
import UserContext from '../Contexts/UserContext';
import AddToFavsModal from './AddToFavsModal';
import {
  Box,
  IconButton,
  InputAdornment,
  InputBase,
  Modal,
  CircularProgress,
} from '@mui/material';
import { Search, BookmarkAdd, BookmarkRemove } from '@mui/icons-material';
import AxiosInstance from "../Hooks/AxiosInstance";

export default function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [movies, setMovies] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [movieResults, setMovieResults] = useState('');
  const { userId, username, setUsername, movieId, setMovieId, playlist, setPlaylist } = useContext(UserContext);
  const [user, setUser] = useState('');
  const axios = AxiosInstance();
  const api = import.meta.env.VITE_API_KEY
  const movie_db_url = `https://api.themoviedb.org/3/movie/popular?api_key=${api}&language=en-US&page=1`;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (username == undefined) setUsername(localStorage.getItem('username'))
    axios.get(movie_db_url).then((response) => {
      const { results } = response.data
      setMovies(results);
      setMovieResults(`Trending movies`)
    });
  }, [username]);
  
  const searchMovies = async () => {
    if (searchInput) {
      await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${api}&query=${searchInput}`).then((result) => {
        const results = result.data.results
        if (results.length < 1) {
          console.log('no movies found')
        } else {
          setMovieResults(`${results.length} movies found`)
          setMovies(results)
        }
      })
    } else {
      axios.get(movie_db_url).then((response) => {
        const { results } = response.data
        setMovies(results);
        setMovieResults(`Trending movies`)
      });
    }
  }
  
  const bookmark = (id) => {
    let movieIdList = []
    playlist ? playlist.map((el) => movieIdList.push(el.id)) : null
    if (movieIdList.includes(id)) {
      return true
    }
    return
  }

  if (!movies) return null;

  return (
    <div className="App">
      <Header />
      <Box margin={5} alignContent='center' justifyContent={'center'}>

        <InputBase
          sx={{
            ml: 1.5, flex: 1, width: 500, alignContent: 'center', borderRadius: 5,
            border: '2.5px solid rgba(0, 0, 0, 0.5)',
          }}
          placeholder="  Search movies..." onChange={({ target }) => setSearchInput(target.value)} onKeyUp={searchMovies}
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
        <div>
        <AddToFavsModal />
        </div>
      </Modal>

      <h2 style={{ textAlign: 'center' }}>{movieResults}</h2>
      <Box className='movieCard' >
        {movies.map((res, index) => <Box key={index}  className='movieCardItems'>
          
          <Box>
            <img className='moviePoster' src={`https://image.tmdb.org/t/p/original/${res.poster_path}`} width='100%' />
            <br />
            {!res.id ? <CircularProgress /> : bookmark(res.id) == true ? <IconButton key={index} onClick={() => { handleOpen(); setMovieId(res.id) }}>
              <BookmarkRemove sx={{ color: '#272d36' }} />
            </IconButton> : <IconButton onClick={() => { handleOpen(); setMovieId(res.id) }}>
              <BookmarkAdd />
            </IconButton>}
            <br />
            <b>{res.title}</b>
            <br />
            <b>{res.release_date.substr(0, 4)}</b>
            <br />
            <b>{res.vote_average}★</b>
          </Box>
        </Box>
        )
        }
      </Box>
    </div >
  )
}


