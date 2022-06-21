// Material UI components
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

const styles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	progess: {
		position: 'absolute'
	}
});

function Login (props) {

	const history = useHistory();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState([]);
	const [loading, setLoading] = useState(false);

	const { classes } = props

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(email, password);
		setLoading(true);
		const userData = {
			email,
			password
		};
		setEmail()
		axios
			.post('/login', userData)
			.then( (response) => {
				console.log(response)
				localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
				setLoading(false)
				history.push('/');
			})
			.catch((error) => {
				console.log(error)
				setLoading(false);
				setErrors(error.response.data)
			});
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Login
				</Typography>
				<form className={classes.form} noValidate>
			<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						helperText={errors.email}
						error={errors.email ? true : false}
						onChange={ (e) =>  setEmail(e.target.value) }
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						helperText={errors.password}
						error={errors.password ? true : false}
						onChange={ (e) => setPassword(e.target.value) }
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						// className={classes.submit}
						onClick={handleSubmit}
						disabled={ loading || !email || !password}
					>
						Sign In
						{loading && <CircularProgress size={30} className={classes.progess} />}
					</Button>
		 			<Grid container>
		 				<Grid item>
		 					<Link href="signup" variant="body2">
		 						{"Don't have an account? Sign Up"}
		 					</Link>
		 				</Grid>
		 			</Grid>
		 			{ errors.general && (
		 				<Typography variant="body2" className={ classes.customError }>
		 					{ errors.general }
		 				</Typography>
		 			)}
		 		</form>
		 	</div>
		 </Container>
	);
}

export default withStyles(styles)(Login);
