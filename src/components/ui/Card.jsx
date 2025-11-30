import React from 'react';
import { motion } from 'framer-motion';

/**
 * A reusable card component with optional hover effects
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {boolean} props.hover - Add hover effect
 * @param {string} props.className - Additional classes
 */
const Card = ({ 
  children, 
  hover = false, 
  className = '', 
  onClick = null,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-md overflow-hidden';
  const hoverStyles = hover ? 'transition-all duration-300 hover:shadow-lg' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  return onClick ? (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  ) : (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 