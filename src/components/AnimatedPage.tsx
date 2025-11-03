import { motion, Variants } from "framer-motion";
import React from "react";

const animations: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

interface AnimatedPageProps {
  children: React.ReactNode;
}

const AnimatedPage = ({ children }: AnimatedPageProps) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;