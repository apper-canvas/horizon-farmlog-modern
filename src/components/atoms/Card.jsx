import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
  ...props
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: ''
  };

  const baseClasses = `
    bg-white border border-gray-200 rounded-xl
    ${paddingClasses[padding]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  const cardProps = {
    className: baseClasses,
    onClick,
    ...props
  };

  if (hover) {
    return (
      <motion.div
        {...cardProps}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
        style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
        whileHover={{
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          scale: 1.02,
          y: -2
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div {...cardProps}>
      {children}
    </div>
  );
};

export default Card;