import { useEffect } from 'react';
import useAuth from "./useAuth";

function useScript(src, integrity, crossorigin) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.integrity = integrity;
    script.crossOrigin = crossorigin;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src, integrity, crossorigin]);
}

export default useScript;