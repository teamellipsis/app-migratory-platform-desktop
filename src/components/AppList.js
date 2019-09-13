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
import AppOptionDialog from './AppOptionDialog';
import SnackMessage from './SnackMessage';

import db from '../config/Database';
import key from '../const/Key';
import snack from '../const/Snack';
import Window from '../const/Window';
import Intent from '../const/Intent';
import appManager from '../config/AppManager';

import fs from 'fs';
import path from 'path';

const styles = theme => ({
    root: {
        flexGrow: 1,
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
        openDialog: false,
        appName: '',
        openSnack: false,
        snackMsg: '',
        snackVariant: snack.SUCCESS,
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

    handleDialogOpen = (app) => () => {
        this.setState({
            openDialog: true,
            appName: app,
        });
    };

    handleDialogClose = () => {
        this.setState({ openDialog: false });
    };

    handleSnackOpen = (msg, variant) => {
        this.setState({
            openSnack: true,
            snackMsg: msg,
            snackVariant: variant,
        });
    };

    handleSnackClose = () => {
        this.setState({ openSnack: false });
    };

    handleAppOpen = () => {
        let appsDir = db.get(key.APPS_DIR).value;
        let appPath = path.join(appsDir, this.state.appName);
        appManager.openApp(appPath).catch(() => {
            this.handleSnackOpen(`App(${this.state.appName}) crashed. Please try again.`, snack.ERROR);
        });
    };

    handleAppPackage = () => {
        appManager.packageApp(this.state.appName).then(() => {
            this.handleSnackOpen(`App(${this.state.appName}) succesfully packaged.`, snack.SUCCESS);
        }).catch(() => {
            this.handleSnackOpen(`App(${this.state.appName}) packaging failed. Please try again.`, snack.ERROR);
        });
    };

    handleAppSend = () => {
        this.props.changeWindow(Window.SHARING, {
            action: Intent.ACTION_EXECUTE,
            func: "handleSendApp",
            args: { appName: this.state.appName },
        });
    };

    handleAppReset = () => { };
    handleAppDelete = () => { };

    render() {
        const { classes } = this.props;
        const { apps, openSnack, snackMsg, snackVariant } = this.state;

        return (
            <div className={classes.root}>
                <AppOptionDialog
                    open={this.state.openDialog}
                    title={this.state.appName}
                    onClose={this.handleDialogClose}
                    handleOpen={this.handleAppOpen}
                    handlePackage={this.handleAppPackage}
                    handleSend={this.handleAppSend}
                    handleReset={this.handleAppReset}
                    handleDelete={this.handleAppDelete}
                />
                <SnackMessage
                    open={openSnack}
                    onClose={this.handleSnackClose}
                    variant={snackVariant}
                    message={snackMsg}
                />
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <div className={classes.content}>
                            {apps === null ?
                                <Typography align={'center'} color="inherit" noWrap className={classes.title}>
                                    {'No apps found'}
                                </Typography>
                                :
                                <List dense={true}>
                                    {apps.map((app, index) => (
                                        <ListItem button key={index} onClick={this.handleDialogOpen(app)}>
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
    changeWindow: PropTypes.func.isRequired,
};

export default withStyles(styles)(AppList);
