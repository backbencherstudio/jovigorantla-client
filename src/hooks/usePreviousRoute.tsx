import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function usePreviousRoute() {
  const location = useLocation();
  const previousPath = useRef(null);

  useEffect(() => {
    previousPath.current = location.pathname;
  }, [location]);

  return previousPath.current;
}

export default usePreviousRoute;
