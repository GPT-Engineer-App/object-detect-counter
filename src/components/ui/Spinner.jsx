import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

const Spinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div
        className={cn(
          'border-4 border-t-transparent border-solid rounded-full animate-spin',
          sizeClasses[size]
        )}
      ></div>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Spinner;