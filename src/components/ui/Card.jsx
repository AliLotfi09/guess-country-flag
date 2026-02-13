import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  className = '', 
  hover = false,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : {}}
      className={`
        bg-white rounded-3xl p-8
        border-2 border-gray-200
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};