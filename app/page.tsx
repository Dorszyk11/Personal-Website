"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { translations, Language } from "./translations";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("HOME");
  const [contactForm, setContactForm] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "+48 ",
    company: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [language, setLanguage] = useState<Language>("en");

  const t = translations[language];

  // Załaduj zapisany język po zamontowaniu (unikamy błędu hydratacji – serwer i klient muszą się zgadzać przy pierwszym renderze)
  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null;
    if (saved === "pl" || saved === "en") setLanguage(saved);
  }, []);

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setContactStatus("error");
        return;
      }
      setContactStatus("success");
      setContactForm({ name: "", email: "", phone: "+48 ", company: "", message: "" });
    } catch {
      setContactStatus("error");
    }
  };

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
              width={96}
              height={96}
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
                <a href="tel:+48517647564" className="inline-flex items-center gap-2 hover:text-[#4ECDC4] transition-colors">
                  <svg className="w-5 h-5 shrink-0 text-gray-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" /></svg>
                  <span>{t.hero.phone}</span>
                </a>
                <a href="mailto:tymbeixpol@gmail.com" className="hover:text-[#4ECDC4] transition-colors">
                  {t.hero.email}
                </a>
              </div>
              <div className="flex gap-5 mt-5 flex-wrap items-center">
                <a
                  href="https://github.com/Dorszyk11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-[#4ECDC4] transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  <span>{t.hero.github}</span>
                </a>
                <span className="text-gray-300" aria-hidden>|</span>
                <a
                  href="https://www.linkedin.com/in/tymoteusz-tymendorf-2404ab27b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-[#4ECDC4] transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  <span>{t.hero.linkedin}</span>
                </a>
                <span className="text-gray-300" aria-hidden>|</span>
                <a
                  href="https://www.instagram.com/dorszyk11/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-[#4ECDC4] transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  <span>{t.hero.instagram}</span>
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
        <div className="container mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">{t.contact.title}</h2>
          <p className="text-[#4ECDC4] font-medium text-center mb-6">{t.contact.formHeading}</p>
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.name} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  </span>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder={t.contact.namePlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50/50 focus:ring-2 focus:ring-[#4ECDC4] focus:border-[#4ECDC4] outline-none transition text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.email} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                  </span>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder={t.contact.emailPlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50/50 focus:ring-2 focus:ring-[#4ECDC4] focus:border-[#4ECDC4] outline-none transition text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.phone} *
                </label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-gray-50/50 focus-within:ring-2 focus-within:ring-[#4ECDC4] focus-within:border-[#4ECDC4]">
                  <span className="flex items-center px-3 text-gray-500 border-r border-gray-300 bg-gray-100">
                    <span className="text-sm">🇵🇱</span>
                    <span className="ml-1 text-gray-600 font-medium">+48</span>
                  </span>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="123 456 789"
                    className="flex-1 min-w-0 px-4 py-3 outline-none text-gray-900 bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-company" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.company} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>
                  </span>
                  <input
                    id="contact-company"
                    type="text"
                    required
                    value={contactForm.company}
                    onChange={(e) => setContactForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder={t.contact.companyPlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50/50 focus:ring-2 focus:ring-[#4ECDC4] focus:border-[#4ECDC4] outline-none transition text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.message} *
                </label>
                <textarea
                  id="contact-message"
                  required
                  minLength={10}
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50/50 focus:ring-2 focus:ring-[#4ECDC4] focus:border-[#4ECDC4] outline-none transition resize-y text-gray-900"
                />
              </div>
              {contactStatus === "success" && (
                <p className="text-green-600 text-sm font-medium">{t.contact.success}</p>
              )}
              {contactStatus === "error" && (
                <p className="text-red-600 text-sm font-medium">{t.contact.error}</p>
              )}
              <button
                type="submit"
                disabled={contactStatus === "sending"}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#4ECDC4] hover:bg-[#45b8b0] text-white font-medium transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M3.478 2.404a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" /></svg>
                {contactStatus === "sending" ? t.contact.sending : t.contact.send}
              </button>
            </form>
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
