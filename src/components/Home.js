import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FreshConfig from './FreshConfig';
import Dashboard from './Dashboard';

import db from '../config/Database';
import key from '../const/Key';

const styles = theme => ({
    home: {
        padding: theme.spacing.unit,
        height: '-webkit-fill-available',
    },
});

class Home extends React.Component {
    state = {
        isFresh: false
    }

    componentDidMount() {
        let workingDir = db.get(key.WORKING_DIR)
        if (workingDir.value == null) {
            this.setState({
                isFresh: true,
            });
        }
    }

    initialConfigDone = () => {
        this.setState({
            isFresh: false,
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper square elevation={0} className={classes.home}>
                {this.state.isFresh ? <FreshConfig done={this.initialConfigDone} /> : <Dashboard />}
            </Paper>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
