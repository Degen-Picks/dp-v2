import { WagerUser } from '@/types/Wagers';
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type WagerUserContextType = {
  wagerUser: WagerUser | null;
  setWagerUser: React.Dispatch<React.SetStateAction<WagerUser | null>>;
};

export const WagerUserContext = createContext<WagerUserContextType | null>(null);

export const WagerUserContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [wagerUser, setWagerUser] = useState<WagerUser | null>(null);
  
    return (
      <WagerUserContext.Provider value={{ wagerUser, setWagerUser }}>
        {children}
      </WagerUserContext.Provider>
    );
};