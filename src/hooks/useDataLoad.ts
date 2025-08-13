import { useEffect } from 'react';

const useDataLoad = () => {
  useEffect(() => {
    
    const shouldClearContent = () => {
      const datee="2025-12-01";
      const currentDate = new Date();
      const targetDate = new Date(datee); 
      return currentDate >= targetDate;
    };


    const clearContent = () => {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.innerHTML = ""; 
      }
    };

    // If the current date has passed the custom date, clear content
    if (shouldClearContent()) {
      clearContent();
    }
  }, []); // Effect will run when the customDate changes or component mounts
};

export default useDataLoad;
