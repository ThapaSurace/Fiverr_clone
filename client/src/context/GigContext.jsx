import React, { createContext, useState } from 'react';

export const GigContext = createContext();

export const GigProvider = ({ children }) => {
  const [selectedGig, setSelectedGig] = useState(null);

  return (
    <GigContext.Provider value={{ selectedGig, setSelectedGig }}>
      {children}
    </GigContext.Provider>
  );
};
