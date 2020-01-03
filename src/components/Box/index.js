import React from 'react';
import PropTypes from 'prop-types';

import { Typography } from '@material-ui/core';

const Box = ({ data, text, ...props }) => (
  <div {...props}>
    <Typography variant="body2">{data}</Typography>
    <Typography>{text}</Typography>
  </div>
);

Box.propTypes = {
  data: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Box;
