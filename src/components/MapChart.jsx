import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import countriesData from "../countriesData.json";
import worldSvgMarkup from "../assets/world (4).svg?raw";
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

// Mapping of SVG class/name variations to normalized country names
// These map FROM SVG variations TO the normalized names used in countriesData.json
const countryNameAliases = {
  "russianfederation": "russianfederation", // JSON has "Russian Federation"
  "russian federation": "russianfederation",
  "russia": "russianfederation", // Alias "Russia" to "Russian Federation"
  "unitedkingdom": "greatbritain", // JSON has "Great Britain"
  "uk": "greatbritain",
  "greatbritain": "greatbritain",
  "unitedstates": "unitedstates", // JSON has "United States"
  "united states": "unitedstates",
  "usa": "unitedstates",
  "us": "unitedstates",
};

// Special ISO2 code mappings for regions that should use another country's data
// Western Sahara (EH) should use Morocco's data (MA)
const iso2Aliases = {
  "EH": "MA", // Western Sahara -> Morocco
};

const normalizeName = (name) => {
  if (!name) return "";
  
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
  
  // Check if we have an alias for this normalized name
  return countryNameAliases[normalized] || normalized;
};

// Helper function to get market-specific colors
const getMarketColors = (marketType) => {
  switch (marketType) {
    case "mixed":
      return {
        inactive: { fill: "#d2dbe8", stroke: "#ffffff" },
        hover: { fill: "#466b99", stroke: "#ffffff", filter: "drop-shadow(0 2px 4px rgba(70, 107, 153, 0.3))" },
        active: { fill: "#466b99", stroke: "#ffffff", filter: "drop-shadow(0 2px 4px rgba(70, 107, 153, 0.4))" }
      };
    case "government_registries":
      return {
        inactive: { fill: "#e0e4ea", stroke: "#ffffff" },
        hover: { fill: "#546c7d", stroke: "#ffffff", filter: "drop-shadow(0 2px 4px rgba(84, 108, 125, 0.3))" },
        active: { fill: "#546c7d", stroke: "#ffffff", filter: "drop-shadow(0 2px 4px rgba(84, 108, 125, 0.4))" }
      };
    case "customs":
    default:
      return {
        inactive: { fill: "#d9e4f5", stroke: "#ffffff" },
        hover: { fill: "#007aff", stroke: "#ffffff", filter: "drop-shadow(0 2px 4px rgba(0, 122, 255, 0.3))" },
        active: { fill: "#007aff", stroke: "#ffffff", filter: "drop-shadow(0 2px 4px rgba(0, 122, 255, 0.4))" }
      };
  }
};

