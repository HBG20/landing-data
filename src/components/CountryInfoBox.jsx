import ReactCountryFlag from "react-country-flag";
import CustomsMarketIcon from "../assets/customs market.svg";
import MixedMarketIcon from "../assets/Mixed market.svg";
import NationalRegistriesMarketIcon from "../assets/National Registries Market.svg";
import { useI18n } from "../i18n/I18nContext";
import { translations } from "../i18n/translations";

const marketIcon = {
  customs: CustomsMarketIcon,
  mixed: MixedMarketIcon,
  government_registries: NationalRegistriesMarketIcon,
};

const availabilityIcon = (availability) => {
  if (availability === "yes" || availability === "true") return "✔";
  if (availability === "no" || availability === "false") return "—";
  // Check if it's a percentage (contains %)
  if (typeof availability === "string" && availability.includes("%")) {
    return "%";
  }
  return "—";
};

const availabilityClass = (availability) => {
  if (availability === "yes" || availability === "true") return "available";
  if (availability === "no" || availability === "false") return "unavailable";
  return "partial";
};

const CountryInfoBox = ({ country, iso2Code, onClose }) => {
  const { t } = useI18n();
  
  if (!country) {
    return null;
  }

  const marketDisplayLabels = {
    customs: t("marketCustomsDisplay", translations),
    mixed: t("marketMixedDisplay", translations),
    government_registries: t("marketGovernmentRegistriesDisplay", translations),
  };

  return (
    <aside className="info-panel">
      <div className="info-panel__header">
        <div className="info-panel__flag">
          {iso2Code ? (
            <ReactCountryFlag svg countryCode={iso2Code} style={{ width: "2rem", height: "2rem" }} />
          ) : (
            <span className="flag-placeholder">🌐</span>
          )}
          <h3>{country.countryName}</h3>
        </div>
        <div className="info-panel__header-right">
          {country.marketType && (
            <span className="market-icon">
              <img src={marketIcon[country.marketType]} alt={country.marketType} style={{ width: "20px", height: "20px", display: "inline-block", verticalAlign: "middle" }} />
            </span>
          )}
          {onClose && (
            <button className="info-panel__close" onClick={onClose} aria-label={t("close", translations)}>
              ×
            </button>
          )}
        </div>
      </div>

      <div className="info-panel__separator"></div>

      <div className="info-panel__meta">
        {typeof country.numberOfImporters === "number" && (
          <div className="info-panel__meta-item">
            <span className="info-panel__meta-label">{t("totalImporters", translations)}</span>
            <span className="info-panel__meta-value">{country.numberOfImporters.toLocaleString()}</span>
          </div>
        )}
        <div className="info-panel__separator"></div>
        <div className="info-panel__meta-item">
          <span className="info-panel__meta-label">{t("dataSource", translations)}</span>
          <span className="info-panel__meta-value">{country.marketType ? marketDisplayLabels[country.marketType] || country.marketType : "—"}</span>
        </div>
      </div>

      <div className="info-panel__separator"></div>

      <h4 className="info-panel__subheading">{t("importerProfileInfo", translations)}</h4>
      <ul className="info-panel__list">
        {country.dataColumns.map(({ label, value, availability }, index) => (
          <li key={label} className={availabilityClass(availability)}>
            <div className="info-panel__list-content">
              <span className="label">{label}</span>
              <span className="status-icon">{availabilityIcon(availability)}</span>
            </div>
            {index < country.dataColumns.length - 1 && <div className="info-panel__separator"></div>}
          </li>
        ))}
      </ul>

      <div className="info-panel__separator"></div>

      <div className="info-panel__footer">
        <span>{country.marketCoverage || "100%"} {t("marketCaptured", translations)}</span>
      </div>
    </aside>
  );
};

export default CountryInfoBox;
