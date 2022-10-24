import { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import {
    AppBar,
    Box,
    FormControl,
    InputLabel,
    FormGroup,
    Toolbar,
    Typography,
    Button,
    IconButton,
    OutlinedInput,
    InputAdornment,
    Snackbar,

} from '@mui/material';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
import AxiosInstance from "../Hooks/AxiosInstance";
import * as React from 'react';

function SignUp() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('')
    const axios = AxiosInstance();

    const handleSignUp = () => {
        axios
            .post(`/api/register`, { username: values.username, password: values.password, firstName: values.firstName, lastName: values.lastName })
            .then((result) => {
                if (result.data.message == 'success') {

                    console.log('registration successful')
                    navigate("/my-favourite-movies/");


                } else {
                    setMessage('this username has already been registered')
                    handleClick()
                }
            });
            setValues({firstName: '', lastName: '', username: '', password: ''})
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
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <p>My Favourite Movies</p>
                        </Typography>

                    </Toolbar>
                </AppBar>
                <FormGroup className='formGroup'>
                    <h2>Sign up</h2>
                    <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-firstName">First Name</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-firstName"
                            value={values.firstName}
                            onChange={handleChange('firstName')}
                            label="firstName"
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-lastName">Last Name</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-lastName"
                            value={values.lastName}
                            onChange={handleChange('lastName')}
                            label="lastName"
                        />
                    </FormControl>
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
                    <Button disabled={!values.username || !values.password || !values.firstName || !values.lastName} variant="contained" sx={{ m: 1 }} onClick={handleSignUp}>Sign Up</Button>
                    <Button variant="contained" sx={{ m: 1 }} onClick={() => { navigate("/my-favourite-movies/") }}>Login</Button>

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

export default SignUp
