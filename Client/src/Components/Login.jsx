import React, { useState, useContext } from 'react'
import { useNavigate } from "react-router";
import UserContext from '../Contexts/UserContext';
import AxiosInstance from "../Hooks/AxiosInstance";
import {
    FormControl,
    InputLabel,
    FormGroup,
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    OutlinedInput,
    InputAdornment,
    Snackbar,
} from '@mui/material';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
import Popcorn from './Icons/Popcorn';

function Login() {
    const navigate = useNavigate();
    const { setUsername } = useContext(UserContext);
    const axios = AxiosInstance();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [values, setValues] = useState({
        username: '',
        password: ''
    });

    const handleLogin = async() => {
       await axios
            .post(`/api/login`, { username: values.username, password: values.password })
            .then((result) => {
                const { token } = result.data;
                if (!result) return (
                    <CircularProgress />
                )
                if (result.data.message == 'unregistered') {
                    setMessage('this username has not been registered')
                    handleClick()

                } else if (result.data.message == 'unmatched') {
                    setMessage('incorrect username or password')
                    handleClick()

                } else {
                    setUsername(values.username)
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', values.username);

                    navigate("/my-favourite-movies/Home");
                }
            })
        setValues({ username: '', password: '' })

    }
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <Close fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
    return (
        <div className="App">
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ backgroundColor: '#2c3440' }}>
                    <Toolbar>
                        <Popcorn style={{ height: 55, width: 56 }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <h2>my favourite movies</h2>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <FormGroup className='formGroup'>
                    <h2>Login</h2>
                    <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-username"
                            value={values.username}
                            onChange={handleChange('username')}
                            label="username"
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    {<Button disabled={!values.username || !values.password} variant="contained" sx={{ m: 1 }} onClick={handleLogin}>Login</Button>}
                    <a style={{ cursor: 'pointer' }} onClick={() => { navigate("/my-favourite-movies/Signup") }}>or signup here</a>
                </FormGroup>
            </Box>
            <div>
                <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    message={message}
                    action={action}
                />
            </div>
        </div>
    )
}
export default Login
