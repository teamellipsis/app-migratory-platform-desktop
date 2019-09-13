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
        const { classes, active, changeWindow } = this.props;
        let display = active ? 'block' : 'none';
        return (
            <div style={{ display }} className={classes.root}>
                <AppList changeWindow={changeWindow} />
            </div>
        );
    }
}

Apps.propTypes = {
    active: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    changeWindow: PropTypes.func.isRequired,
};

export default withStyles(styles)(Apps);
