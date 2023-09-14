import React from 'react';
import { Oval } from  'react-loader-spinner'

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <Oval
          ariaLabel="loading-indicator"
          height={100}
          width={100}
          strokeWidth={5}
          strokeWidthSecondary={5}
          color="blue"
          secondaryColor="white"
        />
      </div>
    </div>
  );
}

export default Loader;
