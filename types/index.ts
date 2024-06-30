export type AddUserParams = {
  email: string;
  password: string;
  name: string;
  role: string;
};

export type User = {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  role: any;
  lastSignInTime: string;
};

export type Driver = {
  name: string;
  notification_token: string;
};

export type Lots = {
  pd: string | null;
  qty: number | null;
};

export type Shipment = {
  uid?: string | undefined;
  date: string;
  ref_number: string;
  part_name: string;
  part_number: string;
  lots?: Lots[];
  remarks?: string;
  approval?: {
    pc?: {
      status: boolean;
      approved_by: string;
    };
    store?: {
      status: boolean;
      approved_by: string;
    };
    qc?: {
      status: boolean;
      approved_by: string;
    };
    approval?: {
      status: boolean;
      approved_by: string;
    };
  };
  delivery?: {
    status: boolean;
    date: string;
    by: string;
  };
};
