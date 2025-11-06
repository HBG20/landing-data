import { useMemo, useState, useEffect } from "react";
import MapChart from "./components/MapChart";
import CountryInfoBox from "./components/CountryInfoBox";
import countriesData from "./countriesData.json";
import ReactCountryFlag from "react-country-flag";
import countriesLib from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import esLocale from "i18n-iso-countries/langs/es.json";
import itLocale from "i18n-iso-countries/langs/it.json";
import LogoXNova from "./assets/logo-xnova.svg";
import LogoXNovaBlanco from "./assets/Logo xNova Blanco.svg";
import HeroIllustration from "./assets/landing-hero.svg";
import CustomsMarketIcon from "./assets/customs market.svg";
import MixedMarketIcon from "./assets/Mixed market.svg";
import NationalRegistriesMarketIcon from "./assets/National Registries Market.svg";
import IVACELogo from "./assets/IVACE.png";
import KitDigitalLogo from "./assets/Kit digital.webp";
import EnisaLogo from "./assets/Enisa.png";
import { useI18n } from "./i18n/I18nContext";
import { translations } from "./i18n/translations";
import "./App.css";

countriesLib.registerLocale(enLocale);
countriesLib.registerLocale(esLocale);
countriesLib.registerLocale(itLocale);

const marketIcon = {
  customs: CustomsMarketIcon,
  mixed: MixedMarketIcon,
  government_registries: NationalRegistriesMarketIcon,
};

