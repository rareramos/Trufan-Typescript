import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Grid from '@material-ui/core/Grid';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
import s from './FanCards.css';
import Card from '../Card';

class FanCards extends React.Component {
  render() {
    const { fansToShow, socialType } = this.props;
    return (
      // <GridList
      //   // container
      //   spacing={12}
      //   cols={3}
      //   component="div"
      //   classes={{ root: s.root }}
      //   // cellHeight={160}
      //   // className={classes.gridList}
      //   // cols={3}
      //   // className={s.root}
      //   // classes={{ root: s.root }}
      // >
      //   {fansToShow.map(fan => (
      //     <GridListTile
      //       key={fan.profile_img}
      //       component="div"
      //       // className={s['card-wrapper']}
      //       classes={{
      //         root: s['card-wrapper'],
      //         tile: s['card-tile'],
      //       }}
      //     >
      //       <Card
      //         key={fan.profile_img}
      //         socialType={socialType}
      //         displayName={fan.name}
      //         username={fan.username}
      //         imgSrc={fan.profile_img}
      //         stats={fan.stats}
      //       />
      //     </GridListTile>
      //   ))}
      // </GridList>
      <Grid
        container
        spacing={16}
        alignContent="space-between"
        alignItems="flex-start"
        justify="space-between"
        className={s.root}
      >
        {fansToShow.map(fan => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card
              key={fan.profile_img}
              socialType={socialType}
              displayName={fan.name}
              username={fan.username}
              imgSrc={fan.profile_img}
              stats={fan.stats}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
}

FanCards.propTypes = {
  fansToShow: PropTypes.arrayOf(PropTypes.object).isRequired,
  // updateFanSelected: PropTypes.bool.isRequired,
  // id: PropTypes.string.isRequired,
  socialType: PropTypes.string.isRequired,
  // countSelectedFans: PropTypes.func.isRequired,
};

export default withStyles(s)(FanCards);
