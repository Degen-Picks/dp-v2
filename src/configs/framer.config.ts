import { Variants } from "framer-motion";

//click animations
export const largeClickAnimation = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 1 },
};
export const midClickAnimation = {
  whileHover: { scale: 1.06 },
  whileTap: { scale: 1 },
};
export const smallClickAnimation = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 1 },
};
export const linkClickAnimation = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 1 },
};

//tap animations
export const tapAnimation = {
  whileTap: { scale: 0.95 },
  transition: { duration: 0.01, ease: "easeInOut" },
};
export const midTapAnimation = {
  whileTap: { scale: 0.95 },
  transition: { duration: 0.1, ease: "easeInOut" },
};
//opacity animations
export const exitAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.7, ease: "easeInOut" },
};
export const midExitAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5, ease: "easeInOut" },
};
export const fastExitAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: "easeInOut" },
};
export const vFastExitAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.05, ease: "easeInOut" },
};
export const enterAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1.4, ease: "easeInOut" },
};

//variants
export const arrowVariants: Variants = {
  start: {
    rotate: 0,
    transition: {
      duration: 0.4,
    },
  },
  end: {
    rotate: 180,
    transition: {
      duration: 0.4,
    },
  },
};

//background
export const backgroundAnimations = (color: string) => {
  return {
    initial: { backgroundColor: color },
    // animate: {backgroundColor: color},
    transition: { duration: 0.4, ease: "easeInOut" },
  };
};

//dropdown
export const dropdownAnimations: Variants = {
  hidden: {
    y: -25,
    scale: 0.96,
  },
  show: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      ease: "easeInOut",
    },
  },
};
export const dropdownItemsAnimations = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
  transition: {
    duration: 0.4,
    ease: "easeInOut",
    type: "spring",
    stiffness: 300,
    damping: 24,
  },
};

//hover animations

export const underlineAnimation = {
  initial: { opacity: 0, y: 2 },
  whileHover: { opacity: 0.8, y: 0 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

//modal
export const modalAnimation = {
  initial: { scale: 0.9 },
  animate: { scale: 1 },
  exit: { scale: 0.9 },
  transition: { duration: 0.7, ease: "easeInOut" },
};

export const fadeVariants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
  open: { opacity: 1, transition: { delay: 0.5, duration: 0.5 } },
};

export const slideDown = (animate: boolean) => ({
  initial: { y: -300, opacity: 0 },
  animate: { y: animate ? 0 : -300, opacity: animate ? 1 : 0 },
  transition: { duration: 1.5, ease: "easeInOut" },
});

export const slideUp = (
  animate: boolean,
  distance: number = 300,
  duration: number = 1,
  delay: number = 0,
  startOpacity: number = 1
) => ({
  initial: { y: distance, opacity: startOpacity },
  animate: { y: animate ? 0 : distance, opacity: animate ? 1 : 0 },
  transition: { duration: duration, ease: "easeInOut", delay: delay },
});
export const slideLeft = (
  animate: boolean,
  distance: number = 300,
  duration: number = 1,
  delay: number = 0,
  startOpacity: number = 1
) => ({
  initial: { x: distance, opacity: startOpacity },
  animate: { x: animate ? 0 : distance, opacity: animate ? 1 : 0 },
  transition: { duration: duration, ease: "easeInOut", delay: delay },
});
export const slideRight = (
  animate: boolean,
  distance: number = -300,
  duration: number = 1,
  delay: number = 0,
  startOpacity: number = 1
) => ({
  initial: { x: distance, opacity: startOpacity },
  animate: { x: animate ? 0 : distance, opacity: animate ? 1 : 0 },
  transition: { duration: duration, ease: "easeInOut", delay: delay },
});

export const imageLoadAnimation = (animate: boolean) => ({
  initial: { opacity: 0 },
  animate: { opacity: animate ? 1 : 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: "easeInOut" },
});

export const menuAnimation = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: "easeInOut" },
  // whileHover: { scale: 1.06 },
  // whileTap: { scale: 1 },
};
export const scaleExitAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.4, ease: "easeInOut" },
};

export const opacity = (
  animate: boolean,
  startOpacity: number = 0,
  duration: number = 1,
  delay: number = 0
) => ({
  initial: { opacity: startOpacity },
  animate: { opacity: animate ? 1 : startOpacity },
  exit: { opacity: 1 },
  transition: { duration: duration, ease: "easeInOut", delay: delay },
});