const MapChart = ({ selectedCountryCode, onCountrySelect, marketTypeFilter, onMarketTypeFilterChange }) => {
  const { t } = useI18n();
  const [tooltip, setTooltip] = useState(null);
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  const svgContainerRef = useRef(null);
  const pathsByIso3Ref = useRef(new Map());
  const hoveredPathRef = useRef(null);
  const svgInsertedRef = useRef(false);
  const legendRef = useRef(null);

  const lookups = useMemo(() => {
    return countriesData.reduce(
      (acc, country) => {
        if (!country?.countryCode) {
          return acc;
        }

        const iso3 = country.countryCode.toUpperCase();
        const iso2 = (country.iso2Code || country.id)?.toUpperCase();
        const normalizedName = normalizeName(country.countryName);

        acc.byIso3[iso3] = country;

        if (iso2) {
          acc.byIso2[iso2] = country;
        }

        if (normalizedName && !acc.byName[normalizedName]) {
          acc.byName[normalizedName] = country;
        }

        return acc;
      },
      { byIso2: {}, byIso3: {}, byName: {} }
    );
  }, []);

      const clearHoverState = useCallback(() => {
        hoveredPathRef.current = null;
        const pathsByIso3 = pathsByIso3Ref.current;
        pathsByIso3.forEach((paths) => {
          paths.forEach((path) => {
            // Remove hovered class using setAttribute to ensure consistency
            const currentClasses = (path.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
            const classesWithoutHovered = currentClasses.filter(cls => cls !== "hovered");
            if (classesWithoutHovered.length !== currentClasses.length) {
              path.setAttribute("class", classesWithoutHovered.join(" "));
            }
            // Remove inline styles that might override CSS (use removeProperty for !important styles)
            path.style.removeProperty("fill");
            path.style.removeProperty("stroke");
            path.style.removeProperty("filter");
          });
        });
      }, []);

  const updateTooltipFromPath = useCallback((path, evt) => {
    if (!path) return;

    const iso3 = path.dataset.countryCode;
    const data = iso3 ? lookups.byIso3[iso3] : null;
    const name = data?.countryName || path.dataset.countryName || "";

    // Use viewport coordinates for fixed positioning
    const x = evt.clientX;
    const y = evt.clientY;

    setTooltip({
      name,
      market: data?.marketType || null,
      x,
      y,
      hasData: Boolean(data),
    });
  }, [lookups]);

  const handleMouseLeave = () => {
    setTooltip(null);
    clearHoverState();
  };

  // Insert SVG only once when component mounts
  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container || svgInsertedRef.current) return;
    
    // Insert SVG content only once
    container.innerHTML = worldSvgMarkup;
    svgInsertedRef.current = true;
  }, []);

  // Set up event listeners after SVG is inserted
  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container || !svgInsertedRef.current) return;

    // Store listeners for cleanup
    let storedListeners = [];

    // Wait for SVG to be inserted into DOM
    const setupSVG = () => {
      const svgElement = container.querySelector("svg");
      if (!svgElement) {
        // If SVG not ready yet, retry after a short delay
        setTimeout(setupSVG, 50);
        return;
      }
      
      // Skip if already set up (check for existing listeners)
      if (svgElement.dataset.listenersAttached === "true") {
        console.log(`[MapChart] Event listeners already attached, skipping...`);
        // But still clean up any conflicting classes that might exist
        const pathElements = Array.from(svgElement.querySelectorAll("path"));
        pathElements.forEach((path) => {
          // Check if path has both classes (the bug we're fixing)
          const hasBothClasses = path.classList.contains("has-data") && path.classList.contains("no-data");
          if (hasBothClasses) {
            console.warn(`[MapChart] Found path with both classes! Cleaning up...`);
            // Determine which class should be kept based on countryCode
            const iso3 = path.dataset.countryCode;
            if (iso3) {
              path.classList.remove("no-data");
              console.log(`[MapChart] Removed "no-data" from path with countryCode: ${iso3}`);
            } else {
              path.classList.remove("has-data");
              console.log(`[MapChart] Removed "has-data" from path without countryCode`);
            }
          }
        });
        return;
      }
      
      svgElement.dataset.listenersAttached = "true";

      // Ensure responsive scaling - remove fixed dimensions and ensure viewBox is set
      const existingViewBox = svgElement.getAttribute("viewBox") || svgElement.getAttribute("viewbox");
      const width = svgElement.getAttribute("width");
      const height = svgElement.getAttribute("height");
      
      // If no viewBox exists, create one from width/height if available
      if (!existingViewBox && width && height) {
        svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
      } else if (!existingViewBox) {
        // Fallback viewBox
        svgElement.setAttribute("viewBox", "0 0 1009.6727 665.96301");
      } else {
        svgElement.setAttribute("viewBox", existingViewBox);
      }
      
      // Remove fixed dimensions to allow responsive scaling
      svgElement.removeAttribute("viewbox");
      svgElement.removeAttribute("width");
      svgElement.removeAttribute("height");
      svgElement.setAttribute("role", "img");
      svgElement.setAttribute("focusable", "false");
      svgElement.classList.add("map-svg-element");
      
      // Remove default fill from SVG root to prevent inheritance
      svgElement.removeAttribute("fill");
      svgElement.style.fill = "none";
      
      // Ensure SVG and container allow pointer events
      svgElement.style.pointerEvents = "auto";
      container.style.pointerEvents = "auto";

      // Find all path elements, including nested ones
      const pathElements = Array.from(svgElement.querySelectorAll("path"));
      
      // Debug logging
      console.log(`[MapChart] Found ${pathElements.length} path elements`);
      console.log(`[MapChart] SVG pointer-events: ${window.getComputedStyle(svgElement).pointerEvents}`);
      console.log(`[MapChart] Container pointer-events: ${window.getComputedStyle(container).pointerEvents}`);

      const listeners = [];
      const pathsByIso3 = new Map();

      pathElements.forEach((path) => {
        const rawId = path.getAttribute("id")?.trim();
        const rawName = path.getAttribute("name")?.trim() || path.getAttribute("title")?.trim();
        const rawClass = path.getAttribute("class")?.trim();

        const iso2 = rawId ? rawId.toUpperCase() : null;
        // Apply ISO2 aliases (e.g., Western Sahara -> Morocco)
        const mappedIso2 = iso2 && iso2Aliases[iso2] ? iso2Aliases[iso2] : iso2;
        const normalizedName = normalizeName(rawName || rawClass || "");
        const fallbackName = rawName || rawClass || iso2 || "";

        const countryData =
          (mappedIso2 && lookups.byIso2[mappedIso2]) ||
          (normalizedName && lookups.byName[normalizedName]) ||
          null;
        
        // Debug: log matching for known problematic countries
        const problematicCountries = ["Canada", "United States", "United States of America", "Russia", "Russian Federation", 
          "Argentina", "Chile", "France", "Italy", "Norway", "United Kingdom", "Turkey", "China", "Japan", "Angola", "Oman"];
        
        if (problematicCountries.includes(rawClass) && !countryData) {
          console.warn(`[MapChart] ⚠️ Could not match "${rawClass}"`);
          console.warn(`[MapChart]   - rawId: "${rawId}", iso2: "${iso2}"`);
          console.warn(`[MapChart]   - rawName: "${rawName}"`);
          console.warn(`[MapChart]   - normalizedName: "${normalizedName}"`);
          console.warn(`[MapChart]   - Available normalized names:`, 
            Object.keys(lookups.byName).filter(k => 
              k.includes('canada') || k.includes('united') || k.includes('russia') || 
              k.includes('argentina') || k.includes('chile') || k.includes('france') ||
              k.includes('italy') || k.includes('norway') || k.includes('britain') ||
              k.includes('turkey') || k.includes('china') || k.includes('japan') ||
              k.includes('angola') || k.includes('oman')
            ));
        }
        
        // Log successful matches for debugging
        if (countryData && problematicCountries.includes(rawClass)) {
          console.log(`[MapChart] ✅ Successfully matched "${rawClass}" -> "${countryData.countryName}" (${countryData.countryCode})`);
        }

        // Helper function to manage classes using only setAttribute (no classList mixing)
        const setPathClasses = (classes) => {
          const classString = Array.isArray(classes) ? classes.filter(Boolean).join(" ") : classes;
          if (classString.trim()) {
            path.setAttribute("class", classString);
          } else {
            path.removeAttribute("class");
          }
        };
        
        // Get existing classes (preserve original SVG classes like "Canada", "United States")
        const existingClasses = (path.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
        
        // Remove our managed classes (has-data, no-data, hovered, active, map-country-path, and market-* classes)
        const classesToKeep = existingClasses.filter(
          cls => !["has-data", "no-data", "hovered", "active", "map-country-path"].includes(cls) && !cls.startsWith("market-")
        );
        
        // Remove any inline fill/stroke attributes that might override CSS
        path.removeAttribute("fill");
        path.removeAttribute("stroke");
        
        // We'll set pointer-events after we know if it has data or not
        // (will be "auto" for has-data, "none" for no-data)
        
        // Debug: log pointer-events for first few paths (after we set it)
        
        if (fallbackName) {
          path.dataset.countryName = fallbackName;
        }

        if (countryData) {
          const iso3 = countryData.countryCode.toUpperCase();
          path.dataset.countryCode = iso3;
          // Add market type as data attribute for CSS styling
          if (countryData.marketType) {
            path.dataset.marketType = countryData.marketType;
          }
          
          // Build final class list: original classes + map-country-path + has-data + market type class
          const marketTypeClass = countryData.marketType ? `market-${countryData.marketType}` : "";
          const finalClasses = [...classesToKeep, "map-country-path", "has-data", marketTypeClass].filter(Boolean);
          setPathClasses(finalClasses);
          
          // CRITICAL: Ensure paths with data can receive pointer events
          path.style.pointerEvents = "auto";
          path.style.cursor = "pointer";
          // Don't set default fill here - let CSS handle it
          // Only set inline styles on hover/active states

          if (!pathsByIso3.has(iso3)) {
            pathsByIso3.set(iso3, []);
          }
          pathsByIso3.get(iso3).push(path);
          
          // Debug: verify class is correct for problematic countries
          if (rawClass === "Canada" || rawClass === "United States" || rawClass === "Russia" || rawClass === "Argentina") {
            const actualClass = path.getAttribute("class") || "";
            console.log(`[MapChart] Path for "${rawClass}" final classes:`, actualClass);
            if (actualClass.includes("no-data")) {
              console.error(`[MapChart] ERROR: "${rawClass}" path still has "no-data" class! Classes:`, actualClass);
              // Force fix by rebuilding classes
              const fixedClasses = [...classesToKeep, "map-country-path", "has-data"].filter(cls => cls !== "no-data");
              setPathClasses(fixedClasses);
              console.log(`[MapChart] After force fix, classes:`, path.getAttribute("class"));
            }
            if (!actualClass.includes("has-data")) {
              console.error(`[MapChart] ERROR: "${rawClass}" path missing "has-data" class! Classes:`, actualClass);
              const fixedClasses = [...classesToKeep, "map-country-path", "has-data"];
              setPathClasses(fixedClasses);
              console.log(`[MapChart] After adding has-data, classes:`, path.getAttribute("class"));
            }
          }
        } else {
          // Build final class list: original classes + map-country-path + no-data (NO has-data)
          const finalClasses = [...classesToKeep, "map-country-path", "no-data"];
          setPathClasses(finalClasses);
          
          path.style.cursor = "default";
          // Ensure no-data paths also have no inline fill
          path.removeAttribute("fill");
          // CRITICAL: Set pointer-events to none for no-data paths so they don't block events on underlying paths
          path.style.pointerEvents = "none";
        }

        const handleEnter = (evt) => {
          evt.stopPropagation();
          const iso3 = path.dataset.countryCode;
          const countryName = path.dataset.countryName || path.getAttribute("id") || "unknown";
          const isProblematic = countryName === "Canada" || countryName === "United States" || countryName === "Russia" || countryName === "Argentina";
          
          if (isProblematic) {
            console.log(`[MapChart] mouseenter on PROBLEMATIC country:`, countryName, `ISO3: ${iso3}`);
          }
          
          clearHoverState();
          
          // Apply hover to ALL paths for this country
          if (iso3) {
            const allCountryPaths = pathsByIso3Ref.current.get(iso3) || [];
            if (isProblematic) {
              console.log(`[MapChart] Processing ${allCountryPaths.length} paths for ${countryName}`);
            }
            
            allCountryPaths.forEach((p, index) => {
              // Add hovered class using setAttribute
              const currentClasses = (p.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
              if (isProblematic && index === 0) {
                console.log(`[MapChart] Path ${index} BEFORE hover - classes:`, currentClasses.join(" "));
              }
              
              if (!currentClasses.includes("hovered")) {
                currentClasses.push("hovered");
                p.setAttribute("class", currentClasses.join(" "));
              }
              
              // Explicitly set styles to ensure they apply (override any inline styles)
              // Only apply hover styles if not active (active state should take precedence)
              const classStr = p.getAttribute("class") || "";
              const isActive = classStr.includes("active");
              const hasData = classStr.includes("has-data");
              const hasNoData = classStr.includes("no-data");
              
              if (isProblematic && index === 0) {
                console.log(`[MapChart] Path ${index} AFTER adding hovered - classes:`, classStr);
                console.log(`[MapChart] Path ${index} - hasData: ${hasData}, hasNoData: ${hasNoData}, isActive: ${isActive}`);
              }
              
              // CRITICAL: If path has both classes, remove no-data first!
              if (hasData && hasNoData) {
                console.error(`[MapChart] CRITICAL: Path ${index} for ${countryName} has BOTH has-data and no-data! Fixing...`);
                const fixedClasses = currentClasses.filter(cls => cls !== "no-data");
                p.setAttribute("class", fixedClasses.join(" "));
                if (isProblematic) {
                  console.log(`[MapChart] After removing no-data, classes:`, p.getAttribute("class"));
                }
              }
              
              // Apply hover styles - check again after potential fix
              const finalClassStr = p.getAttribute("class") || "";
              const finalHasData = finalClassStr.includes("has-data");
              const finalHasNoData = finalClassStr.includes("no-data");
              
              if (finalHasData && !isActive && !finalHasNoData) {
                // Get market type from path's data attribute or class
                const marketType = p.dataset.marketType || (finalClassStr.includes("market-mixed") ? "mixed" : finalClassStr.includes("market-government_registries") ? "government_registries" : "customs");
                const colors = getMarketColors(marketType);
                p.style.setProperty("fill", colors.hover.fill, "important");
                p.style.setProperty("stroke", colors.hover.stroke, "important");
                p.style.setProperty("filter", colors.hover.filter, "important");
                
                if (isProblematic && index === 0) {
                  console.log(`[MapChart] Path ${index} - Applied hover styles. Computed fill:`, window.getComputedStyle(p).fill);
                }
              } else if (isProblematic && index === 0) {
                console.warn(`[MapChart] Path ${index} - NOT applying hover styles! finalHasData: ${finalHasData}, isActive: ${isActive}, finalHasNoData: ${finalHasNoData}`);
              }
            });
            hoveredPathRef.current = path; // Store one as reference
          } else {
            hoveredPathRef.current = path;
            const currentClasses = (path.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
            if (!currentClasses.includes("hovered")) {
              currentClasses.push("hovered");
              path.setAttribute("class", currentClasses.join(" "));
            }
            const classStr = path.getAttribute("class") || "";
            const isActive = classStr.includes("active");
            const hasData = classStr.includes("has-data");
            const hasNoData = classStr.includes("no-data");
            
            // CRITICAL: If path has both classes, remove no-data first!
            if (hasData && hasNoData) {
              console.error(`[MapChart] CRITICAL: Path for ${countryName} has BOTH has-data and no-data! Fixing...`);
              const fixedClasses = currentClasses.filter(cls => cls !== "no-data");
              path.setAttribute("class", fixedClasses.join(" "));
            }
            
            const finalClassStr = path.getAttribute("class") || "";
            const finalHasData = finalClassStr.includes("has-data");
            const finalHasNoData = finalClassStr.includes("no-data");
            
            if (finalHasData && !isActive && !finalHasNoData) {
              // Get market type from path's data attribute or class
              const marketType = path.dataset.marketType || (finalClassStr.includes("market-mixed") ? "mixed" : finalClassStr.includes("market-government_registries") ? "government_registries" : "customs");
              const colors = getMarketColors(marketType);
              path.style.setProperty("fill", colors.hover.fill, "important");
              path.style.setProperty("stroke", colors.hover.stroke, "important");
              path.style.setProperty("filter", colors.hover.filter, "important");
            }
          }
          
          updateTooltipFromPath(path, evt);
        };

        const handleMove = (evt) => {
          if (hoveredPathRef.current === path) {
            updateTooltipFromPath(path, evt);
          }
        };

        const handleLeaveInternal = (evt) => {
          evt.stopPropagation();
          const iso3 = path.dataset.countryCode;
          
          // Check if we're moving to another path element (same country or different country)
          const relatedTarget = evt.relatedTarget;
          const isMovingToPath = relatedTarget && (
            relatedTarget.tagName === "path" ||
            relatedTarget.closest("path") !== null
          );
          
          // Only clear if this path belongs to the currently hovered country
          if (hoveredPathRef.current && hoveredPathRef.current.dataset.countryCode === iso3) {
            // Clear hover from ALL paths for this country
            if (iso3) {
              const allCountryPaths = pathsByIso3Ref.current.get(iso3) || [];
              allCountryPaths.forEach((p) => {
                // Remove hovered using setAttribute
                const currentClasses = (p.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
                const classesWithoutHovered = currentClasses.filter(cls => cls !== "hovered");
                if (classesWithoutHovered.length !== currentClasses.length) {
                  p.setAttribute("class", classesWithoutHovered.join(" "));
                }
                // Use removeProperty to properly remove !important inline styles
                p.style.removeProperty("fill");
                p.style.removeProperty("stroke");
                p.style.removeProperty("filter");
              });
            }
            hoveredPathRef.current = null;
            
            // Clear tooltip if we're not moving to another path
            // If we're moving to another country, its handleEnter will immediately restore the tooltip
            if (!isMovingToPath) {
              setTooltip(null);
            }
          } else if (iso3) {
            // Make sure this path's hover is removed
            const currentClasses = (path.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
            const classesWithoutHovered = currentClasses.filter(cls => cls !== "hovered");
            if (classesWithoutHovered.length !== currentClasses.length) {
              path.setAttribute("class", classesWithoutHovered.join(" "));
            }
            path.style.removeProperty("fill");
            path.style.removeProperty("stroke");
            path.style.removeProperty("filter");
            
            // Clear tooltip if we're not moving to another path
            if (!isMovingToPath && hoveredPathRef.current === path) {
              setTooltip(null);
              hoveredPathRef.current = null;
            }
          }
        };

        const handleMouseOut = (evt) => {
          // Only trigger if we're actually leaving this path (not entering a child)
          if (!path.contains(evt.relatedTarget)) {
            handleLeaveInternal(evt);
          }
        };

        const handleClick = (evt) => {
          evt.stopPropagation();
          evt.preventDefault();
          const iso3 = path.dataset.countryCode;
          if (!iso3) {
            console.warn(`[MapChart] Click on path without countryCode:`, path);
            return;
          }
          const data = lookups.byIso3[iso3];
          if (data) {
            console.log(`[MapChart] Country clicked: ${data.countryName} (${iso3})`);
            onCountrySelect?.(data);
          } else {
            console.warn(`[MapChart] No data found for countryCode: ${iso3}`);
          }
        };

        // Use both capture and bubble phases for maximum compatibility
        path.addEventListener("mouseenter", handleEnter);
        path.addEventListener("mouseleave", handleLeaveInternal);
        path.addEventListener("mousemove", handleMove);
        path.addEventListener("mouseover", handleEnter);
        path.addEventListener("mouseout", handleMouseOut);
        path.addEventListener("focus", handleEnter);
        path.addEventListener("blur", handleLeaveInternal);
        path.addEventListener("click", handleClick);

        listeners.push({
          path,
          handleEnter,
          handleMove,
          handleLeaveInternal,
          handleMouseOut,
          handleClick,
        });
      });

      pathsByIso3Ref.current = pathsByIso3;
      hoveredPathRef.current = null;
      storedListeners = listeners;
      console.log(`[MapChart] Event listeners attached to ${listeners.length} paths`);
      console.log(`[MapChart] Countries with data: ${pathsByIso3.size}`);
      
      // Find and log all no-data paths
      const noDataPaths = Array.from(svgElement.querySelectorAll("path.no-data"));
      const noDataCountries = new Map();
      
      noDataPaths.forEach((path) => {
        const countryName = path.dataset.countryName || path.getAttribute("class")?.replace("map-country-path no-data", "").trim() || path.getAttribute("id") || "unknown";
        const id = path.getAttribute("id");
        const name = path.getAttribute("name");
        const classAttr = path.getAttribute("class");
        
        if (!noDataCountries.has(countryName)) {
          noDataCountries.set(countryName, []);
        }
        noDataCountries.get(countryName).push({
          id,
          name,
          class: classAttr,
          countryName: path.dataset.countryName
        });
      });
      
      console.log(`[MapChart] ========================================`);
      console.log(`[MapChart] NO-DATA PATHS SUMMARY:`);
      console.log(`[MapChart] Total no-data paths: ${noDataPaths.length}`);
      console.log(`[MapChart] Unique no-data countries/regions: ${noDataCountries.size}`);
      console.log(`[MapChart] ========================================`);
      console.log(`[MapChart] No-data countries/regions:`);
      noDataCountries.forEach((paths, countryName) => {
        console.log(`[MapChart]   - "${countryName}": ${paths.length} path(s)`);
        if (paths.length <= 3) {
          paths.forEach((p, idx) => {
            console.log(`[MapChart]     Path ${idx + 1}: id="${p.id}", name="${p.name}", class="${p.class}"`);
          });
        }
      });
      console.log(`[MapChart] ========================================`);
    };

    // Initial setup
    setupSVG();

    // Cleanup function
    return () => {
      const svgElement = container?.querySelector("svg");
      if (svgElement) {
        svgElement.dataset.listenersAttached = "false";
      }
      
      storedListeners.forEach(({ path, handleEnter, handleMove, handleLeaveInternal, handleMouseOut, handleClick }) => {
        try {
          path.removeEventListener("mouseenter", handleEnter);
          path.removeEventListener("mouseleave", handleLeaveInternal);
          path.removeEventListener("mousemove", handleMove);
          path.removeEventListener("mouseover", handleEnter);
          path.removeEventListener("mouseout", handleMouseOut);
          path.removeEventListener("focus", handleEnter);
          path.removeEventListener("blur", handleLeaveInternal);
          path.removeEventListener("click", handleClick);
        } catch (e) {
          // Path may have been removed, ignore
        }
      });
      storedListeners = [];
    };
  }, [clearHoverState, updateTooltipFromPath, lookups.byIso2, lookups.byIso3, lookups.byName, onCountrySelect]);

      useEffect(() => {
        const iso3 = selectedCountryCode?.toUpperCase();
        const pathsByIso3 = pathsByIso3Ref.current;

        // Clear hover state when a country is selected
        if (iso3) {
          clearHoverState();
        }

        pathsByIso3.forEach((paths, key) => {
          const isActive = key === iso3;
          paths.forEach((path) => {
            // Update active class using setAttribute
            const currentClasses = (path.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
            const hasActive = currentClasses.includes("active");
            
            if (isActive && !hasActive) {
              // Add active class
              currentClasses.push("active");
              path.setAttribute("class", currentClasses.join(" "));
            } else if (!isActive && hasActive) {
              // Remove active class
              const classesWithoutActive = currentClasses.filter(cls => cls !== "active");
              path.setAttribute("class", classesWithoutActive.join(" "));
            }
            
            // Explicitly set styles for active state
            const classStr = path.getAttribute("class") || "";
            const hasData = classStr.includes("has-data");
            
            if (isActive && hasData) {
              // Get market type from path's data attribute or class
              const marketType = path.dataset.marketType || (classStr.includes("market-mixed") ? "mixed" : classStr.includes("market-government_registries") ? "government_registries" : "customs");
              const colors = getMarketColors(marketType);
              path.style.setProperty("fill", colors.active.fill, "important");
              path.style.setProperty("stroke", colors.active.stroke, "important");
              path.style.setProperty("filter", colors.active.filter, "important");
            } else if (!isActive) {
              // Remove inline styles for non-active countries
              const isHovered = classStr.includes("hovered");
              if (!isHovered) {
                path.style.removeProperty("fill");
                path.style.removeProperty("stroke");
                path.style.removeProperty("filter");
              }
            }
          });
        });
      }, [selectedCountryCode, clearHoverState]);

      // Apply market type filter to map paths
      useEffect(() => {
        const pathsByIso3 = pathsByIso3Ref.current;
        const svgElement = svgContainerRef.current?.querySelector("svg");
        if (!svgElement) return;

        const allPaths = Array.from(svgElement.querySelectorAll("path"));
        
        allPaths.forEach((path) => {
          const pathMarketType = path.dataset.marketType;
          const hasData = path.classList.contains("has-data");
          
          if (marketTypeFilter) {
            // If filter is active, show only matching countries, fade others
            if (hasData && pathMarketType === marketTypeFilter) {
              path.style.opacity = "1";
              path.style.pointerEvents = "auto";
            } else if (hasData) {
              // Fade out countries that don't match the filter
              path.style.opacity = "0.3";
              path.style.pointerEvents = "auto";
            } else {
              // No data countries remain at their default opacity
              path.style.opacity = path.style.opacity || "0.6";
            }
          } else {
            // No filter - show all countries normally
            if (hasData) {
              path.style.opacity = "1";
              path.style.pointerEvents = "auto";
            } else {
              path.style.opacity = "0.6";
            }
          }
        });
      }, [marketTypeFilter]);

  // Clear filter and close legend when clicking outside the legend
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (legendRef.current && !legendRef.current.contains(event.target)) {
        // Clear filter if active
        if (marketTypeFilter) {
          onMarketTypeFilterChange?.(null);
        }
        // Close legend if expanded
        if (isLegendExpanded) {
          setIsLegendExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [marketTypeFilter, isLegendExpanded, onMarketTypeFilterChange]);

  const legendItems = [
    {
      type: "customs",
      color: "#d9e4f5",
      label: t("marketCustomsDisplay", translations),
    },
    {
      type: "mixed",
      color: "#d2dbe8",
      label: t("marketMixedDisplay", translations),
    },
    {
      type: "government_registries",
      color: "#e0e4ea",
      label: t("marketGovernmentRegistriesDisplay", translations),
    },
  ];

  return (
    <div
      className="map-wrapper"
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={svgContainerRef}
        className="map-svg"
      />
      
      <div className="map-legend" ref={legendRef}>
        <button
          type="button"
          className="map-legend__header"
          onClick={() => setIsLegendExpanded(!isLegendExpanded)}
          aria-expanded={isLegendExpanded}
        >
          <div className="map-legend__title">{t("mapLegendTitle", translations)}</div>
          <svg
            className={`map-legend__expand-icon ${isLegendExpanded ? "expanded" : ""}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className={`map-legend__items ${isLegendExpanded ? "expanded" : "collapsed"}`}>
          {legendItems.map((item) => (
            <button
              key={item.type}
              type="button"
              className={`map-legend__item map-legend__item--button ${marketTypeFilter === item.type ? "active" : ""}`}
              onClick={() => onMarketTypeFilterChange?.(item.type)}
            >
              <span
                className="map-legend__color"
                style={{ backgroundColor: item.color }}
              />
              <span className="map-legend__label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {tooltip && (
        <div
          className={`map-tooltip ${tooltip.hasData ? "with-data" : "no-data"}`}
          style={{
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
            zIndex: 1000,
          }}
        >
          <span className="tooltip-country">{tooltip.name}</span>
          {tooltip.hasData ? (
            <span className="tooltip-market">
              <img src={marketIcon[tooltip.market]} alt={tooltip.market} style={{ width: "16px", height: "16px", display: "inline-block", verticalAlign: "middle" }} />
              <span className="tooltip-market-label">
                {tooltip.market === "customs" 
                  ? t("marketCustomsDisplay", translations)
                  : tooltip.market === "mixed"
                  ? t("marketMixedDisplay", translations)
                  : tooltip.market === "government_registries"
                  ? t("marketGovernmentRegistriesDisplay", translations)
                  : tooltip.market.replace(/_/g, " ")}
              </span>
            </span>
          ) : (
            <span className="tooltip-market-label">{t("noCoverageYet", translations)}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MapChart;
