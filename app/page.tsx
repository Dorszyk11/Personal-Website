"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { translations, Language } from "./translations";

export default function Home() {
  const [activeSection, setActiveSection] = useState("HOME");
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      return saved || "en";
    }
    return "en";
  });

  const t = translations[language];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "pl" : "en";
    setLanguage(newLanguage);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage);
    }
  };

  useEffect(() => {
    const sections = ["HOME", "ABOUT", "EXPERIENCE", "EDUCATION", "SKILLS", "CONTACT"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const navItems = [
    { id: "HOME", label: t.nav.home },
    { id: "ABOUT", label: t.nav.about },
    { id: "EXPERIENCE", label: t.nav.experience },
    { id: "EDUCATION", label: t.nav.education },
    { id: "SKILLS", label: t.nav.skills },
    { id: "CONTACT", label: t.nav.contact },
  ];

  return (
    <main className="min-h-screen bg-[#E8F0F5]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
          
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <div className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium tracking-wider uppercase transition-colors ${
                    activeSection === item.id
                      ? "text-[#4ECDC4]"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
              aria-label="Toggle language"
            >
              <span className={language === "en" ? "font-bold text-[#4ECDC4]" : ""}>EN</span>
              <span className="text-gray-400">|</span>
              <span className={language === "pl" ? "font-bold text-[#4ECDC4]" : ""}>PL</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="HOME" className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Text Content */}
            <div className="flex-1 lg:pl-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-gray-900 text-4xl md:text-5xl lg:text-6xl">{t.hero.greeting}</span>{" "}
                <span className="text-[#4ECDC4]">{t.hero.role}</span>.
              </h1>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed max-w-xl">
                {t.hero.description}
              </p>
              <div className="flex flex-wrap gap-4 text-gray-700">
                <a href="tel:+48517647564" className="hover:text-[#4ECDC4] transition-colors">
                  {t.hero.phone}
                </a>
                <a href="mailto:tymbeixpol@gmail.com" className="hover:text-[#4ECDC4] transition-colors">
                  {t.hero.email}
                </a>
              </div>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-[#4ECDC4] transition-colors"
                >
                  {t.hero.github}
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-[#4ECDC4] transition-colors"
                >
                  {t.hero.linkedin}
                </a>
              </div>
            </div>

            {/* Right Side - Two Photos */}
            <div className="flex-1 flex justify-center lg:justify-end gap-4 items-start">
              <div className="relative w-full max-w-xs lg:max-w-sm aspect-[3/4] -mt-8 md:-mt-12">
                <Image
                  src="/ttymendorf_pic_1.jpg"
                  alt="Tymoteusz Tymendorf"
                  fill
                  className="object-cover rounded-lg shadow-xl"
                  priority
                />
              </div>
              <div className="relative w-full max-w-xs lg:max-w-sm aspect-[3/4] hidden md:block mt-8 md:mt-12">
                <Image
                  src="/ttymendorf_pic_2.jpg"
                  alt="Tymoteusz Tymendorf"
                  fill
                  className="object-cover rounded-lg shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="ABOUT" className="py-12 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.about.title}</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {t.about.content}
          </p>
        </div>
      </section>

      {/* Experience Section */}
      <section id="EXPERIENCE" className="py-12 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.experience.title}</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#4ECDC4] pl-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {t.experience.fullstack.title}
              </h3>
              <p className="text-gray-600 mb-1 text-lg">{t.experience.fullstack.company}</p>
              <p className="text-sm text-gray-500 mb-4">{t.experience.fullstack.period}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                {t.experience.fullstack.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="border-l-4 border-[#4ECDC4] pl-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {t.experience.ai.title}
              </h3>
              <p className="text-gray-600 mb-1 text-lg">{t.experience.ai.company}</p>
              <p className="text-sm text-gray-500 mb-4">{t.experience.ai.period}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                {t.experience.ai.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="EDUCATION" className="py-12 px-6 bg-[#E8F0F5]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.education.title}</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#4ECDC4]">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {t.education.degree}
            </h3>
            <p className="text-gray-600 mb-1 text-lg">{t.education.school}</p>
            <p className="text-sm text-gray-500">{t.education.status}</p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="SKILLS" className="py-12 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.skills.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#E8F0F5] p-6 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-lg">{t.skills.frontend}</p>
              <p className="text-gray-700">{t.skills.frontendContent}</p>
            </div>
            <div className="bg-[#E8F0F5] p-6 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-lg">{t.skills.backend}</p>
              <p className="text-gray-700">{t.skills.backendContent}</p>
            </div>
            <div className="bg-[#E8F0F5] p-6 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-lg">{t.skills.ai}</p>
              <p className="text-gray-700">{t.skills.aiContent}</p>
            </div>
            <div className="bg-[#E8F0F5] p-6 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-lg">{t.skills.database}</p>
              <p className="text-gray-700">{t.skills.databaseContent}</p>
            </div>
            <div className="bg-[#E8F0F5] p-6 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-lg">{t.skills.tools}</p>
              <p className="text-gray-700">{t.skills.toolsContent}</p>
            </div>
            <div className="bg-[#E8F0F5] p-6 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-lg">{t.skills.other}</p>
              <p className="text-gray-700">{t.skills.otherContent}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Languages & Certificates Section */}
      <section className="py-12 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Languages */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.languages.title}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-[#E8F0F5] rounded-lg">
                  <span className="text-gray-900 font-medium">{t.languages.english}</span>
                  <span className="px-4 py-1 bg-[#4ECDC4] text-white rounded-full text-sm font-medium">
                    B2
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#E8F0F5] rounded-lg">
                  <span className="text-gray-900 font-medium">{t.languages.chinese}</span>
                  <span className="px-4 py-1 bg-[#4ECDC4] text-white rounded-full text-sm font-medium">
                    B1
                  </span>
                </div>
              </div>
            </div>

            {/* Certificates */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.certificates.title}</h2>
              <div className="space-y-3">
                <div className="p-4 bg-[#E8F0F5] rounded-lg">
                  <p className="text-gray-900">{t.certificates.hsk1}</p>
                </div>
                <div className="p-4 bg-[#E8F0F5] rounded-lg">
                  <p className="text-gray-900">{t.certificates.hsk2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="CONTACT" className="py-12 px-6 bg-[#E8F0F5]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.contact.title}</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-700 mb-4 text-lg">{t.contact.location}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="tel:+48517647564" className="text-gray-700 hover:text-[#4ECDC4] transition-colors text-lg">
                {t.contact.phone}
              </a>
              <a href="mailto:tymbeixpol@gmail.com" className="text-gray-700 hover:text-[#4ECDC4] transition-colors text-lg">
                {t.contact.email}
              </a>
            </div>
            <div className="flex gap-6 justify-center mt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-[#4ECDC4] transition-colors"
              >
                {t.contact.github}
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-[#4ECDC4] transition-colors"
              >
                {t.contact.linkedin}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-gray-500 text-sm">{t.footer} {new Date().getFullYear()} Tymoteusz Tymendorf</p>
        </div>
      </footer>
    </main>
  );
}
