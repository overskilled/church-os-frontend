"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Phone, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginData {
  phone: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      fullName: string;
      phone: string;
      email?: string;
      role: string;
      churchId: string;
    };
    access_token: string;
    refresh_token: string;
  };
  error?: string;
  message?: string;
}

export default function Page() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({
    phone: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("🔐 Tentative de connexion...");
    console.log("📱 Données:", loginData);

    // Validation
    if (!loginData.phone || !loginData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (loginData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // CORRECTION: "POST" au lieu de "POSTE" et endpoint correct
      const res = await fetch("http://localhost:3000/auth/userLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData)
      });

      console.log("📡 Réponse status:", res.status);

      const data: LoginResponse = await res.json();
      console.log("📊 Réponse data:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Échec de la connexion");
      }

      if (!data.data) {
        throw new Error("Données de réponse manquantes");
      }

      // ✅ Stocker les tokens et données utilisateur
      const { access_token, refresh_token, user } = data.data;
      
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));
      
      console.log("✅ Connexion réussie!");
      console.log("👤 User:", user);
      console.log("🔑 Token (preview):", access_token.substring(0, 20) + "...");

      // Redirection vers le dashboard
      // router.push("/dashboard");

    } catch (err: any) {
      console.error("❌ Erreur de connexion:", err);
      setError(err.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Données de démo pour tester rapidement
    setLoginData({
      phone: "0123456789",
      password: "password123"
    });
    console.log("🎯 Données de démo chargées");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Carte de login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                <Phone className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion
            </h1>
            <p className="text-gray-600">
              Connectez-vous à votre compte ChurchOS
            </p>
          </div>

          {/* Messages d'erreur/succès */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-700">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ téléphone */}
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={loginData.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Champ mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Votre mot de passe"
                  className="pl-10"
                  required
                  minLength={8}
                  disabled={loading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 caractères
              </p>
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              className="w-full py-3 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>

            {/* Bouton démo (optionnel) */}
            {process.env.NODE_ENV === 'development' && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                🎯 Charger les données de démo
              </Button>
            )}
          </form>

          {/* Lien vers l'inscription */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Inscrivez-vous
              </a>
            </p>
          </div>
        </div>

        {/* Section debug (dev seulement) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-sm mb-2">🔍 Debug</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Téléphone:</span>
                <span className="font-mono">{loginData.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Mot de passe:</span>
                <span className="font-mono">
                  {loginData.password ? "•".repeat(loginData.password.length) : "-"}
                </span>
              </div>
              <button
                onClick={() => console.log("Données actuelles:", loginData)}
                className="text-blue-500 hover:underline text-xs"
              >
                Afficher dans la console
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}