export type PublicAdmin = {
  id: string;
  username: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
  createdAt: string;
};

export type DashboardStats = {
  totalUsers: number;
  usersByProvider: {
    email: number;
    google: number;
    apple: number;
    discord: number;
  };
  newUsersLast7Days: number;
  totalAdmins: number;
};

export type PortalUserRow = {
  id: string;
  name: string;
  email: string;
  authProvider: string;
  createdAt: string;
};

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number = 0,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}
