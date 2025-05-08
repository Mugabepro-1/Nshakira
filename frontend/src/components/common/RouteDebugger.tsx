import { useLocation } from 'react-router-dom';

/**
 * A simple component that displays the current route path 
 * Used for debugging navigation issues
 */
const RouteDebugger = () => {
  const location = useLocation();
  
  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: 'rgba(0,0,0,0.7)', 
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999
      }}
    >
      Current path: {location.pathname}
    </div>
  );
};

export default RouteDebugger; 