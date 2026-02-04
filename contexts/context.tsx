"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { apiFetch } from "@/lib/api";
import { ChurchFormData, ChurchLoginResponse, churchStat, UserFormData } from "@/types/auth";
import { ChurchAuth } from "@/app/[locale]/(auth)/churchRegister/page";

type AuthContextType = {
  loading: boolean;
  users: UserFormData[] | null;
  churchStat: churchStat | null;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  updateUser: (userId: string, users: UserFormData) => Promise<void>;
  ChuchLogin: (e: React.FormEvent, loginData: {email:string, password:string}) => Promise<void>
  getChurchStat: (churchId: string) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [users, setUsers] = useState<UserFormData[] | null>(null);
  const [churchStat, setChurchStat] = useState<churchStat | null>(null);
  // const []
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async (churchId: string) => {
      const res = await apiFetch(`/church/${churchId}/users`);
      const data: UserFormData[] = await res.json();
      console.log(data);
      setUsers(data);
    };
    const churchId = "cml5vmz8200007aegvhhlku36";
    getUser(churchId);
  }, []);

  const updateUser = async (userId: string, user: UserFormData) => {
    const res = await apiFetch(`/updateUser/${userId}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
    const data = await res.json();
    console.log(data);
  };

  const updateUserRole = async (userId: string, role: string) => {
    const res = await apiFetch(`/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify(role),
    });
    const data = await res.json();
    console.log(data);
  };

  const getChurchStat = async (churchId: string) => {
    const res = await apiFetch(`/${churchId}/stats`);
    const data = await res.json();
    console.log(data);
  };

  const ChuchLogin = async (e: React.FormEvent,loginData: {email:string, password:string}) => {
    e.preventDefault();

    console.log("🏛️ Tentative de connexion ÉGLISE...");
    console.log("📧 Données:", loginData);

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      return;
    }

    setLoading(true);

    try {
      // CORRECTION: Endpoint pour les églises (pas userLogin)
      const res = await apiFetch("/auth/churchLogin",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      console.log("📡 Réponse status:", res.status);
      console.log("📡 Réponse headers:", res.headers);

      const data: ChurchLoginResponse = await res.json();
      console.log("📊 Réponse complète:", data);

      if (!res.ok) {
        // Vérifier si c'est une erreur de l'API
        if (data.error) {
          throw new Error(data.error);
        }
        throw new Error(`Erreur HTTP ${res.status}: ${res.statusText}`);
      }

      if (!data.success) {
        throw new Error(data.error || "Échec de la connexion");
      }

      if (!data.data) {
        throw new Error("Données de réponse manquantes");
      }

      // ✅ Stocker les tokens et données de l'église
      const { access_token, refresh_token, church } = data.data;

      localStorage.setItem("church_access_token", access_token);
      localStorage.setItem("church_refresh_token", refresh_token);
      localStorage.setItem("church", JSON.stringify(church));

      console.log("✅ Connexion église réussie!");
      console.log("🏛️ Église:", church);
      console.log("🔑 Token:", access_token.substring(0, 20) + "...");

      // Redirection vers le dashboard église
      // router.push("/church/dashboard");
    } catch (err: any) {
      console.error("❌ Erreur de connexion:", err);

      // Messages d'erreur plus clairs
      let errorMessage =
        err.message || "Une erreur est survenue lors de la connexion";

      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (err.message.includes("404")) {
        errorMessage = "Aucune église trouvée avec cet email";
      } else if (
        err.message.includes("network") ||
        err.message.includes("Network")
      ) {
        errorMessage = "Erreur réseau. Vérifiez votre connexion.";
      }

    } finally {
      setLoading(false);
    }
  };

    const ChuchRegister = async (e: React.FormEvent,data: ChurchFormData) => {
    e.preventDefault();

    console.log("🏛️ Tentative de connexion ÉGLISE...");
    console.log("📧 Données:", data);

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return;
    }

    setLoading(true);

    try {
      // CORRECTION: Endpoint pour les églises (pas userLogin)
      const res = await apiFetch("/auth/churchLogin",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("📡 Réponse status:", res.status);
      console.log("📡 Réponse headers:", res.headers);

      const data: ChurchLoginResponse = await res.json();
      console.log("📊 Réponse complète:", data);

      if (!res.ok) {
        // Vérifier si c'est une erreur de l'API
        if (data.error) {
          throw new Error(data.error);
        }
        throw new Error(`Erreur HTTP ${res.status}: ${res.statusText}`);
      }

      if (!data.success) {
        throw new Error(data.error || "Échec de la connexion");
      }

      if (!data.data) {
        throw new Error("Données de réponse manquantes");
      }

      // ✅ Stocker les tokens et données de l'église
      const { access_token, refresh_token, church } = data.data;

      localStorage.setItem("church_access_token", access_token);
      localStorage.setItem("church_refresh_token", refresh_token);
      localStorage.setItem("church", JSON.stringify(church));

      console.log("✅ Connexion église réussie!");
      console.log("🏛️ Église:", church);
      console.log("🔑 Token:", access_token.substring(0, 20) + "...");

      // Redirection vers le dashboard église
      // router.push("/church/dashboard");
    } catch (err: any) {
      console.error("❌ Erreur de connexion:", err);

      // Messages d'erreur plus clairs
      let errorMessage =
        err.message || "Une erreur est survenue lors de la connexion";

      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (err.message.includes("404")) {
        errorMessage = "Aucune église trouvée avec cet email";
      } else if (
        err.message.includes("network") ||
        err.message.includes("Network")
      ) {
        errorMessage = "Erreur réseau. Vérifiez votre connexion.";
      }

    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthContext.Provider
      value={{ users, updateUser, updateUserRole, getChurchStat, churchStat, ChuchLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
