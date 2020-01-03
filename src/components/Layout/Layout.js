import React from 'react';
import PropTypes from 'prop-types';
import normalizeCss from 'normalize.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';
import { CssBaseline } from '@material-ui/core';

import Header from '../Header';
import Footer from '../Footer';
import s from './Layout.css';

const black = {
  50: '#f5f5f5',
  100: '#e9e9e9',
  200: '#d9d9d9',
  300: '#c4c4c4',
  400: '#9d9d9d',
  500: '#000',
  600: '#555555',
  700: '#434343',
  800: '#262626',
  900: '#000000',
  A100: '#e9e9e9',
  A200: '#d9d9d9',
  A400: '#9d9d9d',
  A700: '#434343',
};

const blackColor = createPalette(black);

const theme = createMuiTheme({
  palette: {
    primary: {
      500: blackColor[500],
    },
  },
  typography: {
    useNextVariants: true,
  },
});

class Layout extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        {this.props.children}
        <Footer />
      </MuiThemeProvider>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withStyles(normalizeCss, s)(Layout);
