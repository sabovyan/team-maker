import React from 'react';

/* redux */

import FormTeamBoard from '../FormTeamBoard/FormTeamBoard';
import { Typography } from '@material-ui/core';
import Title from '../Title/Title';

function ThirdStep() {
  return (
    <>
      <Title title="Click and change the names " />

      <FormTeamBoard />
    </>
  );
}

export default ThirdStep;
