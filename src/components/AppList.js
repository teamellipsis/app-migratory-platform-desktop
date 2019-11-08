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
import TrustedDeviceDialog from './TrustedDeviceDialog';
import ConfirmationDialog from './ConfirmationDialog';

import db from '../config/Database';
import key from '../const/Key';
import snack from '../const/Snack';
import Window from '../const/Window';
import Intent from '../const/Intent';
import appManager from '../config/AppManager';

import fs from 'fs-extra';
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

const RESET = "reset";
const DELETE = "delete";

class AppList extends React.Component {
    state = {
        apps: null,
        openDialog: false,
        appName: '',
        openTrustedDeviceDialog: false,
        openConfirmationDialog: false,
        resetOrDelete: RESET,
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
        this.props.snackOpen(msg, variant);
    };

    handleSnackClose = () => {
        this.props.snackClose();
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

    handleAppSendTrusted = () => {
        this.handleOpenTrustedDeviceDialog();
    };

    handleAppSend = () => {
        this.props.changeWindow(Window.SHARING, {
            action: Intent.ACTION_EXECUTE,
            func: "handleSendApp",
            args: { appName: this.state.appName },
        });
    };

    handleAppReset = () => {
        this.handleOpenConfirmationDialog(RESET);
    };

    handleAppDelete = () => {
        this.handleOpenConfirmationDialog(DELETE);
    };

    handleOpenTrustedDeviceDialog = () => {
        this.setState({ openTrustedDeviceDialog: true });
    };

    handleCloseTrustedDeviceDialog = () => {
        this.setState({ openTrustedDeviceDialog: false });
    };

    handleAppSendTrustedDevice = (device) => {
        this.props.loadingOpen("Sending...");
        this.handleCloseTrustedDeviceDialog();
        appManager.sendAppTrusted(this.state.appName, device).then(() => {
            this.props.loadingClose();
            this.handleSnackOpen(`App(${this.state.appName}) succesfully send.`, snack.SUCCESS);
        }).catch((error) => {
            this.props.loadingClose();
            if (error === "DEVICE_NOT_FOUND") {
                this.handleSnackOpen(`Device not found. Please connect device and try again.`, snack.ERROR);
            } else if (error === "CONNECT_ERROR") {
                this.handleSnackOpen(`'${device.name}' not ready to receive app.`, snack.ERROR);
            } else {
                this.handleSnackOpen(`App(${this.state.appName}) failed to send. Please try again.`, snack.ERROR);
            }
        });
    };

    handleOpenConfirmationDialog = (resetOrDelete) => {
        this.setState({
            openConfirmationDialog: true,
            resetOrDelete
        });
    };

    handleCloseConfirmationDialog = () => {
        this.setState({ openConfirmationDialog: false });
    };

    onYesResetOrDelete = () => {
        try {
            const appsDir = db.get(key.APPS_DIR).value;
            if (this.state.resetOrDelete === RESET) {
                const uiStatePath = path.join(appsDir, this.state.appName, 'state');
                const daemonStatePath = path.join(appsDir, this.state.appName, 'state_daemon');
                // TODO(should run main process)
                fs.unlinkSync(uiStatePath);
                fs.unlinkSync(daemonStatePath);

            } else if (this.state.resetOrDelete === DELETE) {
                const appPath = path.join(appsDir, this.state.appName);
                // TODO(should run main process)
                fs.removeSync(appPath);
            }
        } catch (error) {
            this.handleSnackOpen(
                `App(${this.state.appName}) failed to ${this.state.resetOrDelete}. Please try again.`,
                snack.ERROR
            );
        }
    };

    render() {
        const { classes } = this.props;
        const {
            apps, openDialog, appName,
            openTrustedDeviceDialog,
            openConfirmationDialog,
            resetOrDelete,
        } = this.state;

        return (
            <div className={classes.root}>
                <AppOptionDialog
                    open={openDialog}
                    title={appName}
                    onClose={this.handleDialogClose}
                    handleOpen={this.handleAppOpen}
                    handlePackage={this.handleAppPackage}
                    handleSendTrusted={this.handleAppSendTrusted}
                    handleSend={this.handleAppSend}
                    handleReset={this.handleAppReset}
                    handleDelete={this.handleAppDelete}
                />
                <TrustedDeviceDialog
                    open={openTrustedDeviceDialog}
                    onClose={this.handleCloseTrustedDeviceDialog}
                    onDeviceClick={this.handleAppSendTrustedDevice}
                />
                <ConfirmationDialog
                    open={openConfirmationDialog}
                    onClose={this.handleCloseConfirmationDialog}
                    message={`Do you want to ${resetOrDelete} '${appName}'?`}
                    onYes={this.onYesResetOrDelete}
                    onNo={() => { }}
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
    snackOpen: PropTypes.func.isRequired,
    snackClose: PropTypes.func.isRequired,
    loadingOpen: PropTypes.func.isRequired,
    loadingClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(AppList);
