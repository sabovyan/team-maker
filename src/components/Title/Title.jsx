import React from 'react';
import Typography from '@material-ui/core/Typography';
import styles from './Title.module.css';

function Title({ title, ...props }) {
  return (
    <>
      <Typography
        {...props}
        align="center"
        variant="h4"
        component="h3"
        color="textSecondary"
        className={styles.title}
      >
        {title}
      </Typography>
    </>
  );
}

export default Title;
