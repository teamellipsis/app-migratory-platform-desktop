import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppList from './AppList';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: '-webkit-fill-available',
    },
});

class Apps extends React.Component {
    render() {
        const { classes, active } = this.props;
        let display = active ? 'block' : 'none';
        return (
            <div style={{ display }} className={classes.root}>
                <AppList />
            </div>
        );
    }
}

Apps.propTypes = {
    active: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Apps);
