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

const baseURL = "https://api.themoviedb.org/3/movie/popular?api_key=511ebf4540231b1f06e7bec72f6b4a05&language=en-US&page=1";
const URL_BASE = 'https://favourite-movie-server.herokuapp.com'

export default function Header() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState('')
    const [playlist, setPlaylist] = useState('')

    const handleLogout = () => {
        localStorage.clear()
        navigate("/my-favourite-movies/");
    }


    useEffect(() => {
        const username = localStorage.getItem('username')
        axios.get(`${URL_BASE}/api/playlist/${username}`).then((response) => {
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
                {user ? user.map((res) =>

                    <h2>Hi {res.first_name} {res.last_name}</h2>
                ) : null}
                <hr />
                <div style={{ width: 250 }} onClick={() => setOpen(false)}>

                    <ListItem onClick={() => navigate('/my-favourite-movies/Favourites')} sx={{cursor: 'pointer'}}>
                        <ListItemIcon><BookmarksIcon /></ListItemIcon>
                        <ListItemText primary={`Your favourites (${playlist.length})`} />
                    </ListItem>

                </div>
            </Drawer>

        </div>
    )
}
