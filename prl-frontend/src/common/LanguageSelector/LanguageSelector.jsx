import React, { useState, useRef, useEffect } from "react";
import englishFlagSvg from "country-flag-icons/string/3x2/US";

const englishFlagUrl = `data:image/svg+xml,${encodeURIComponent(englishFlagSvg)}`;
const EnglishFlag = ({ className }) => (
  <img src={englishFlagUrl} alt="" className={className} />
);
const english = { code: "US", name: "English", Flag: EnglishFlag, langCode: "en" };

let languageOptionsRequest;
const loadLanguageOptions = () => {
  languageOptionsRequest ??= import("./languageOptions")
    .then(({ default: options }) => [english, ...options])
    .catch((error) => {
      languageOptionsRequest = undefined;
      throw error;
    });
  return languageOptionsRequest;
};

const LanguageSelector = () => {
  const [selected, setSelected] = useState(english);
  const [countries, setCountries] = useState([english]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const prepareOptions = () => {
    loadLanguageOptions().then(setCountries).catch(() => {});
  };

  // ✅ Load Google Translate script
  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      };
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Change Language
  const changeLanguage = (country) => {
    setSelected(country);
    setOpen(false);

    const tryChange = () => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = country.langCode;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
      return false;
    };

    // Retry until Google Translate dropdown loads
    if (!tryChange()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (tryChange() || attempts > 20) clearInterval(interval);
      }, 500);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Hidden Google Translate */}
      <div id="google_translate_element" className="hidden"></div>

      {/* Main Button */}
      <button
        onFocus={prepareOptions}
        onPointerEnter={prepareOptions}
        onClick={() => {
          if (!open) prepareOptions();
          setOpen(!open);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md shadow"
      >
        <selected.Flag className="w-6 h-4" />
        <span>{selected.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 max-h-64 overflow-y-auto w-56 bg-white border rounded-md shadow-lg z-50">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => changeLanguage(country)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
            >
              <country.Flag className="w-6 h-4" />
              {country.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
