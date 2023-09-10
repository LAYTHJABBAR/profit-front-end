export interface Data {
    ID: number | string;
    Address: string;
    Street: string;
    City: string;
    State: string;
    postalCodeFSA: string;
    postalCodeNAN: string;
    completedJobs: number;
    completedRevenue: string;
  }

  export interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
  }
  