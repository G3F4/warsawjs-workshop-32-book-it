import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ShareIcon from '@material-ui/icons/Share';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Price from '../common/price/Price.jsx';
import Rating from '../common/rating/Rating.jsx';
import FacilityIcon from './facility-icon/FacilityIcon.jsx';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = theme => ({
  card: {
    maxWidth: '100%',
  },
  actions: {
    display: 'flex',
  },
  button: {
    margin: theme.spacing.unit,
  },
  floatRight: {
    marginLeft: 'auto',
  },
  img: {
    height: 255,
    display: 'block',
    maxWidth: 400,
    overflow: 'hidden',
    margin: '0 auto',
  },
  facilities: {
    marginTop: theme.spacing.unit * 3,
  },
});

class AccommodationDetails extends Component {
  static propTypes = {
    classes: PropTypes.object,
    theme: PropTypes.object,
    openedDetails: PropTypes.object.isRequired,
    onBackToList: PropTypes.func.isRequired,
  };

  state = {
    activeStep: 0,
    shareId: '',
  };

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }));
  };

  handleStepChange = activeStep => {
    this.setState({ activeStep });
  };

  handleShareDialogOpen = (shareId) => {
    this.setState({ shareId });
  };

  handleShareDialogClose = () => {
    this.setState({ shareId: '' });
  };

  renderShareButton(id) {
    return (
      <div>
        <IconButton aria-label="Share" onClick={() => this.handleShareDialogOpen(id)}>
          <ShareIcon />
        </IconButton>
        <Dialog
          fullScreen={this.props.fullScreen}
          open={this.state.shareId === id}
          onClose={this.handleShareDialogClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Copy this link and share!"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`${window.location.origin}/details?id=${id}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleShareDialogClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  render() {
    const { classes, theme, openedDetails, onBackToList } = this.props;
    const { activeStep } = this.state;

    return (
      <React.Fragment>
        {openedDetails.errors ? (
          <Typography variant="body1">{openedDetails.errors}</Typography>
        ) : (
          <React.Fragment>
            {openedDetails.fetching ? (
              <CircularProgress size="100%" thickness={2} />
            ) : (
              <Card className={classes.card}>
                <CardHeader
                  avatar={<Rating rating={openedDetails.data.rating} />}
                  action={<Price price={openedDetails.data.price} />}
                  title={openedDetails.data.title}
                  subheader={openedDetails.data.address}
                />
                <div className={classes.root}>
                  <AutoPlaySwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeStep}
                    onChangeIndex={this.handleStepChange}
                    enableMouseEvents
                  >
                    {openedDetails.data.images.map((image, index) => (
                      <div key={index}>
                        {Math.abs(activeStep - index) <= 2 ? (
                          <img className={classes.img} src={image} alt="" />
                        ) : null}
                      </div>
                    ))}
                  </AutoPlaySwipeableViews>
                  <MobileStepper
                    steps={openedDetails.data.images.length}
                    position="static"
                    activeStep={activeStep}
                    className={classes.mobileStepper}
                    nextButton={
                      <Button size="small" onClick={this.handleNext} disabled={activeStep === openedDetails.data.images.length - 1}>
                        Next
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                      </Button>
                    }
                    backButton={
                      <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        Back
                      </Button>
                    }
                  />
                </div>
                <CardContent>
                  <Typography component="div">{openedDetails.data.description}</Typography>
                  <FacilityIcon facilities={openedDetails.data.facilities} />
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                  {this.renderShareButton(openedDetails.data.id)}
                  <Button
                    aria-label="Back to list"
                    className={classes.floatRight}
                    onClick={onBackToList}
                  >
                    Back to list
                  </Button>
                </CardActions>
              </Card>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AccommodationDetails);