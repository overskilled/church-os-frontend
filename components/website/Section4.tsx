"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useScopedI18n } from "@/locale/client";
import { Button } from "../ui/button";

export default function Section4() {
  const t = useScopedI18n("website.section4.faq");
  
  const faqSections = [
    {
      category: t("sections.features.category"),
      questions: [
        {
          question: t("sections.features.questions.churchSize"),
          answer: t("sections.features.answers.churchSize")
        },
        {
          question: t("sections.features.questions.branchManagement"),
          answer: t("sections.features.answers.branchManagement")
        },
        {
          question: t("sections.features.questions.offlineMode"),
          answer: t("sections.features.answers.offlineMode")
        }
      ]
    },
    {
      category: t("sections.security.category"),
      questions: [
        {
          question: t("sections.security.questions.dataProtection"),
          answer: t("sections.security.answers.dataProtection")
        },
        {
          question: t("sections.security.questions.financialAccess"),
          answer: t("sections.security.answers.financialAccess")
        },
        {
          question: t("sections.security.questions.dataStorage"),
          answer: t("sections.security.answers.dataStorage")
        }
      ]
    },
    {
      category: t("sections.pricing.category"),
      questions: [
        {
          question: t("sections.pricing.questions.pricingModel"),
          answer: t("sections.pricing.answers.pricingModel")
        },
        {
          question: t("sections.pricing.questions.donationFees"),
          answer: t("sections.pricing.answers.donationFees")
        },
        {
          question: t("sections.pricing.questions.planChange"),
          answer: t("sections.pricing.answers.planChange")
        }
      ]
    },
    {
      category: t("sections.support.category"),
      questions: [
        {
          question: t("sections.support.questions.deploymentTime"),
          answer: t("sections.support.answers.deploymentTime")
        },
        {
          question: t("sections.support.questions.training"),
          answer: t("sections.support.answers.training")
        },
        {
          question: t("sections.support.questions.languages"),
          answer: t("sections.support.answers.languages")
        }
      ]
    }
  ];

  const [openItems, setOpenItems] = useState<number[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleItem = (index: number) => {
    const contentElement = contentRefs.current[index];
    
    if (openItems.includes(index)) {
      // Fermeture avec animation
      if (contentElement) {
        contentElement.style.maxHeight = contentElement.scrollHeight + "px";
        // Force reflow
        contentElement.offsetHeight;
        contentElement.style.maxHeight = "0px";
        
        setTimeout(() => {
          setOpenItems(prev => prev.filter(i => i !== index));
          if (contentElement) {
            contentElement.style.maxHeight = "";
          }
        }, 300);
      } else {
        setOpenItems(prev => prev.filter(i => i !== index));
      }
    } else {
      // Ouverture avec animation
      setOpenItems(prev => [...prev, index]);
      setTimeout(() => {
        if (contentElement) {
          contentElement.style.maxHeight = contentElement.scrollHeight + "px";
          setTimeout(() => {
            if (contentElement) {
              contentElement.style.maxHeight = "none";
            }
          }, 300);
        }
      }, 10);
    }
  };

  return (
    <div className="w-full bg-background py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header minimaliste */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-gray-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {t("title")}
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
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
                      className="border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                      >
                        <span className="text-gray-900 font-medium pr-4">
                          {item.question}
                        </span>
                        <div className="flex-shrink-0 transition-transform duration-300">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      {/* Answer with smooth animation */}
                      <div
                        ref={el => {
                          contentRefs.current[globalIndex] = el;
                        }}
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? '' : 'max-h-0'
                        }`}
                        style={{
                          maxHeight: isOpen ? 'none' : '0px'
                        }}
                      >
                        <div className="px-6 pb-4 border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                            {item.answer}
                          </p>
                        </div>
                      </div>
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
          <div className="inline-block border border-gray-200 rounded-2xl p-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {t("cta.title")}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button  className="px-6 py-3 text-foreground bg-transparent hover:bg-foreground hover:text-muted">
                {t("cta.contact")}
              </Button>
              <Button  className="px-6 py-3 border bg-foreground text-muted hover:bg-transparent hover:border-foreground hover:text-foreground">
                {t("cta.documentation")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}