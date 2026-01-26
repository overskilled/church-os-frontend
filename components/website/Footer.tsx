import { Linkedin, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <div className="w-full bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Logo et description */}
          <div className="md:col-span-1">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-3">
                <span className="text-white text-2xl font-bold">Church <strong>O.S</strong></span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                La solution complète de gestion digitale pour les églises modernes.
                Centralisez la vie spirituelle, organisationnelle et administrative
                de votre communauté.
              </p>
              
              {/* Social Media */}
              <div className="flex items-center gap-4 mt-4">
                <a 
                  href="#" 
                  className="p-2 rounded-full bg-gray-800 hover:bg-purple-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="p-2 rounded-full bg-gray-800 hover:bg-purple-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="p-2 rounded-full bg-gray-800 hover:bg-purple-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="md:col-span-1">
          </div>

          {/* Ressources */}
          <div className="md:col-span-1">
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-400 mt-0.5" />
                <span className="text-gray-400">contact@churchos.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-purple-400 mt-0.5" />
                <span className="text-gray-400">+237 658 34 13 59</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                <span className="text-gray-400">Dash Tv, Douala</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-white font-medium mb-4">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ChurchOS. Tous droits réservés.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}