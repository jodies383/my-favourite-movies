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
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

const baseURL = "https://api.themoviedb.org/3/movie/popular?api_key=511ebf4540231b1f06e7bec72f6b4a05&language=en-US&page=1";
const URL_BASE = 'https://favourite-movie-server.herokuapp.com'

export default function Header() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState('')
    const [playlist, setPlaylist] = useState('')
    const [allPlaylists, setAllPlaylists] = useState('')
    const [playlist_name, setPlaylist_Name] = useState('')

    const handleLogout = () => {
        localStorage.clear()
        navigate("/my-favourite-movies/");
    }

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

        const username = localStorage.getItem('username')
        axios.get(`${URL_BASE}/api/playlists/${username}`).then((response) => {
            const { data } = response
            setAllPlaylists(data.playlist)
        })
    }, []);

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        const username = localStorage.getItem('username')
        axios.get(`${URL_BASE}/api/playlist//api/playlist_titles/${username}/:playlist_name`).then((response) => {
            const { data } = response
            console.log(data)
            setPlaylist(data.playlist)
            setUser(data.user)
            //console.log(results)

        });
    }, []);


    return (
        <div className="App">
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <p>My Favourite Movies</p>
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>

            <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)} style={{ textAlign: 'center' }}>
            <TextField id="standard-basic" label="Create new playlist" variant="standard"/>
            <IconButton>
                <AddIcon />
            </IconButton>
                {user ? user.map((res) =>

                    <h2>Hi {res.first_name} {res.last_name}</h2>
                ) : null}
                <hr />
                <div style={{ width: 250 }} onClick={() => setOpen(false)}>

                    {playlist ? allPlaylists.map((res) =>
                    <ListItem onClick={() => navigate('/my-favourite-movies/Favourites')} sx={{cursor: 'pointer'}}>
                        <ListItemIcon><BookmarksIcon /></ListItemIcon>
                        <ListItemText primary={`${res.playlist_name}`} />
                    </ListItem>
                    )
                    : null}

                </div>
            </Drawer>

        </div>
    )
}
