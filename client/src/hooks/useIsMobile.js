import { useState} from "react";
import { useEffect} from "react";
import React from 'react'

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth<768)
    useEffect(() => {
      const handler= () => setIsMobile(window.innerWidth<768)
      window.addEventListener('resize',handler)
      return () => window.removeEventListener('resize',handler)
    }, [])
    
    return isMobile
}

export default useIsMobile
