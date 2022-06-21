import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import axios from 'axios';

import Account from '../components/account';
import Todo from '../components/todo';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import { authMiddleWare } from '../util/auth';

const drawerWidth = 240;

const styles = (theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '45%',
		top: '35%'
	},
	toolbar: theme.mixins.toolbar
});

function Home (props) {
	
	const history = useHistory();

	const [render, setrender] = useState(false);
	const [firstName, setfirstName] = useState("");
	const [lastName, setlastName] = useState("");
	const [profilePicture, setprofilePicture] = useState("");
	const [uiLoading, setuiLoading] = useState(true);
	const [imageLoading, setimageLoading] = useState(false);
	const [email, setemail] = useState("");
	const [phoneNumber, setphoneNumber] = useState("");
	const [country, setcountry] = useState("");
	const [username, setusername] = useState("");
	const [errorMsg, seterrorMsg] = useState("");

	const { classes } = props;

	const loadAccountPage = (event) => {
		setrender(true)
	};

	const loadTodoPage = (event) => {
		setrender(false)
	};

	const logoutHandler = (event) => {
		localStorage.removeItem('AuthToken');
		history.push('/login')
	};

	useEffect ( () =>{
		authMiddleWare(history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/user')
			.then((response) => {
				console.log(response.data);
				setfirstName( response.data.userCredentials.firstName)
				setlastName( response.data.userCredentials.lastName)
				setemail ( response.data.userCredentials.email)
				setphoneNumber( response.data.userCredentials.phoneNumber)
				setcountry ( response.data.userCredentials.country)
				setusername( response.data.userCredentials.username)
				setuiLoading ( false )
				setprofilePicture( response.data.userCredentials.imageUrl)
			})
			.catch((error) => {
				if (error.response.status === 403) {
					history.push('/login')
				}
				console.log(error);
				seterrorMsg('Error in retrieving the data');
			});
	}, [])
		
	if (uiLoading === true) {
		return (
			<div className={classes.root}>
				{ uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
			</div>
		);
	} else {
		return (
			<div className={classes.root}>
				<CssBaseline />
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" noWrap>
							TodoApp
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer
					className={classes.drawer}
					variant="permanent"
					classes={{
						paper: classes.drawerPaper
					}}
				>
					<div className={classes.toolbar} />
					<Divider />
					<center>
						<Avatar src={profilePicture} className={classes.avatar} />
						<p>
							{' '}
							{firstName} {lastName}
						</p>
					</center>
					<Divider />
					<List>
						<ListItem button key="Todo" onClick={loadTodoPage}>
							<ListItemIcon>
								{' '}
								<NotesIcon />{' '}
							</ListItemIcon>
							<ListItemText primary="Todo" />
						</ListItem>

						<ListItem button key="Account" onClick={loadAccountPage}>
							<ListItemIcon>
								{' '}
								<AccountBoxIcon />{' '}
							</ListItemIcon>
							<ListItemText primary="Account" />
						</ListItem>

						<ListItem button key="Logout" onClick={logoutHandler}>
							<ListItemIcon>
								{' '}
								<ExitToAppIcon />{' '}
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</ListItem>
					</List>
				</Drawer>

				<div>{render ? <Account /> : <Todo />}</div>
			</div>
		);
	}
}

export default withStyles(styles)(Home);
