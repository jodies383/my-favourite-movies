import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from "react-router";
import UserContext from '../Contexts/UserContext';
import {
    Box,
    Typography,
    IconButton,
    InputAdornment,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    FormControl,
    Input,
    InputLabel,
    Checkbox,
    Modal,
    Snackbar
} from '@mui/material';
import { Bookmarks, Add, Close } from '@mui/icons-material';
import AxiosInstance from "../Hooks/AxiosInstance";

export default function AddToFavsModal() {
    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState('');
    const [playlist_name, setPlaylist_Name] = useState('');
    const { username, movieId, setMovieId, userId, setUsername, playlistNames, setPlaylistNames } = useContext(UserContext);
    const [user, setUser] = useState('');
    const axios = AxiosInstance();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [dataRes, setDataRes] = useState(false);
    const [movieDetails, setMovieDetails] = useState('');
    const [message, setMessage] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        if (userId !== undefined)
            axios.get(`/api/playlists/${userId}`).then(async (response) => {
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
    }, [username]);

    useEffect(() => {
        const isInPlaylist = async () => {
            const inPlaylist = await axios.get(`/api/in_playlist?id=${userId}&movie_id=${movieId}`)
            const { data } = inPlaylist
            setMovieDetails(data.movieInfo)
        }

        isInPlaylist()
    }, [movieDetails, userId]);

    const getPlaylistNames = async () => {
        await axios.get(`/api/playlists/${userId}`).then((response) => {
            const { data } = response
            setPlaylistNames(data.playlistNames)
        })
    }

    const createNewPlaylist = async () => {
        if (userId !== undefined)
            await axios.post(`/api/new_playlist/${userId}`, { playlist_name }).then(() => {
                getPlaylistNames()
                setPlaylist_Name('')
            })
    }

    const addToFavourites = async (playlist_name) => {
        if (username !== undefined)
            await axios.post(`/api/playlist_titles/${userId}/${playlist_name}/${movieId}`).then(() => {
                setMessage(`added to playlist ${playlist_name}`)
                alertSnackbar()
            })
    }
    const removeFromFavourites = async (playlist) => {
        if (userId !== undefined)
            await axios.delete(`/api/playlist_titles?id=${userId}&movie_id=${movieId}&playlist_name=${playlist}`).then(() => {
                setMessage(`removed from playlist ${playlist}`)
                alertSnackbar()
            })
    }

    const checkPlaylist = (playlistName) => {
        if (Array.isArray(movieDetails)) {
            const result = movieDetails.some(movie => movie.playlist_name == playlistName)
            return result
        }
    }

    const alertSnackbar = () => {
        setOpenSnackbar(true);
    };
    const closeSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };
    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={closeSnackbar}
            >
                <Close fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
    return (
        <>

            <Box
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
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
                    justifyContent: 'center',
                    borderRadius: 5
                }}>
                <FormControl variant="standard">
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
                <Typography id="modal-modal-description" sx={{ mt: 2 }} component={'span'} variant={'body2'}>
                    <h2>Add to playlist</h2>
                    {Array.isArray(playlistNames) ? playlistNames.map((res, index) =>
                        <ListItem key={index}>
                            {checkPlaylist(res.playlist_name) == true ?
                                <Checkbox key={index}
                                    ref={ref}
                                    defaultChecked={true}
                                    onChange={() => removeFromFavourites(res.playlist_name)}
                                    type="checkbox"
                                    id="subscribe"
                                    name="subscribe"
                                />
                                : <Checkbox onChange={() => addToFavourites(res.playlist_name)} />
                            }
                            <ListItemIcon><Bookmarks /></ListItemIcon>
                            <ListItemText primary={`${res.playlist_name}`} onClick={() => navigate('/my-favourite-movies/Favourites')} sx={{ cursor: 'pointer' }} />
                        </ListItem>)
                        : <CircularProgress />
                    }
                </Typography>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={closeSnackbar}
                message={message}
                action={action}
            />
        </>
    )
}

