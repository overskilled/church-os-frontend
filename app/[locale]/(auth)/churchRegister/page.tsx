"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface ChurchAuth {
  city: string;
  phone: string;
  name: string;
  address: string;
  email: string;
  slogan: string;
  password: string;
  website: string;
}
export type ServiceResponse<T> = {
  success: boolean;
  statut: number;
  data?: T;
  error?: string;
  message?: string;
};
export default function ChurchRegisterPage() {
  const [churchAuth, setChurchAuth] = useState<ChurchAuth>({
    city: "",
    phone: "",
    name: "",
    address: "",
    email: "",
    slogan: "",
    password: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChurchAuth((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(`Champ ${name} modifié:`, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🔍 Début de la soumission...");
    console.log("📋 Données du formulaire:", churchAuth);

    setLoading(true);

    try {
      console.log("📤 Envoi de la requête à l'API...");

      // AJOUTE ICI un log pour voir exactement ce qui est envoyé
      const requestBody = {
        name: churchAuth.name,
        slogan: churchAuth.slogan,
        city: churchAuth.city,
        address: churchAuth.address,
        email: churchAuth.email,
        phone: churchAuth.phone,
        password: churchAuth.password,
        website: churchAuth.website || undefined,
      };

      console.log("📦 Corps de la requête:", requestBody);

      const res = await fetch("http://localhost:3000/auth/churchRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Réponse reçue, statut:", res.status);

      const data: ServiceResponse<T> = await res.json();
      console.log("📊 Données de réponse:", data);

      if (data.success) {
        const { access_token, refresh_token, church } = data.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("church", JSON.stringify(church));

        console.log("✅ Tokens stockés:", {
          access_token: access_token.substring(0, 20) + "...",
          refresh_token: refresh_token.substring(0, 20) + "...",
        });

        // 2. Rediriger vers le dashboard
        window.location.href = "/dashboard";
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || `Erreur ${res.status}`);
      }

      console.log("✅ Inscription réussie!");

      // Reset du formulaire
      setChurchAuth({
        city: "",
        phone: "",
        name: "",
        address: "",
        email: "",
        slogan: "",
        password: "",
        website: "",
      });
    } catch (err: any) {
      console.error("❌ Erreur lors de l'inscription:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center flex-col gap-4 min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          Création d'église
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Créez le compte de votre église
        </p>

        {/* FORM SIMPLE avec onSubmit */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom de l'église *
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={churchAuth.name}
              onChange={handleChange}
              placeholder="Ex: Cité des Rois"
              className="rounded-lg bg-background shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="slogan" className="block text-sm font-medium mb-1">
              Slogan *
            </label>
            <Input
              type="text"
              id="slogan"
              name="slogan"
              value={churchAuth.slogan}
              onChange={handleChange}
              placeholder="Ex: Roi un jour, Roi toujours"
              className="rounded-lg bg-background shadow-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                Ville *
              </label>
              <Input
                type="text"
                id="city"
                name="city"
                value={churchAuth.city}
                onChange={handleChange}
                placeholder="Ex: Yaoundé"
                className="rounded-lg bg-background shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Téléphone *
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={churchAuth.phone}
                onChange={handleChange}
                placeholder="Ex: 0123456789"
                className="rounded-lg bg-background shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Adresse *
            </label>
            <Input
              type="text"
              id="address"
              name="address"
              value={churchAuth.address}
              onChange={handleChange}
              placeholder="Ex: Awae Esqualier"
              className="rounded-lg bg-background shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email *
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={churchAuth.email}
              onChange={handleChange}
              placeholder="Ex: citedesrois@gmail.com"
              className="rounded-lg bg-background shadow-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Mot de passe *
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              value={churchAuth.password}
              onChange={handleChange}
              placeholder="Minimum 8 caractères"
              className="rounded-lg bg-background shadow-sm"
              required
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-1">
              Site web (optionnel)
            </label>
            <Input
              type="url"
              id="website"
              name="website"
              value={churchAuth.website}
              onChange={handleChange}
              placeholder="Ex: https://citedesrois.com"
              className="rounded-lg bg-background shadow-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Création en cours..." : "Créer l'église"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Déjà une église ?{" "}
            <a href="/login" className="text-primary hover:underline">
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
