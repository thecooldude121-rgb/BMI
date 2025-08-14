import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for micro-interactions
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 }
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const hoverLift = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
};

export const buttonHover = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
};

export const tabTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

// Animated Card Component
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  delay?: number;
}> = ({ children, className = "", hoverable = false, delay = 0 }) => {
  return (
    <motion.div
      className={`${className}`}
      variants={scaleIn}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      {...(hoverable && {
        whileHover: { y: -4, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" },
        transition: { duration: 0.3 }
      })}
    >
      {children}
    </motion.div>
  );
};

// Animated Button Component
export const AnimatedButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ children, onClick, className = "", type = "button", disabled = false }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
};

// Animated Tab Content
export const AnimatedTabContent: React.FC<{
  children: React.ReactNode;
  tabKey: string;
  isActive: boolean;
}> = ({ children, tabKey, isActive }) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={tabKey}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={tabTransition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Staggered Animation Container
export const StaggeredContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

// Animated List Item
export const AnimatedListItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  index?: number;
}> = ({ children, className = "", index = 0 }) => {
  return (
    <motion.div
      className={className}
      variants={staggerItem}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      {children}
    </motion.div>
  );
};