import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import db from '../config/Database';
import fileManager from '../config/FileManager';
import key from '../const/Key';

import { remote } from 'electron';
import path from 'path';
import fs from 'fs';

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    doneContainer: {
        padding: theme.spacing.unit * 3,
    },
});

function getSteps() {
    return ['Select working directory', 'Extract assets'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return 'Selected directory will be use to platform related tasks.';
        case 1:
            return 'Extract application related dependancies.';
        default:
            return 'Unknown step';
    }
}

class FreshConfig extends React.Component {
    state = {
        activeStep: 0,
        errorMsgStep0: null,
        errorMsgStep1: null,
        selecting: false,
        extracting: false,
    };

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleSelect = () => {
        this.setState({
            errorMsgStep0: null,
            selecting: true,
        });

        remote.dialog.showOpenDialog({
            properties: ['openDirectory']
        }, (filePaths, bookmarks) => {
            if (filePaths !== undefined) {
                let workingDir = filePaths[0];
                if (this.isAccessible(workingDir)) {
                    db.set(key.WORKING_DIR_TEMP, workingDir)
                    this.handleNext()
                } else {
                    this.setState({
                        errorMsgStep0: "Selected directory not accessible. Please select another."
                    });
                }
            }

            this.setState({
                selecting: false,
            });
        });
    };

    isAccessible(filePath) {
        try {
            fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK)
            return true
        } catch (err) {
            return false
        }
    }

    handleExtract = () => {
        this.setState({
            errorMsgStep1: null,
            extracting: true,
        });

        let workingDir = db.get(key.WORKING_DIR_TEMP).value;
        let nodeModulesZip = path.join(fileManager.getProjectDir(), 'assets/node_modules.zip');

        fileManager.extractZip(nodeModulesZip, workingDir).then(() => {
            db.set(key.WORKING_DIR, workingDir);

            let appsPath = path.join(workingDir, 'apps');
            if (!fs.existsSync(appsPath)) {
                fs.mkdirSync(appsPath)
            }
            db.set(key.APPS_DIR, appsPath);

            let packagesPath = path.join(workingDir, 'packages');
            if (!fs.existsSync(packagesPath)) {
                fs.mkdirSync(packagesPath)
            }
            db.set(key.PACKAGES_DIR, packagesPath);

            this.handleNext();
        }).catch((err) => {
            this.setState({
                extracting: false,
                errorMsgStep1: "Extraction failed. Please try again.",
            });
        });
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep, errorMsgStep0, errorMsgStep1, selecting, extracting } = this.state;
        return (
            <React.Fragment>
                <Typography variant="h6">
                    Initial Configurations
                </Typography>
                <div>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        <Step key={0}>
                            <StepLabel optional={errorMsgStep0 !== null ?
                                <Typography variant="caption" color="error">
                                    {errorMsgStep0}
                                </Typography> : null
                            }>{steps[0]}</StepLabel>
                            <StepContent>
                                <Typography>{getStepContent(0)}</Typography>
                                <div className={classes.actionsContainer}>
                                    <div>
                                        <Button
                                            disabled={selecting}
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleSelect}
                                            className={classes.button}
                                        >
                                            Select
                                        </Button>
                                    </div>
                                </div>
                            </StepContent>
                        </Step>
                        <Step key={1}>
                            <StepLabel optional={errorMsgStep1 !== null ?
                                <Typography variant="caption" color="error">
                                    {errorMsgStep1}
                                </Typography> : null
                            }>{steps[1]}</StepLabel>
                            <StepContent>
                                <Typography>{getStepContent(1)}</Typography>
                                {extracting ? <CircularProgress className={classes.progress} /> : null}
                                <div className={classes.actionsContainer}>
                                    <div>
                                        <Button
                                            disabled={extracting}
                                            onClick={this.handleBack}
                                            className={classes.button}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            disabled={extracting}
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleExtract}
                                            className={classes.button}
                                        >
                                            Extract
                                        </Button>
                                    </div>
                                </div>
                            </StepContent>
                        </Step>
                    </Stepper>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} className={classes.doneContainer}>
                            <Typography>You&apos;re done.</Typography>
                            <Button onClick={this.props.done} className={classes.button} color="primary">
                                Let's start
                            </Button>
                        </Paper>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

FreshConfig.propTypes = {
    classes: PropTypes.object,
    done:PropTypes.func,
};

export default withStyles(styles)(FreshConfig);
