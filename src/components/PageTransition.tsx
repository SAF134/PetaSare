import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
 return (
 <AnimatePresence mode="wait">
 <motion.div key={pathname} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition as unknown}>
 {children}
 </motion.div>
 </AnimatePresence>
 );
};

export default PageTransition;
