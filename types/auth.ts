export type genre = "Homme" | "Femme";
export type Role = "Admin" | "fidel" | "member";
type taille = "100" | "200" | "300" | "400" | "500";
export type departement = "chorale" | "protocole" | "intercession";

// types/auth.ts
export type CompteType = "ChurchCompte" | "UserCompte";

export interface UserFormData {
  fullName: string;
  phone: string;
  password: string;
  churchId: string;
  email?: string;
  role?: "PASTORAL" | "MEMBER" | "FIDEL";
  gender?: "HOMME" | "FEMME" | "AUTRE";
  department?:
    | "CHORALE"
    | "PROTOCOLE"
    | "INTERCESSION"
    | "PRESENTIELLE"
    | "AUTRE";
  dateOfBirth?: string;
  placeOfBirth?: string;
}

export interface ChurchFormData {
  name: string;
  slogan: string;
  city: string;
  address: string;
  size: string;
  email: string;
  phone: string;
  password: string;
  website?: string;
}

export interface churchStat {
  churchId: string;
  churchName: string;
  totalMembers: number;
  pastoralCount: number;
  activeMembers: number;
  inactiveMembers: number;
  departments: {
    department: string;
    count: number;
  };
  roles: {
    role: string;
    count: number;
  };
}

export interface ChurchLoginResponse {
  success: boolean;
  data?: {
    church: {
      id: string;
      name: string;
      email: string;
      phone: string;
      city: string;
      address: string;
      slogan: string;
    };
    access_token: string;
    refresh_token: string;
  };
  error?: string;
  message?: string;
  statut?: number;
}
