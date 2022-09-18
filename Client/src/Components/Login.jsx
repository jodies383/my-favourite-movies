import { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import {
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
    FormGroup,
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    OutlinedInput,
    InputAdornment,
    FilledInput,
    TextField,
} from '@mui/material';

import { Visibility, VisibilityOff, } from '@mui/icons-material';

import axios from 'axios';


function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    const handleLogin = () => {
        axios
            .post(`https://favourite-movie-server.herokuapp.com/api/login`, { username: values.username, password: values.password })
            .then((result) => {
                const { token } = result.data;
                if (!result) return (
                    <CircularProgress />
                );
                if (result.data.message == 'unregistered') {
                    console.log('this username has not been registered')

                } else if (result.data.message == 'unmatched') {
                    console.log('incorrect username or password')

                } else {
                    console.log('login successful')
                    localStorage.setItem('username', values.username)
                    localStorage.setItem('token', token);

                    navigate("/my-favourite-movies/Home");
                }
            })

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

    return (
        <div className="App">
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <p>My Favourite Movies</p>
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
                    <Button variant="contained" sx={{ m: 1 }} onClick={() => { navigate("/my-favourite-movies/") }}>Sign Up</Button>

                </FormGroup>
            </Box>
        </div>
    )
}

export default Login
