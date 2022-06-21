import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';

const theme = createTheme({
	palette: {
		primary: {
			light: '#33c9dc',
			main: '#FF5722',
			dark: '#d50000',
			contrastText: '#fff'
		}
  }
});

function App() {
	return (
		<MuiThemeProvider theme={theme}>
			<Router>
				<div>
					<Routes>
						<Route exact path="/" element={ <Home />} />
						<Route exact path="/login" element={ <Login />} />
						<Route exact path="/signup" element={ <Signup />} />
					</Routes>
				</div>
			</Router>
		</MuiThemeProvider>
	);
}

export default App;
