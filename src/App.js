import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Home from './components/Home'

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
});

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <MuiThemeProvider theme={theme}>
                    <div>
                        <CssBaseline />
                        <Home />
                    </div>
                </MuiThemeProvider>
            </React.Fragment>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
