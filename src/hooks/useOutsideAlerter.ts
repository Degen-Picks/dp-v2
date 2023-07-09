import { useEffect } from "react";
/*
 * Hook that alerts clicks outside of the passed ref
 */
export const useOutsideAlerter = (ref, callback) => {
  useEffect(() => {
    // init callback if clicked on outside of element
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
