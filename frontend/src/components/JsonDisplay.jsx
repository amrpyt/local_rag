import React from 'react';

export const JsonDisplay = ({ children, className = '' }) => {
  return (
    <pre className={`text-sm font-mono ${className}`}>
      {children}
    </pre>
  );
};

export default JsonDisplay; 