const LocaleSelector = ({ locale, setLocale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  const locales = [
    { code: "en", name: "English", flag: "US" },
    { code: "es", name: "Español", flag: "ES" },
    { code: "it", name: "Italiano", flag: "IT" },
  ];

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  const handleSelect = (localeCode) => {
    setLocale(localeCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".locale-selector")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="locale-selector">
      <button
        type="button"
        className="locale-selector__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t("localeSelector", translations)}
        aria-expanded={isOpen}
      >
        <span className="locale-selector__flag">
          <ReactCountryFlag
            svg
            countryCode={currentLocale.flag}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </span>
        <span className="locale-selector__code">{currentLocale.code.toUpperCase()}</span>
        <svg
          className={`locale-selector__arrow ${isOpen ? "open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="locale-selector__dropdown">
          {locales.map((loc) => (
            <button
              key={loc.code}
              type="button"
              className={`locale-selector__option ${locale === loc.code ? "selected" : ""}`}
              onClick={() => handleSelect(loc.code)}
            >
              <span className="locale-selector__flag">
                <ReactCountryFlag
                  svg
                  countryCode={loc.flag}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </span>
              <span className="locale-selector__option-code">{loc.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const { locale, setLocale, t } = useI18n();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArcade, setShowArcade] = useState(false);
  const [marketTypeFilter, setMarketTypeFilter] = useState(null);

  // Register country locale based on current locale
  useEffect(() => {
    if (locale === "es") {
      countriesLib.registerLocale(esLocale);
    } else if (locale === "it") {
      countriesLib.registerLocale(itLocale);
    } else {
      countriesLib.registerLocale(enLocale);
    }
  }, [locale]);

  const marketCards = useMemo(() => [
    {
      key: "customs",
      title: t("marketCustoms", translations),
      description:
        locale === "es"
          ? "Ofrece total transparencia capturando el 100% de las transacciones comerciales de un país con la mayor granularidad."
          : locale === "it"
          ? "Offre piena trasparenza catturando il 100% delle transazioni commerciali di un paese con la massima granularità."
          : "Delivers full transparency by capturing 100% of a country's trade transactions with the highest granularity.",
      icon: CustomsMarketIcon,
    },
    {
      key: "mixed",
      title: t("marketMixed", translations),
      description:
        locale === "es"
          ? "Integración de todas las fuentes disponibles de comercio internacional: registros oficiales, datos espejo y registros de envíos."
          : locale === "it"
          ? "Integrazione di tutte le fonti disponibili di commercio internazionale: registri ufficiali, dati specchio e registri di spedizione."
          : "Integration of all available international trade sources: official registries, mirror data and shipping records.",
      icon: MixedMarketIcon,
    },
    {
      key: "government_registries",
      title: t("marketGovernmentRegistries", translations),
      description:
        locale === "es"
          ? "Obtenido de instituciones gubernamentales y proveedores líderes mundiales para ofrecer la visión más completa del importador."
          : locale === "it"
          ? "Provenienti da istituzioni governative e provider leader mondiali per offrire la visione più completa dell'importatore."
          : "Sourced from government institutions and world-leading providers to offer the most complete importer view.",
      icon: NationalRegistriesMarketIcon,
    },
  ], [locale, t]);

  const countriesWithData = useMemo(() => {
    return countriesData
      .filter((country) => country.dataColumns && country.dataColumns.length > 0)
      .sort((a, b) => a.countryName.localeCompare(b.countryName));
  }, []);

  const filteredCountries = useMemo(() => {
    let filtered = countriesWithData;
    
    // Filter by market type if selected
    if (marketTypeFilter) {
      filtered = filtered.filter((country) => country.marketType === marketTypeFilter);
    }
    
    // Filter by search term
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter((country) =>
        country.countryName.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [countriesWithData, searchTerm, marketTypeFilter]);

  const selectedIso2 = useMemo(() => {
    if (!selectedCountry) return null;
    return countriesLib.alpha3ToAlpha2(selectedCountry.countryCode) || null;
  }, [selectedCountry]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Clear market type filter when user searches
    if (marketTypeFilter) {
      setMarketTypeFilter(null);
    }
  };

  // Clear selected country if it doesn't match the current filter
  useEffect(() => {
    if (selectedCountry && marketTypeFilter && selectedCountry.marketType !== marketTypeFilter) {
      setSelectedCountry(null);
    }
  }, [marketTypeFilter, selectedCountry]);

  const openArcade = () => setShowArcade(true);
  const closeArcade = () => setShowArcade(false);

  return (
    <div className="page">
      <header className="top-nav">
        <a
          href="https://www.xnovainternational.com/"
          className="nav-logo"
          aria-label="xNova"
        >
          <img src={LogoXNova} alt="xNova Platform" />
        </a>
        <LocaleSelector locale={locale} setLocale={setLocale} />
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>{t("heroTitle", translations)}</h1>
            <p dangerouslySetInnerHTML={{ __html: t("heroDescription", translations) }} />
            <div className="hero-cta">
              <a className="btn btn-primary" href="https://www.xnovainternational.com/es/demo">
                {t("heroCtaPrimary", translations)}
              </a>
              <button className="btn btn-outline" type="button" onClick={openArcade}>
                {t("heroCtaSecondary", translations)}
              </button>
            </div>
          </div>
          <img className="hero-image" src={HeroIllustration} alt="Screens preview of xNova platform" />
        </section>

        <section className="map-section">
          <div className="map-section__header">
            <h2>{t("mapSectionTitle", translations)}</h2>
            <p>
              {t("mapSectionDescription", translations)}
            </p>
          </div>
          <div className="map-content">
            <div className="map-area">
              <MapChart
                selectedCountryCode={selectedCountry?.countryCode}
                onCountrySelect={handleCountrySelect}
                marketTypeFilter={marketTypeFilter}
                onMarketTypeFilterChange={setMarketTypeFilter}
              />
            </div>

            <div className="map-side-panel">
              <div className="panel-search">
                <label htmlFor="country-search">{t("filterByName", translations)}</label>
                <input
                  id="country-search"
                  type="search"
                  placeholder={t("searchPlaceholder", translations)}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (selectedCountry) {
                      setSelectedCountry(null);
                    }
                  }}
                />
              </div>
              {selectedCountry ? (
                <CountryInfoBox 
                  country={selectedCountry} 
                  iso2Code={selectedIso2} 
                  onClose={() => setSelectedCountry(null)}
                />
              ) : (
                <div className="panel-list">
                  {filteredCountries.map((country) => {
                    const iso2 = countriesLib.alpha3ToAlpha2(country.countryCode) || undefined;
                    return (
                      <button
                        key={country.countryCode}
                        type="button"
                        className={`country-pill ${selectedCountry?.countryCode === country.countryCode ? "active" : ""}`}
                        onClick={() => handleCountrySelect(country)}
                      >
                        <span className="pill-flag">
                          {iso2 ? (
                            <ReactCountryFlag
                              svg
                              countryCode={iso2}
                              aria-label={country.countryName}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <span className="flag-placeholder">🌐</span>
                          )}
                        </span>
                        <span className="country-name">{country.countryName}</span>
                        <span className="market-type">
                          {country.marketType === "customs"
                            ? t("marketCustomsDisplay", translations)
                            : country.marketType === "mixed"
                            ? t("marketMixedDisplay", translations)
                            : country.marketType === "government_registries"
                            ? t("marketGovernmentRegistriesDisplay", translations)
                            : country.marketType.replace(/_/g, " ")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="summary">
          <div className="summary-header">
            <h2>{t("summaryTitle", translations)}</h2>
            <p>
              {t("summaryDescription", translations)}
            </p>
          </div>
          <div className="market-cards">
            {marketCards.map((card) => (
              <article key={card.key}>
                <span className="market-icon">
                  <img src={card.icon} alt={card.title} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

      </main>

      {showArcade && (
        <div className="arcade-modal-backdrop" role="dialog" aria-modal="true">
          <div className="arcade-modal">
            <button className="arcade-modal__close" type="button" onClick={closeArcade} aria-label="Close demo">
              ×
            </button>
            <div style={{ position: 'relative', paddingBottom: 'calc(54.02777777777777% + 41px)', height: '0', width: '100%' }}>
              <iframe
                src="https://demo.arcade.software/g63WbUIVM2gJObiCSX8o?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
                title="Find and Analyze Importers for a Product in Mexico"
                frameBorder="0"
                loading="lazy"
                allowFullScreen
                allow="clipboard-write"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
              />
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="https://www.xnovainternational.com/" className="footer-logo-link">
              <img src={LogoXNovaBlanco} alt="xNova International" className="footer-logo-img" />
            </a>
            <p>{t("footerTagline", translations)}</p>
            <div className="footer-actions">
              <a href="https://xnovainternational.eu.auth0.com/login?state=hKFo2SBkSG4wc2JSQmJkLVctZFNPbnZialB0bkNKR3lnLW5TTqFupWxvZ2luo3RpZNkgYWxoMXFjQ3FlQnYyREU1RE15RmJ2UlQtRV81aGpORUejY2lk2SBERXFLTmJkM2kyeVlDeEoxRHRWR08yM1F5TEJ5cDV3NQ&client=DEqKNbd3i2yYCxJ1DtVGO23QyLByp5w5&protocol=oauth2&scope=openid%20profile%20email&response_type=code&redirect_uri=https%3A%2F%2Fapp.xnovainternational.com%2Fapi%2Fauth%2Fcallback&audience=https%3A%2F%2Fapp.xnovainternational.com%2Fapi&nonce=1Vy3dLQYemC9MHC9llxscX2qutSxBopPlWR2GjXv4qg&code_challenge_method=S256&code_challenge=gypzw9C7arnCv2gGnFffmGlpI4lY4ngGUMsLuNoRBAM" className="footer-btn-primary">{t("footerLogIn", translations)}</a>
              <a href="https://www.xnovainternational.com/demo" className="footer-btn-secondary">{t("footerBookDemo", translations)}</a>
            </div>
            <div className="footer-social">
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg className="social-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg className="social-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="footer__columns">
            <div>
              <h4>{t("footerProduct", translations)}</h4>
              <ul>
                <li><a href="https://www.xnovainternational.com/product-importers-finder">{t("footerImporterFinder", translations)}</a></li>
                <li><a href="https://www.xnovainternational.com/competitors-exporting-data">{t("footerExporterFinder", translations)}</a></li>
                <li><a href="https://www.xnovainternational.com/importers-contact-data">{t("footerContacts", translations)}</a></li>
              </ul>
            </div>
            <div>
              <h4>{t("footerData", translations)}</h4>
              <ul>
                <li><a href="https://www.xnovainternational.com/import-export-data-america">USA</a></li>
                <li><a href="https://www.xnovainternational.com/data-latam">LATAM</a></li>
                <li><a href="https://www.xnovainternational.com/import-export-data-mexico">Mexico</a></li>
                <li><a href="https://www.xnovainternational.com/import-export-data-china">China</a></li>
                <li><a href="https://www.xnovainternational.com/import-export-data-europe">Europe</a></li>
              </ul>
            </div>
            <div>
              <h4>{t("footerCompany", translations)}</h4>
              <ul>
                <li><a href="https://www.xnovainternational.com/about-us">{t("footerAboutUs", translations)}</a></li>
                <li><a href="https://www.xnovainternational.com/contact">{t("footerContactUs", translations)}</a></li>
                <li><a href="https://www.xnovainternational.com/success-stories">{t("footerSuccessStories", translations)}</a></li>
                <li><a href="https://www.xnovainternational.com/pricing">{t("footerPricing", translations)}</a></li>
              </ul>
            </div>
            <div>
              <h4>{t("footerOtherSolutions", translations)}</h4>
              <ul>
                <li><a href="https://www.xnovainternational.com/associations-export-xnova">{t("footerAssociations", translations)}</a></li>
                <li><a href="https://www.xnovainternational.com/commercial-agents-xnova">{t("footerCommercialAgents", translations)}</a></li>
                <li><a href="https://www.xnovainternational.com/chamber-commerce-importers-data">{t("footerChambersOfCommerce", translations)}</a></li>
                <li><a href="https://www.xnovainternational.com/increase-sales-trade-show">{t("footerTradeFairs", translations)}</a></li>
                <li><a href="https://www.xnovainternational.com/increase-sales-subsidiaries">{t("footerSubsidiaries", translations)}</a></li>
                <li><a href="https://www.xnovainternational.com/list-of-importers">{t("footerListOfImporters", translations)}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__partners">
            <img src={IVACELogo} alt="IVACE - Instituto Valenciano de Competitividad Empresarial" className="footer-partner-logo" />
            <img src={KitDigitalLogo} alt="Kit Digital" className="footer-partner-logo" />
            <img src={EnisaLogo} alt="ENISA - Ministerio de Industria, Comercio y Turismo" className="footer-partner-logo" />
          </div>
          <p className="footer__address">Edificio Lanzadera, La Marina de, Carrer del Moll de la Duana, s/n, 46024 Valencia</p>
          <div className="footer__legal">
            <a href="https://www.xnovainternational.com/es/privacy-policy-xnova">{t("footerPrivacyPolicy", translations)}</a>
            <a href="https://www.xnovainternational.com/es/legal-xnova">{t("footerTermsConditions", translations)}</a>
            <a href="https://www.xnovainternational.com/es/legal-notice-xnova">{t("footerLegalNotice", translations)}</a>
            <a href="https://www.xnovainternational.com/es/cookie-policy-xnova">{t("footerCookiePolicy", translations)}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

