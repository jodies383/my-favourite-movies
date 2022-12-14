import React,{ useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router";
import UserContext from '../Contexts/UserContext';
import AxiosInstance from "../Hooks/AxiosInstance";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    InputAdornment,
    Drawer,
    ListItem,
    ListItemIcon,
    ListItemText,
    InputLabel,
    FormControl,
    Input,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Delete, Bookmarks, Menu, Add, Person2 } from '@mui/icons-material';
import Popcorn from './Icons/Popcorn';

export default function Header() {
    const navigate = useNavigate();
    const axios = AxiosInstance();
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [playlist, setPlaylist] = useState('');
    const [allPlaylists, setAllPlaylists] = useState('');
    const [playlist_name, setPlaylist_Name] = useState('');
    const { userId, username, focusPlaylist, setFocusPlaylist, user } = useContext(UserContext);

    useEffect(() => {
        if (userId !== undefined) {
            axios.get(`/api/playlists/${userId}`).then((response) => {
                const { data } = response
                if (data.message == 'expired'){
                    handleLogout()
                } else {
                    setAllPlaylists(data.playlistNames)
                }

            })
        }
    }, [username, focusPlaylist, allPlaylists, user]);

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
    const deletePlaylist = async() => {
        if (userId !== undefined)
           await axios.delete(`/api/playlist?id=${userId}&playlist_name=${focusPlaylist}`).then(() => {
                handleClose()
                navigate("/my-favourite-movies/Home");
            })
    }

    const createNewPlaylist = async() => {
        if (userId !== undefined)
           await axios.post(`/api/new_playlist/${userId}`, { playlist_name }).then((response) => {
                console.log(response)
                axios.get(`/api/playlists/${userId}`).then((response) => {
                    const { data } = response
                    console.log(data)
                    setAllPlaylists(data.playlist)
                })
                setPlaylist_Name('')
            })
    }

    useEffect(() => {
        if (userId !== undefined)
            axios.get(`/api/all_playlist_titles/${userId}`).then((response) => {
                const { data } = response
                setPlaylist(data.playlist)
            });
    }, []);
    
    return (
        <div className="App">
            <Box sx={{ flexGrow: 1, }}>
                <AppBar position="static" sx={{ backgroundColor: '#2c3440' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2, display: 'flex', flexDirection: 'column' }}
                            onClick={() => setOpen(true)}
                        >
                            <Popcorn style={{ height: 45, width: 56 }} />
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <h2>my favourite movies</h2>
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>

            <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)} style={{ textAlign: 'center', margin: 5 }}>
                <Box sx={{ backgroundColor: '#2c3440', color: 'white' }}>
                    {user && <h2><Person2 style={{ height: 25, width: 28 }}/> {user.first_name} {user.last_name}</h2>}
                </Box>
                <FormControl variant="standard" style={{ margin: 10 }}>
                    <InputLabel htmlFor="input-with-icon-adornment">
                        Create a new playlist
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
                <div style={{ width: 250, margin: 10 }} onClick={() => setOpen(false)}>

                    {allPlaylists.length > 0 ? allPlaylists.map((res, index) =>
                        <ListItem key={index} >
                            <ListItemIcon><Bookmarks /></ListItemIcon>
                            <ListItemText primary={`${res.playlist_name}`} onClick={() => { navigate('/my-favourite-movies/Favourites'); setFocusPlaylist(res.playlist_name) }} sx={{ cursor: 'pointer' }} />
                            <Delete style={{ color: 'grey' }} onClick={() => { handleClickOpen(); setFocusPlaylist(res.playlist_name) }} sx={{ cursor: 'pointer' }} />
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


