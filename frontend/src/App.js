import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    phone: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [userPosition, setUserPosition] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const phoneInputRef = useRef(null);
  const itiRef = useRef(null);

  // Translation object
  const translations = {
    fr: {
      mainTitle: "Atteignez vos objectifs ensemble, en toute confiance.",
      subtitle: "Tonty est la nouvelle application gratuite pour gérer vos cotisations et projets de groupe de manière simple et sécurisée. Dites adieu aux carnets, aux oublis et aux discussions sans fin pour savoir qui a payé.",
      phonePlaceholder: "Numéro de téléphone",
      emailPlaceholder: "E-mail (optionnel)",
      ctaButton: "Je veux un accès prioritaire !",
      noSpam: "Sans spam, promis. Nous vous contacterons uniquement pour le lancement.",
      onWaitlistTitle: "Vous êtes sur la liste ! Votre position :",
      totalUsersText: "Sur",
      totalUsersText2: "personnes déjà inscrites.",
      moveUpTitle: "Accédez à Tonty parmi les premiers ! 🚀",
      moveUpText: "Pour remonter dans la file, partagez votre lien unique. Chaque ami qui s'inscrit vous fait gagner des places !",
      yourReferralLink: "Votre lien de parrainage :",
      copyReferralLink: "Copier mon lien",
      shareWhatsApp: "Partager sur WhatsApp",
      shareFacebook: "Partager sur Facebook",
      linkCopied: "Lien copié !",
      shareOtherPlatforms: "Idéal pour partager sur Instagram, TikTok ou par SMS !",
      benefit1Title: "Participez en toute sécurité",
      benefit1Text: "Chaque contribution est enregistrée et visible de tous. Concentrez-vous sur vos projets en protégeant votre argent et votre réputation.",
      benefit2Title: "Organisez sans effort",
      benefit2Text: "Fini la charge mentale. Les rappels sont automatiques et le suivi des paiements est centralisé. Vous gagnez du temps pour ce qui compte vraiment.",
      benefit3Title: "Réalisez tous vos projets",
      benefit3Text: "Mariage, études, business... Donnez vie à vos projets, qu'ils soient petits ou grands, grâce à la force de votre communauté.",
      testimonialsTitle: "Ce qu'elles attendent de Tonty...",
      testimonial1: "« Enfin une solution moderne pour gérer notre groupe sans stress. J'attends ça depuis des années ! »",
      testimonial1Author: "— Aïssatou, organisatrice de communauté à Dakar.",
      testimonial2: "« Pouvoir contribuer aux projets de la famille depuis Paris avec une preuve claire, ça va tout changer pour moi. »",
      testimonial2Author: "— Fatou, membre de la diaspora à Paris.",
      copyright: "© 2025 Tonty.",
      footerText: "Construit avec ❤️ pour nos communautés. Découvrez notre",
      mission: "mission",
      missionTitle: "Notre Mission",
      missionText1: "Nous sommes Chérif Coulibaly et Yann-habib Koné. En grandissant au sein de nos communautés, nous avons vu la puissance de l'entraide et de la confiance pour réaliser de grandes choses. Mais nous avons aussi vu la charge mentale et les risques qui pèsent sur ceux qui organisent cette solidarité.",
      missionText2: "Nous avons créé Tonty pour une raison simple : donner à nos communautés l'outil moderne et sécurisé qu'elles méritent. Notre mission est de transformer chaque cercle d'épargne et chaque projet de groupe en une preuve de confiance, pour débloquer le potentiel économique et social de tout un continent.",
      foundersSignature: "— Chérif Coulibaly & Yann-habib Koné, Fondateurs de Tonty",
      linkedinCherif: "Profil LinkedIn de Chérif",
      linkedinYann: "Profil LinkedIn de Yann-habib",
      errorMessage: "Veuillez saisir un numéro de téléphone valide",
      whatsappShareText: "🚀 Découvrez Tonty, la nouvelle app pour gérer vos cotisations de groupe en toute sécurité ! Rejoignez-moi pour un accès prioritaire : "
    },
    en: {
      mainTitle: "Achieve your goals together, with confidence.",
      subtitle: "Tonty is the new free application to manage your group contributions and projects in a simple and secure way. Say goodbye to notebooks, forgotten payments, and endless discussions about who has paid.",
      phonePlaceholder: "Phone number",
      emailPlaceholder: "Email (optional)",
      ctaButton: "I want priority access!",
      noSpam: "No spam, we promise. We'll only contact you for the launch.",
      onWaitlistTitle: "You're on the list! Your position:",
      totalUsersText: "Out of",
      totalUsersText2: "people already registered.",
      moveUpTitle: "Get early access to Tonty! 🚀",
      moveUpText: "To move up in the queue, share your unique link. Each friend who signs up helps you gain positions!",
      yourReferralLink: "Your referral link:",
      copyReferralLink: "Copy my link",
      shareWhatsApp: "Share on WhatsApp",
      shareFacebook: "Share on Facebook",
      linkCopied: "Link copied!",
      shareOtherPlatforms: "Perfect for sharing on Instagram, TikTok or via SMS!",
      benefit1Title: "Participate with complete security",
      benefit1Text: "Every contribution is recorded and visible to all. Focus on your projects while protecting your money and reputation.",
      benefit2Title: "Organize effortlessly",
      benefit2Text: "No more mental burden. Reminders are automatic and payment tracking is centralized. You save time for what really matters.",
      benefit3Title: "Achieve all your projects",
      benefit3Text: "Wedding, studies, business... Bring your projects to life, whether small or large, thanks to the strength of your community.",
      testimonialsTitle: "What they expect from Tonty...",
      testimonial1: "« Finally a modern solution to manage our group without stress. I've been waiting for this for years! »",
      testimonial1Author: "— Aïssatou, community organizer in Dakar.",
      testimonial2: "« Being able to contribute to family projects from Paris with clear proof, that's going to change everything for me. »",
      testimonial2Author: "— Fatou, diaspora member in Paris.",
      copyright: "© 2025 Tonty.",
      footerText: "Built with ❤️ for our communities. Discover our",
      mission: "mission",
      missionTitle: "Our Mission",
      missionText1: "We are Chérif Coulibaly and Yann-habib Koné. Growing up within our communities, we have seen the power of mutual aid and trust to achieve great things. But we have also seen the mental burden and risks that weigh on those who organize this solidarity.",
      missionText2: "We created Tonty for a simple reason: to give our communities the modern and secure tool they deserve. Our mission is to transform every savings circle and every group project into proof of trust, to unlock the economic and social potential of an entire continent.",
      foundersSignature: "— Chérif Coulibaly & Yann-habib Koné, Founders of Tonty",
      linkedinCherif: "Chérif's LinkedIn Profile",
      linkedinYann: "Yann-habib's LinkedIn Profile",
      errorMessage: "Please enter a valid phone number",
      whatsappShareText: "🚀 Discover Tonty, the new app to securely manage your group contributions! Join me for priority access: "
    }
  };

  // Auto-detect language based on browser settings and geolocation
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // Check browser language first
        const browserLang = navigator.language || navigator.languages[0];
        const isEnglish = browserLang.startsWith('en');
        
        // Try to get country info from IP (using a free service)
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          // English-speaking countries
          const englishCountries = ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'ZA'];
          const isEnglishCountry = englishCountries.includes(data.country_code);
          
          // Set language based on country or browser language
          if (isEnglish || isEnglishCountry) {
            setLanguage('en');
          }
        } catch (error) {
          // If IP detection fails, fallback to browser language only
          if (isEnglish) {
            setLanguage('en');
          }
        }
      } catch (error) {
        console.log('Language detection failed, using default French');
      }
    };

    detectLanguage();
  }, []);

  // Initialize phone input
  useEffect(() => {
    if (phoneInputRef.current && window.intlTelInput && !itiRef.current) {
      itiRef.current = window.intlTelInput(phoneInputRef.current, {
        initialCountry: 'ci', // Default to Côte d'Ivoire
        preferredCountries: ['ci', 'sn', 'bf', 'fr', 'us', 'ca', 'gb'],
        separateDialCode: true,
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.19/build/js/utils.js"
      });

      // Handle country change
      phoneInputRef.current.addEventListener("countrychange", function() {
        setError(''); // Clear any existing errors when country changes
      });
    }

    return () => {
      if (itiRef.current) {
        itiRef.current.destroy();
        itiRef.current = null;
      }
    };
  }, []);

  const t = translations[language];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateUserPosition = () => {
    const baseNumber = 2518;
    const now = new Date();
    // Calcule les secondes depuis minuit
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const secondsSinceMidnight = Math.floor((now - startOfDay) / 1000);
    // Divise par un facteur pour ne pas augmenter trop vite (ex: 10)
    const position = baseNumber + Math.floor(secondsSinceMidnight / 10);
    return position;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number using intl-tel-input
    if (itiRef.current && !itiRef.current.isValidNumber()) {
      setError(t.errorMessage);
      return;
    }

    // Get the full international number
    const fullPhoneNumber = itiRef.current ? itiRef.current.getNumber() : formData.phone;
    const countryData = itiRef.current ? itiRef.current.getSelectedCountryData() : {};
    const countryCode = countryData.dialCode || '';
    
    try {
      // Send data to backend
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await axios.post(`${backendUrl}/api/waitlist`, {
        phone: formData.phone,
        email: formData.email,
        full_phone_number: fullPhoneNumber,
        country_code: countryCode
      });

      // Use the response data from server
      const { position, referral_code } = response.data;
      setUserPosition(position);
      setReferralCode(referral_code);
      
      // Simulate form submission
      setIsSubmitted(true);
      
      console.log('Waitlist entry created successfully:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const getReferralUrl = () => {
    return `https://tonty.app/?ref=${referralCode}`;
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      t.whatsappShareText + getReferralUrl()
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(getReferralUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      'facebook-share-dialog',
      'width=626,height=436'
    );
  };

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(getReferralUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getReferralUrl();
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const openMissionModal = () => {
    setShowMissionModal(true);
  };

  const closeMissionModal = () => {
    setShowMissionModal(false);
  };

  // Toggle language manually
  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMissionModal();
      }
    };

    if (showMissionModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showMissionModal]);

  const LockIcon = () => (
    <svg className="w-12 h-12 text-indigo-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const ListIcon = () => (
    <svg className="w-12 h-12 text-indigo-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );

  const GiftIcon = () => (
    <svg className="w-12 h-12 text-indigo-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );

  const LinkedInIcon = () => (
    <svg className="w-4 h-4 inline ml-1" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-off-white">
      {/* Language Toggle Button */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={toggleLanguage}
          className="bg-white shadow-lg rounded-full px-3 py-2 text-sm font-medium text-violet-primary hover:bg-violet-50 transition-all duration-200"
        >
          {language === 'fr' ? '🇺🇸 EN' : '🇫🇷 FR'}
        </button>
      </div>

      {/* Section 1: L'Accroche Principale */}
      <section className="pt-12 pb-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-primary mb-6 font-poppins">
            {t.mainTitle}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-slate max-w-2xl mx-auto mb-8 font-poppins leading-relaxed">
            {t.subtitle}
          </p>

          {/* CTA Principal */}
          {!isSubmitted ? (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    name="phone"
                    placeholder={t.phonePlaceholder}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-primary transition-all duration-200 ${
                      error ? 'border-red-500' : 'border-gray-300 focus:border-violet-primary'
                    }`}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-2 text-left">{error}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder={t.emailPlaceholder}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-primary focus:border-violet-primary transition-all duration-200"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-violet-primary hover:bg-violet-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  {t.ctaButton}
                </button>
              </form>
              
              <p className="text-sm text-gray-400 mt-3">
                {t.noSpam}
              </p>
            </div>
          ) : (
            <div id="confirmation-block" className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg animate-fade-in text-center">
              {/* Icône de succès */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Titre Principal */}
              <h2 className="text-2xl font-bold text-green-success mb-6">
                {language === 'fr' ? 'Vous êtes sur la liste !' : 'You\'re on the list!'}
              </h2>

              {/* Bloc de Position */}
              <div id="position-display" className="my-8">
                <p className="text-lg text-gray-slate mb-2">
                  {language === 'fr' ? 'Votre position dans la liste d\'attente' : 'Your position on the waitlist'}
                </p>
                <span id="user-position" className="text-6xl font-bold text-violet-primary block mt-2">
                  #{userPosition?.toLocaleString('fr-FR')}
                </span>
              </div>

              {/* Appel à l'Action Viral */}
              <div id="referral-action-block" className="bg-off-white p-6 rounded-xl mt-6">
                <h3 className="text-lg font-bold text-violet-primary mb-3">
                  {language === 'fr' ? 'Remontez dans le classement ! 🚀' : 'Move up in the ranking! 🚀'}
                </h3>
                <p className="text-gray-slate text-sm mb-6">
                  {language === 'fr' 
                    ? 'Partagez votre lien unique. Chaque ami qui s\'inscrit améliore votre position et vous donne un accès plus rapide à Tonty.'
                    : 'Share your unique link. Each friend who signs up improves your position and gives you faster access to Tonty.'
                  }
                </p>
                
                {/* Bloc de Partage */}
                <div className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={getReferralUrl()}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg bg-gray-50"
                    />
                    <button
                      id="copy-button"
                      onClick={handleCopyReferralLink}
                      className="px-4 py-2 bg-violet-primary text-white text-sm font-medium rounded-r-lg hover:bg-violet-700 transition-colors duration-200"
                    >
                      {copySuccess ? (language === 'fr' ? 'Copié ! ✅' : 'Copied! ✅') : (language === 'fr' ? 'Copier mon lien' : 'Copy my link')}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    <em>{language === 'fr' ? 'Idéal pour partager sur Instagram, TikTok ou par e-mail.' : 'Perfect for sharing on Instagram, TikTok or via email.'}</em>
                  </p>
                </div>

                {/* Boutons de partage social */}
                <div className="flex gap-3">
                  <button
                    id="whatsapp-share"
                    onClick={handleWhatsAppShare}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    {language === 'fr' ? 'WhatsApp' : 'WhatsApp'}
                  </button>
                  
                  <button
                    id="facebook-share"
                    onClick={handleFacebookShare}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    {language === 'fr' ? 'Facebook' : 'Facebook'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Le Visuel Émotionnel */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1747330666333-f9e2d1f8e6c6"
              alt={language === 'fr' ? "Femmes africaines célébrant leur réussite" : "African women celebrating their success"}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Section 3: Les Bénéfices Clés */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Bénéfice 1 */}
            <div className="text-center">
              <LockIcon />
              <h3 className="text-xl font-bold text-gray-slate mb-4 font-poppins">
                {t.benefit1Title}
              </h3>
              <p className="text-gray-slate leading-relaxed">
                {t.benefit1Text}
              </p>
            </div>

            {/* Bénéfice 2 */}
            <div className="text-center">
              <ListIcon />
              <h3 className="text-xl font-bold text-gray-slate mb-4 font-poppins">
                {t.benefit2Title}
              </h3>
              <p className="text-gray-slate leading-relaxed">
                {t.benefit2Text}
              </p>
            </div>

            {/* Bénéfice 3 */}
            <div className="text-center">
              <GiftIcon />
              <h3 className="text-xl font-bold text-gray-slate mb-4 font-poppins">
                {t.benefit3Title}
              </h3>
              <p className="text-gray-slate leading-relaxed">
                {t.benefit3Text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: La Preuve Sociale Embryonnaire */}
      <section className="py-12 px-4 bg-off-white">
        <div className="max-w-4xl mx-auto">
          <h4 className="text-lg text-gray-slate text-center mb-8 font-poppins">
            {t.testimonialsTitle}
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Témoignage 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-slate italic mb-4 leading-relaxed">
                {t.testimonial1}
              </p>
              <p className="text-sm text-gray-400 font-poppins">
                {t.testimonial1Author}
              </p>
            </div>

            {/* Témoignage 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-slate italic mb-4 leading-relaxed">
                {t.testimonial2}
              </p>
              <p className="text-sm text-gray-400 font-poppins">
                {t.testimonial2Author}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Footer */}
      <footer className="py-8 px-4 bg-off-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-400 mb-2">
            {t.copyright}
          </p>
          <p className="text-sm text-gray-400">
            {t.footerText}{' '}
            <button 
              onClick={openMissionModal}
              className="text-violet-primary hover:text-violet-700 transition-colors duration-200 underline cursor-pointer bg-transparent border-none p-0 font-inherit"
            >
              {t.mission}
            </button>.
          </p>
        </div>
      </footer>

      {/* Modale Notre Mission */}
      {showMissionModal && (
        <div 
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeMissionModal}
        >
          <div 
            className="modal-content bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton de fermeture */}
            <button
              onClick={closeMissionModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Photo des fondateurs */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl w-32 h-32 mx-auto flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-violet-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-violet-primary mb-6 font-poppins">
                {t.missionTitle}
              </h3>
            </div>

            {/* Contenu de la mission */}
            <div className="text-gray-slate leading-relaxed mb-6">
              <p className="mb-4">
                {t.missionText1}
              </p>
              <p>
                {t.missionText2}
              </p>
            </div>

            {/* Signature et liens */}
            <div className="text-center">
              <p className="text-gray-slate italic mb-4">
                {t.foundersSignature}
              </p>
              <div className="founder-links space-x-6">
                <a 
                  href="https://linkedin.com/in/cherif-coulibaly" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-violet-primary hover:text-violet-700 transition-colors duration-200 text-sm inline-flex items-center"
                >
                  {t.linkedinCherif}
                  <LinkedInIcon />
                </a>
                <a 
                  href="https://linkedin.com/in/yann-habib-kone" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-violet-primary hover:text-violet-700 transition-colors duration-200 text-sm inline-flex items-center"
                >
                  {t.linkedinYann}
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;