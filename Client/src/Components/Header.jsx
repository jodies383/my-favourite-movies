import { useState, useEffect, useContext } from 'react'
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
    DialogTitle,

} from '@mui/material';

import { Delete, Bookmarks, Menu, Add, Person } from '@mui/icons-material';


export default function Header() {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState('')
    const [playlist, setPlaylist] = useState('')
    const [allPlaylists, setAllPlaylists] = useState('')
    const [playlist_name, setPlaylist_Name] = useState('')
    const { username, focusPlaylist, setFocusPlaylist, setUsername } = useContext(UserContext);
    const axios = AxiosInstance();

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
        if (username !== undefined)

            axios.delete(`/api/playlist?username=${username}&playlist_name=${focusPlaylist}`).then((response) => {

                handleClose()
            })
    }
    useEffect(() => {
        if (username !== undefined)
            if (username == undefined) setUsername(localStorage.getItem('username'))


        axios.get(`/api/playlists/${username}`).then((response) => {
            const { data } = response
            setAllPlaylists(data.playlist)

        })
    }, [username, focusPlaylist, allPlaylists]);

    const createNewPlaylist = () => {
        if (username !== undefined)

            axios.post(`/api/new_playlist/${username}`, { playlist_name }).then((response) => {
                axios.get(`/api/playlists/${username}`).then((response) => {
                    const { data } = response
                    setAllPlaylists(data.playlist)
                })
                // setPlaylist_Name('')
            })
    }

    const handleChange = () => (event) => {
        setPlaylist_Name(event.target.value);
    };

    useEffect(() => {
        if (username !== undefined)

            axios.get(`/api/all_playlist_titles/${username}`).then((response) => {
                const { data } = response
                console.log(data)
                setPlaylist(data.playlist)
                setUser(data.user)
                //console.log(results)

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
                            sx={{ mr: 2 }}
                            onClick={() => setOpen(true)}
                        >
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <h2>🍿 my favourite movies</h2>
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>

            <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)} style={{ textAlign: 'center', margin: 5 }}>
                <Box sx={{ backgroundColor: '#2c3440', color: 'white' }}>

                    {user ? user.map((res, index) =>
                        <h2 key={index}><Person /> {res.first_name} {res.last_name}</h2>
                    ) : null}
                </Box>
                <FormControl variant="standard" style={{ margin: 10 }}>
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
