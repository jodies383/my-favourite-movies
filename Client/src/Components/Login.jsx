import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { FormControl, InputLabel, Input, FormHelperText, FormGroup } from '@mui/material';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from "react-router";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';


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
                    <Button variant="contained" sx={{ m: 1 }} onClick={handleLogin}>Login</Button>
                    <Button variant="contained" sx={{ m: 1 }} onClick={ () => {navigate("/my-favourite-movies/")}}>Sign Up</Button>

                </FormGroup>
            </Box>
        </div>
    )
}

export default Login
