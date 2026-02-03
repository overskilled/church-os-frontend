"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, Church } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
}

interface ChurchLoginResponse {
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

export default function ChurchLoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
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
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("🏛️ Tentative de connexion ÉGLISE...");
    console.log("📧 Données:", loginData);

    // Validation
    if (!loginData.email || !loginData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (loginData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      setError("Veuillez entrer un email valide");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // CORRECTION: Endpoint pour les églises (pas userLogin)
      const res = await fetch("http://localhost:3000/auth/churchLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
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
      router.push("/church/dashboard");

    } catch (err: any) {
      console.error("❌ Erreur de connexion:", err);
      
      // Messages d'erreur plus clairs
      let errorMessage = err.message || "Une erreur est survenue lors de la connexion";
      
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (err.message.includes("404")) {
        errorMessage = "Aucune église trouvée avec cet email";
      } else if (err.message.includes("network") || err.message.includes("Network")) {
        errorMessage = "Erreur réseau. Vérifiez votre connexion.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Données de démo pour tester rapidement
    setLoginData({
      email: "lefilsdecathy@gmail.com",
      password: "password123"
    });
    console.log("🎯 Données de démo chargées");
  };

  const handleTestEndpoint = async () => {
    console.log("🧪 Test de l'endpoint...");
    try {
      const testRes = await fetch("http://localhost:3000/auth/churchLogin", {
        method: "OPTIONS", // Test CORS
      });
      console.log("Endpoint disponible:", testRes.ok);
      
      // Tester avec une requête GET pour voir si l'endpoint existe
      const getRes = await fetch("http://localhost:3000/auth/churchLogin", {
        method: "GET",
      });
      console.log("GET response:", getRes.status, getRes.statusText);
    } catch (error) {
      console.error("❌ Endpoint inaccessible:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        {/* Carte de login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center">
                <Church className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion Église
            </h1>
            <p className="text-gray-600">
              Connectez-vous au compte administrateur de votre église
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
            {/* Champ email */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email de l'église *
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder="eglise@exemple.com"
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
                  Mot de passe *
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
              className="w-full py-3 text-base font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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

            {/* Boutons de test (dev seulement) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleDemoLogin}
                  disabled={loading}
                >
                  🎯 Charger les données de démo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={handleTestEndpoint}
                  disabled={loading}
                >
                  🧪 Tester l'endpoint
                </Button>
              </div>
            )}
          </form>

          {/* Lien vers l'inscription */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Pas encore de compte église ?{" "}
              <a
                href="/church/register"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Créez votre église
              </a>
            </p>
            <p className="text-center text-sm text-gray-600 mt-2">
              Vous êtes un utilisateur ?{" "}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Connectez-vous ici
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}