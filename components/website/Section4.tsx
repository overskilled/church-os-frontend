"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqSections = [
  {
    category: "Fonctionnalités",
    questions: [
      {
        question: "ChurchOS est-il adapté aux petites comme aux grandes églises ?",
        answer: "Absolument. ChurchOS est conçu pour s'adapter à toutes les tailles d'églises. Que vous soyez une petite assemblée de 50 membres ou une grande église de plusieurs milliers avec des branches multiples, notre plateforme s'adapte à vos besoins."
      },
      {
        question: "Puis-je gérer plusieurs branches d'église avec une seule interface ?",
        answer: "Oui, ChurchOS a été spécialement conçu pour les églises multi-branches. Vous pouvez créer et gérer différentes branches, avec des données séparées par branche tout en ayant une vue consolidée globale."
      },
      {
        question: "L'application fonctionne-t-elle avec une connexion Internet limitée ?",
        answer: "Oui, nous avons optimisé ChurchOS pour les contextes à faible connectivité. L'application mobile supporte le mode offline pour les sermons téléchargés, la lecture de la Bible, et certaines fonctionnalités."
      }
    ]
  },
  {
    category: "Sécurité & Données",
    questions: [
      {
        question: "Comment protégez-vous les données sensibles de notre église ?",
        answer: "Nous utilisons un chiffrement de niveau bancaire (AES-256) pour toutes les données. Chaque église dispose d'un environnement isolé et nous ne vendons ni ne partageons jamais vos données."
      },
      {
        question: "Qui a accès aux informations financières ?",
        answer: "Seuls les utilisateurs avec les rôles spécifiques (Trésorier, Pasteur principal, Administrateur) peuvent accéder aux données financières. Toutes les actions sont journalisées."
      },
      {
        question: "Où sont stockées nos données ?",
        answer: "Toutes les données sont stockées sur des serveurs sécurisés en France (RGPD compliant). Des sauvegardes automatiques sont effectuées quotidiennement."
      }
    ]
  },
  {
    category: "Tarification",
    questions: [
      {
        question: "Quel est le modèle de tarification ?",
        answer: "Nous proposons un modèle SaaS basé sur le nombre de membres actifs. Trois formules disponibles avec un essai gratuit de 30 jours."
      },
      {
        question: "Y a-t-il des frais pour les dons via Mobile Money ?",
        answer: "Seuls les frais des opérateurs (MTN/Orange) s'appliquent. ChurchOS ne prélève aucune commission supplémentaire sur les dons."
      },
      {
        question: "Puis-je changer de formule à tout moment ?",
        answer: "Oui, vous pouvez modifier votre formule à tout moment depuis votre tableau de bord, sans frais supplémentaires."
      }
    ]
  },
  {
    category: "Support & Déploiement",
    questions: [
      {
        question: "Combien de temps pour déployer ChurchOS ?",
        answer: "La configuration initiale prend 2-3 jours. Nous vous accompagnons personnellement pendant tout le processus."
      },
      {
        question: "Proposez-vous une formation ?",
        answer: "Oui, nous incluons 3 sessions de formation et fournissons une documentation complète avec tutoriels vidéo."
      },
      {
        question: "Quelles langues sont supportées ?",
        answer: "ChurchOS est entièrement bilingue Français/Anglais, avec d'autres langues prévues prochainement."
      }
    ]
  }
];

export default function Section4() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="w-full bg-muted py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header minimaliste */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-gray-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              FAQ
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Réponses aux questions les plus fréquentes sur ChurchOS
          </p>
        </div>

        {/* FAQ Accordions - Style épuré */}
        <div className="space-y-8">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Category Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {section.category}
              </h3>
              
              {/* Questions */}
              <div className="space-y-3">
                {section.questions.map((item, itemIndex) => {
                  const globalIndex = sectionIndex * 10 + itemIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div 
                      key={itemIndex} 
                      className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                      >
                        <span className="text-gray-900 font-medium pr-4">
                          {item.question}
                        </span>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      {/* Answer */}
                      {isOpen && (
                        <div className="px-6 pb-4 border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Separator (sauf dernier) */}
              {sectionIndex < faqSections.length - 1 && (
                <div className="h-px bg-gray-100 my-8"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section - Minimaliste */}
        <div className="mt-20 text-center">
          <div className="inline-block border border-gray-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Une question spécifique ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Contactez notre équipe pour une réponse personnalisée.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Contacter l'équipe
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Voir la documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}