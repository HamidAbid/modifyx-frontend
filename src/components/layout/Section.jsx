import React from 'react';
import { motion } from 'framer-motion';


const Section = ({ 
  children, 
  title, 
  subtitle,
  className = '', 
  id,
  background = 'bg-slate-950',
  animate = true,
  ...props 
}) => {
  
  return (
    <section 
      id={id}
      className={`py-16 px-4  ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto">
        {title && (
          <motion.h2
            initial={animate ? { opacity: 0, y: 20 } : { opacity: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-4"
          >
            {title}
          </motion.h2>
        )}
        
        {subtitle && (
          <motion.p
            initial={animate ? { opacity: 0, y: 20 } : { opacity: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 text-center mb-12 max-w-3xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
        
        {children}
      </div>
    </section>
  );
};

export default Section; 