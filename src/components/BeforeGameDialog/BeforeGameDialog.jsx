import React from 'react';
import { Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';

function BeforeGameDialog({ open, handleCloseDialog, handleConfirmDialog }) {
  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are You Ready To Start The Game?
      </DialogTitle>

      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          style={{
            color: '#0f4c5c',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmDialog}
          autoFocus
          style={{
            color: '#fb8b24',
          }}
        >
          Let's Go
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BeforeGameDialog;
