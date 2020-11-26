const { makeStyles } = require('@material-ui/core');

const useStyles = (color) =>
  makeStyles({
    textField: {
      '& .MuiInputBase-input': {
        border: 'none',
        borderRadius: 4,
        transition: 'box-shadow 0.1s ease-in-out',
        boxShadow: '5px 5px 5px #94949469, -5px -5px 5px #94949423',
      },
      '& .MuiInputBase-input:focus': {
        border: 'none',
        boxShadow: '7px 7px 7px 3px #94949469, -7px -7px 7px #94949423',
      },
      '& .MuiInputBase-input:hover': {
        border: 'none',
        boxShadow: '7px 7px 7px 3px #94949469, -7px -7px 7px #94949423',
      },

      '& .MuiOutlinedInput-root': {
        border: 'none',
      },

      '& .MuiInputBase-root:hover': {
        border: 'none',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },

      '& .PrivateNotchedOutline-legendNotched-7': {
        background: 'white',
        color: '#0f4c5c',
      },

      '& .MuiFormLabel-root': {
        color,
      },
    },
  });

export default useStyles;
