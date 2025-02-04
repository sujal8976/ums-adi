import React, { createContext, useState } from 'react';

export interface BreadcrumbItemType {
  to?: string;
  label: string;
}

type BreadcrumbContextType = {
  breadcrumbs: BreadcrumbItemType[];
  setBreadcrumbs: (items: BreadcrumbItemType[]) => void;
};

// Create the context with a default undefined value
export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

// Provider component
export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([]);

  const value = {
    breadcrumbs,
    setBreadcrumbs,
  };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
