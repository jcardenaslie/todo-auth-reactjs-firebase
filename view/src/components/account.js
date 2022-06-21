import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@material-ui/core';

import clsx from 'clsx';

import axios from 'axios';
import { authMiddleWare } from '../util/auth';

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	root: {},
	details: {
		display: 'flex'
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
		flexGrow: 0
	},
	locationText: {
		paddingLeft: '15px'
	},
	buttonProperty: {
		position: 'absolute',
		top: '50%'
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	progess: {
		position: 'absolute'
	},
	uploadButton: {
		marginLeft: '8px',
		margin: theme.spacing(1)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	submitButton: {
		marginTop: '10px'
	}
});

function Account (props) {

	const history = useHistory();

	const { classes, ...rest } = props;

	const [firstName, setfirstName] = useState("");
	const [lastName, setlastName] = useState("");
	const [email, setemail] = useState("");
	const [phoneNumber, setphoneNumber] = useState("");
	const [username, setusername] = useState("");
	const [country, setcountry] = useState("");
	const [profilePicture, setprofilePicture] = useState("");
	const [uiLoading, setuiLoading] = useState(true);
	const [buttonLoading, setbuttonLoading] = useState(false);
	const [imageError, setimageError] = useState("");
	const [errorMsg, seterrorMsg] = useState("");
	const [image, setimage] = useState(null);
	const [content, setcontent] = useState();

	useEffect ( () => {
		authMiddleWare(history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/user')
			.then((response) => {
				console.log(response.data);

				setfirstName(response.data.userCredentials.firstName);
				setlastName(response.data.userCredentials.lastName);
				setemail(response.data.userCredentials.email);
				setphoneNumber(response.data.userCredentials.phoneNumber);
				setcountry(response.data.userCredentials.country);
				setusername(response.data.userCredentials.username);
				setuiLoading(false);
			})
			.catch((error) => {
				if (error.response.status === 403) {
					history.push('/login')
				}
				console.log(error);
				seterrorMsg('Error in retrieving the data')
			});
	},[]);

	const handleImageChange = (event) => {
		setimage(event.target.files[0])
	};

	const profilePictureHandler = (event) => {
		event.preventDefault();
		setuiLoading(true);
		authMiddleWare(history);
		const authToken = localStorage.getItem('AuthToken');
		let form_data = new FormData();
		form_data.append('image', image);
		form_data.append('content', content);
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.post('/user/image', form_data, {
				headers: {
					'content-type': 'multipart/form-data'
				}
			})
			.then(() => {
				window.location.reload();
			})
			.catch((error) => {
				if (error.response.status === 403) {
					history.push('/login')
				}
				console.log(error);
				setuiLoading(false);
				setimageError ('Error in posting the data')
			});
	};

	const updateFormValues = (event) => {
		event.preventDefault();
		setbuttonLoading(true)
		authMiddleWare(history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		const formRequest = {
			firstName,
			lastName,
			country
		};
		axios
			.post('/user', formRequest)
			.then(() => {
				setbuttonLoading(false);
			})
			.catch((error) => {
				if (error.response.status === 403) {
					history.push('/login')
				}
				console.log(error);
				setbuttonLoading(false)
			});
	};

	
	if (uiLoading === true) {
		return (
			<main className={classes.content}>
				<div className={classes.toolbar} />
				{uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
			</main>
		);
	} else {
		return (
			<main className={classes.content}>
				<div className={classes.toolbar} />
				<Card {...rest} className={clsx(classes.root, classes)}>
					<CardContent>
						<div className={classes.details}>
							<div>
								<Typography className={classes.locationText} gutterBottom variant="h4">
									{firstName} {lastName}
								</Typography>
								<Button
									variant="outlined"
									color="primary"
									type="submit"
									size="small"
									startIcon={<CloudUploadIcon />}
									className={classes.uploadButton}
									onClick={profilePictureHandler}
								>
									Upload Photo
								</Button>
								<input type="file" onChange={handleImageChange} />

								{imageError ? (
									<div className={classes.customError}>
										{' '}
										Wrong Image Format || Supported Format are PNG and JPG
									</div>
								) : (
									false
								)}
							</div>
						</div>
						<div className={classes.progress} />
					</CardContent>
					<Divider />
				</Card>

				<br />
				<Card {...rest} className={clsx(classes.root, classes)}>
					<form autoComplete="off" noValidate>
						<Divider />
						<CardContent>
							<Grid container spacing={3}>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="First name"
										margin="dense"
										name="firstName"
										variant="outlined"
										value={firstName}
										onChange={ (e) => setfirstName(e.target.value)}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="Last name"
										margin="dense"
										name="lastName"
										variant="outlined"
										value={lastName}
										onChange={ (e) => setlastName(e.target.value)}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="Email"
										margin="dense"
										name="email"
										variant="outlined"
										disabled={true}
										value={email}
										onChange={ (e) => setemail(e.target.value)}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="Phone Number"
										margin="dense"
										name="phone"
										type="number"
										variant="outlined"
										disabled={true}
										value={phoneNumber}
										onChange={ (e) => setphoneNumber(e.target.value)}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="User Name"
										margin="dense"
										name="userHandle"
										disabled={true}
										variant="outlined"
										value={username}
										onChange={ (e) => setphoneNumber(e.target.value)}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										label="Country"
										margin="dense"
										name="country"
										variant="outlined"
										value={country}
										onChange={ (e) => setphoneNumber(e.target.value)}
									/>
								</Grid>
							</Grid>
						</CardContent>
						<Divider />
						<CardActions />
					</form>
				</Card>
				<Button
					color="primary"
					variant="contained"
					type="submit"
					className={classes.submitButton}
					onClick={updateFormValues}
					disabled={
						buttonLoading ||
						!firstName ||
						!lastName ||
						!country
					}
				>
					Save details
					{buttonLoading && <CircularProgress size={30} className={classes.progess} />}
				</Button>
			</main>
		);
	}
}

export default withStyles(styles)(Account);
