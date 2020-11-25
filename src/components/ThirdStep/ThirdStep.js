import React from 'react';

/* redux */

import FormTeamBoard from '../FormTeamBoard/FormTeamBoard';
import { Typography } from '@material-ui/core';

function ThirdStep() {
  return (
    <>
      <Typography
        variant="h5"
        component="h2"
        style={{
          margin: '0 10px',
        }}
      >
        Click and rename teams
      </Typography>
      <FormTeamBoard />
    </>
  );
}

export default ThirdStep;
