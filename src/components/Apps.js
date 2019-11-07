import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppList from './AppList';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
});

class Apps extends React.Component {
    render() {
        const { classes, active, changeWindow, snackOpen, snackClose, loadingOpen, loadingClose } = this.props;
        let display = active ? 'block' : 'none';
        return (
            <div style={{ display }} className={classes.root}>
                <AppList
                    changeWindow={changeWindow}
                    snackOpen={snackOpen}
                    snackClose={snackClose}
                    loadingOpen={loadingOpen}
                    loadingClose={loadingClose}
                />
            </div>
        );
    }
}

Apps.propTypes = {
    active: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    changeWindow: PropTypes.func.isRequired,
    snackOpen: PropTypes.func.isRequired,
    snackClose: PropTypes.func.isRequired,
    loadingOpen: PropTypes.func.isRequired,
    loadingClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(Apps);
