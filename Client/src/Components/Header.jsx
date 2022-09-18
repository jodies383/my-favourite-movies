import { useState, useEffect, useContext } from 'react'
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
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import UserContext from '../Contexts/UserContext';
import { Delete } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const baseURL = "https://api.themoviedb.org/3/movie/popular?api_key=511ebf4540231b1f06e7bec72f6b4a05&language=en-US&page=1";
const URL_BASE = 'https://favourite-movie-server.herokuapp.com'

export default function Header() {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState('')
    const [playlist, setPlaylist] = useState('')
    const [allPlaylists, setAllPlaylists] = useState('')
    const [playlist_name, setPlaylist_Name] = useState('')
    const { focusPlaylist, setFocusPlaylist } = useContext(UserContext);

    const handleLogout = () => {
        localStorage.clear()
        navigate("/my-favourite-movies/");
    }
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };
    const deletePlaylist = () => {

        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

        const username = localStorage.getItem('username')
        axios.delete(`${URL_BASE}/api/playlist?username=${username}&playlist_name=${focusPlaylist}`).then((response) => {

            handleClose()
        })
    }
    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

        const username = localStorage.getItem('username')
        axios.get(`${URL_BASE}/api/playlists/${username}`).then((response) => {
            const { data } = response
            setAllPlaylists(data.playlist)
            console.log(allPlaylists)
        })
    }, [focusPlaylist]);

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

    const handleChange = () => (event) => {
        setPlaylist_Name(event.target.value);
    };

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        const username = localStorage.getItem('username')
        axios.get(`${URL_BASE}/api/all_playlist_titles/${username}`).then((response) => {
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

                {user ? user.map((res, index) =>

                    <h2 key={index}>Hi {res.first_name} {res.last_name}</h2>
                ) : null}
                <hr />
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
                                    <AddIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <div style={{ width: 250 }} onClick={() => setOpen(false)}>

                    {playlist ? allPlaylists.map((res, index) =>
                        <ListItem key={index} >
                            <ListItemIcon><BookmarksIcon /></ListItemIcon>
                            <ListItemText primary={`${res.playlist_name}`} onClick={() => { navigate('/my-favourite-movies/Favourites'); setFocusPlaylist(res.playlist_name) }} sx={{ cursor: 'pointer' }} />
                            <Delete onClick={() => { handleClickOpen(); setFocusPlaylist(res.playlist_name) }} sx={{ cursor: 'pointer' }} />
                        </ListItem>
                    )
                        : null}

                </div>
            </Drawer>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Delete ${focusPlaylist} Playlist?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this playlist
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => deletePlaylist()} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
