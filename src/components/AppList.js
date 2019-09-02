import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';

import db from '../config/Database';
import path from 'path';
import key from '../const/Key';

import fs from 'fs';

const styles = theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    content: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    },
});

class AppList extends React.Component {
    state = {
        apps: null,
    };

    componentDidMount() {
        let appsDir = db.get(key.APPS_DIR).value;
        if (appsDir) {
            this.updateAppList(appsDir);
            fs.watch(appsDir, (event, filename) => {
                this.updateAppList(appsDir);
            });
        }
    }

    updateAppList = (appsDir) => {
        const isDir = (file) => fs.lstatSync(path.join(appsDir, file)).isDirectory();
        fs.readdir(appsDir, (err, files) => {
            if (err === null) {
                this.setState({
                    apps: files.filter(isDir),
                });
            }
        });
    }

    render() {
        const { classes } = this.props;
        const { apps } = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item xs={12} md={6}>
                        <div className={classes.content}>
                            {apps === null ?
                                <Typography align={'center'} color="inherit" noWrap className={classes.title}>
                                    {'No apps found'}
                                </Typography>
                                :
                                <List dense={true}>
                                    {apps.map((app, index) => (
                                        <ListItem button key={index}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={app}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            }
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

AppList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppList);
