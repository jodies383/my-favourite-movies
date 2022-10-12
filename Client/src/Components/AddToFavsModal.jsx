import { useState, useEffect, useContext, useRef } from 'react'
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
    Checkbox
} from '@mui/material';
import { Bookmarks, Add } from '@mui/icons-material';
import AxiosInstance from "../Hooks/AxiosInstance";

export default function AddToFavsModal() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState('');
    const [playlist_name, setPlaylist_Name] = useState('');
    const [allPlaylists, setAllPlaylists] = useState('')
    const { username, movieId, setMovieId, userId } = useContext(UserContext);
    const [user, setUser] = useState('');
    const axios = AxiosInstance();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [dataRes, setDataRes] = useState(false);
    const [movieDetails, setMovieDetails] = useState('')
    const ref = useRef(null);

    useEffect(() => {
        if (username !== undefined)
            axios.get(`/api/playlists/${username}`).then(async (response) => {
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
            const inPlaylist = await axios.get(`/api/in_playlist?user_id=${1}&movie_id=${movieId}`)
            const { data } = inPlaylist

            setMovieDetails(data.movieInfo)
        }
        isInPlaylist()
    }, [movieDetails]);

    const createNewPlaylist = () => {
        if (username !== undefined)
            axios.post(`/api/new_playlist/${username}`, { playlist_name }).then((response) => {

                axios.get(`/api/playlists/${username}`).then((response) => {
                    const { data } = response
                    setAllPlaylists(data.playlistNames)
                })
            })
    }


    const removeFromFavourites = (playlist) => {
        if (username !== undefined)
            axios
                .delete(`/api/playlist_titles?username=${username}&movie_id=${movieId}&playlist_name=${playlist}`)
                .then((result) => {
                    console.log(result.data.status)
                    // if (result.data.message == 'success') {
                    //     axios.get(`/api/playlist/${username}`).then(async (result) => {
                    //         setUser(result.data.user)
                    //         let res = result.data.playlist
                    //         const movies = res.map(async element => {
                    //             try {
                    //                 const result = await axios.get(`https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=511ebf4540231b1f06e7bec72f6b4a05`);
                    //                 return result.data;
                    //             } catch (e) {
                    //                 return console.log(e);
                    //             }
                    //         });
                    //         setPlaylist(await Promise.all(movies))
                    // });
                    //}
                });
    }


    const checkPlaylist = (playlistName) => {
        if (Array.isArray(movieDetails)) {
            const result = movieDetails.some((movie, index) => movie.playlist_name == playlistName)
            return result
        }
    }

    const addToFavourites = async (playlist_name) => {
        if (username !== undefined)
            axios.post(`/api/playlist_titles/${username}/${playlist_name}`, { movieId: movieId }).then((result) => {
                if (result.data.message == 'success') {
                    axios.get(`/api/playlist/${username}`).then(async (result) => {
                        setUser(result.data.user)
                        let res = result.data.playlist
                        const movies = res.map(async element => {
                            try {
                                const result = await axios.get(`https://api.themoviedb.org/3/movie/${element.movie_id}?api_key=511ebf4540231b1f06e7bec72f6b4a05`);
                                return result.data;
                            } catch (e) {
                                return console.log(e);
                            }
                        });
                        setPlaylist(await Promise.all(movies))
                        console.log(playlist)
                    });
                }
            });
    }



    useEffect(() => {
        if (username !== undefined)
            axios.get(`/api/playlists/${username}`).then((response) => {
                const { data } = response
                setAllPlaylists(data.playlistNames)
            })
    }, []);

    return (
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
                {Array.isArray(allPlaylists) ? allPlaylists.map((res, index) =>

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
                    </ListItem>
                )
                    : <CircularProgress />}
            </Typography>


        </Box>
    )
}

