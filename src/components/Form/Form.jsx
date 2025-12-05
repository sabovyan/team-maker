import React from 'react';

export default function Form({ children, onSubmit, ...props }) {
  return (
    <form {...props} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
