import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 470
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogeStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function Todo ( props ) {

	const history = useHistory()

	const [todos, settodos] = useState("");
	const [title, settitle] = useState("");
	const [body, setbody] = useState("");
	const [todoId, settodoId] = useState("");
	const [errors, seterrors] = useState([]);
	const [open, setopen] = useState(false);
	const [uiLoading, setuiLoading] = useState(true);
	const [buttonType, setbuttonType] = useState("");
	const [viewOpen, setviewOpen] = useState(false);


	const { classes } = props;

	useEffect ( ()=> {
		authMiddleWare(history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/todos')
			.then((response) => {
				// 	todos: response.data,
				settodos(response.data);
				setuiLoading(false)
			})
			.catch((err) => {
				console.log(err);
			});
	},[]);

	function deleteTodoHandler(data) {
		authMiddleWare(history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		let todoId = data.todo.todoId;
		axios
			.delete(`todos/${todoId}`)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function handleEditClickOpen(data) {
		this.setState({
			title: data.todo.title,
			body: data.todo.body,
			todoId: data.todo.todoId,
			buttonType: 'Edit',
			open: true
		});
	}

	function handleViewOpen(data) {
		this.setState({
			title: data.todo.title,
			body: data.todo.body,
			viewOpen: true
		});
	}

	const DialogTitle = withStyles(styles)((props) => {
		const { children, classes, onClose, ...other } = props;
		return (
			<MuiDialogTitle disableTypography className={classes.root} {...other}>
				<Typography variant="h6">{children}</Typography>
				{onClose ? (
					<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
						<CloseIcon />
					</IconButton>
				) : null}
			</MuiDialogTitle>
		);
	});

	const DialogContent = withStyles((theme) => ({
		viewRoot: {
			padding: theme.spacing(2)
		}
	}))(MuiDialogContent);

	dayjs.extend(relativeTime);

	const handleClickOpen = () => {
		settodoId('');
		settitle('');
		setbody('');
		setbuttonType("");
		setopen(true);
	};

	const handleSubmit = (event) => {
		authMiddleWare(history);
		event.preventDefault();
		const userTodo = {
			title,
			body
		};
		let options = {};
		if (buttonType === 'Edit') {
			options = {
				url: `/todos/${todoId}`,
				method: 'put',
				data: userTodo
			};
		} else {
			options = {
				url: '/todos',
				method: 'post',
				data: userTodo
			};
		}
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios(options)
			.then(() => {
				setopen(false);
				window.location.reload();
			})
			.catch((error) => {
				setopen(true);
				seterrors( error.response.data)
				console.log(error);
			});
	};

	const handleViewClose = () => {
		setviewOpen(false);
	};

	const handleClose = (event) => {
		setopen(false);
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

				<IconButton
					className={classes.floatingButton}
					color="primary"
					aria-label="Add Todo"
					onClick={handleClickOpen}
				>
					<AddCircleIcon style={{ fontSize: 60 }} />
				</IconButton>
				<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
								<CloseIcon />
							</IconButton>
							<Typography variant="h6" className={classes.title}>
								{buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo'}
							</Typography>
							<Button
								autoFocus
								color="inherit"
								onClick={handleSubmit}
								className={classes.submitButton}
							>
								{buttonType === 'Edit' ? 'Save' : 'Submit'}
							</Button>
						</Toolbar>
					</AppBar>

					<form className={classes.form} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="todoTitle"
									label="Todo Title"
									name="title"
									autoComplete="todoTitle"
									helperText={errors.title}
									value={title}
									error={errors.title ? true : false}
									onChange={(e) => settitle(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="todoDetails"
									label="Todo Details"
									name="body"
									autoComplete="todoDetails"
									multiline
									rows={25}
									rowsMax={25}
									helperText={errors.body}
									error={errors.body ? true : false}
									onChange={ (e) => setbody(e.target.value)}
									value={body}
								/>
							</Grid>
						</Grid>
					</form>
				</Dialog>

				<Grid container spacing={2}>
					{todos.map((todo) => (
						<Grid item xs={12} sm={6}>
							<Card className={classes.root} variant="outlined">
								<CardContent>
									<Typography variant="h5" component="h2">
										{todo.title}
									</Typography>
									<Typography className={classes.pos} color="textSecondary">
										{dayjs(todo.createdAt).fromNow()}
									</Typography>
									<Typography variant="body2" component="p">
										{`${todo.body.substring(0, 65)}`}
									</Typography>
								</CardContent>
								<CardActions>
									<Button size="small" color="primary" onClick={() => handleViewOpen({ todo })}>
										{' '}
										View{' '}
									</Button>
									<Button size="small" color="primary" onClick={() => handleEditClickOpen({ todo })}>
										Edit
									</Button>
									<Button size="small" color="primary" onClick={() => deleteTodoHandler({ todo })}>
										Delete
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>

				<Dialog
					onClose={handleViewClose}
					aria-labelledby="customized-dialog-title"
					open={viewOpen}
					fullWidth
					classes={{ paperFullWidth: classes.dialogeStyle }}
				>
					<DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
						{title}
					</DialogTitle>
					<DialogContent dividers>
						<TextField
							fullWidth
							id="todoDetails"
							name="body"
							multiline
							readonly
							rows={1}
							rowsMax={25}
							value={body}
							InputProps={{
								disableUnderline: true
							}}
						/>
					</DialogContent>
				</Dialog>
			</main>
		);
	}
	
}

export default withStyles(styles)(Todo);
