import * as React from "react";

export function useIsMobile() {
   const [isMobile, setIsMobile] = React.useState(false);

   React.useEffect(() => {
      const checkMobile = () => {
         setIsMobile(window.innerWidth < 1024); // 1024px matches our lg: breakpoint
      };

      // Check initially
      checkMobile();

      // Add event listener
      window.addEventListener("resize", checkMobile);

      // Cleanup
      return () => window.removeEventListener("resize", checkMobile);
   }, []);

   return isMobile;
}
