"use client";

import { Search } from "@/components/Search";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ServiceResponse } from "../churchRegister/page";
import Image from "next/image";

export interface GetChurch {
  id: string;
  name: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  createdAt: string;
}

interface UserAuth {
  churchId: string;
  fullName: string;
  phone: string;
  password: string;
}

export default function UserRegisterPage() {
  /** ---------------- CHURCH LIST ---------------- */
  const [churches, setChurches] = useState<GetChurch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChurches = async () => {
      try {
        const res = await fetch("http://localhost:3000/church");
        const data = await res.json();
        console.log("Églises récupérées:", data);
        setChurches(data);
      } catch (err) {
        console.error("Erreur lors du chargement des églises:", err);
      }
    };

    fetchChurches();
  }, []);

  /** ---------------- USER FORM ---------------- */
  const [userData, setUserData] = useState<UserAuth>({
    churchId: "",
    fullName: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // IMPORTANT: Empêcher le rechargement de la page

    console.log("🔄 Début de l'inscription...");
    console.log("📋 Données:", userData);

    if (!userData.churchId) {
      alert("Veuillez sélectionner une église");
      return;
    }

    if (!userData.fullName || !userData.phone || !userData.password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    if (userData.password.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/userRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          phone: userData.phone,
          password: userData.password,
          churchId: userData.churchId,
        }),
      });

      const data: ServiceResponse<any> = await res.json();
      console.log("📥 Réponse API:", data);

      if (!data.success) {
        console.error("❌ Erreur:", data.error);
        return;
      }

      const { access_token, refresh_token, user } = data.data;

      // Stocker les tokens
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("✅ Inscription réussie!", {
        user,
        token: access_token.substring(0, 20) + "...",
      });

      // Redirection
      // alert("Inscription réussie ! Redirection...");
      window.location.href = "/churchDashboard";
    } catch (err: any) {
      console.error("❌ Erreur réseau:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  m-auto h-screen flex justify-center items-center">
       <div className="flex flex-col w-100 absolut z20">
         <h2 className="text-2xl font-bold mb-6 text-center">
           Inscription Utilisateur
         </h2>
         <p></p>
        {/* CORRECTION ICI: onSubmit au lieu de handleSubmit */}
         <form onSubmit={handleSubmit} className="space-y-4">
           {/* FULL NAME */}
           <div>
             <label className="block text-sm font-medium mb-1">
               Nom complet *
             </label>
             <Input
               name="fullName"
               placeholder="Ex: Jean Dupont"
               value={userData.fullName}
               onChange={handleChange}
               required
             />
           </div>
      
           {/* PHONE */}
           <div>
             <label className="block text-sm font-medium mb-1">
               Téléphone *
             </label>
             <Input
              name="phone"
               placeholder="Ex: 0123456789"
               value={userData.phone}
              onChange={handleChange}
              required
            />
          </div>
      
          {/* PASSWORD */}
          <div>
           <label className="block text-sm font-medium mb-1">
              Mot de passe *
           </label>
           <Input
             name="password"
             type="password"
              placeholder="Minimum 8 caractères"
             value={userData.password}
      //         onChange={handleChange}
             required
             minLength={8}
           />
         </div>
      
         {/* SEARCH CHURCH */}
         <div>
           <label className="block text-sm font-medium mb-1">
             Sélectionnez votre église *
           </label>
           {churches.length > 0 ? (
              <Search
                liste={churches}
               getLabel={(c) => c.name}
               getValue={(c) => c.id}
               placeholder="Rechercher une église..."
               value={userData.churchId}
               onSelect={(value) =>
                 setUserData((prev) => ({ ...prev, churchId: value }))
               }
             />
           ) : (
              <p className="text-sm text-gray-500">Chargement des églises...</p>
           )}
            {userData.churchId && (
             <p className="text-xs text-green-600 mt-1">
                Église sélectionnée:{" "}
                {churches.find((c) => c.id === userData.churchId)?.name}
              </p>
           )}
       </div>
      
           <Button type="submit" className="w-full" disabled={loading}>
             {loading ? "Inscription en cours..." : "Créer un compte"}
           </Button>
         </form>
       </div>

    </div>
  );
}
