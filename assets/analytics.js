(function () {
  "use strict";

  const config = {
    projectToken: "phc_A3oUtLuwAtArNyQykCDb4DxkNAQLBwncAsNjaVoVkJgG",
    apiHost: "https://us.i.posthog.com",
    assetHost: "https://us-assets.i.posthog.com",
    productionHosts: new Set(["bono12138.github.io"]),
    siteVersion: "2026-08-06"
  };

  const allowedEvents = new Set([
    "portfolio_section_engaged",
    "portfolio_section_navigated",
    "portfolio_language_changed",
    "portfolio_pdf_downloaded",
    "portfolio_outbound_link_opened",
    "portfolio_image_opened",
    "portfolio_reading_summary"
  ]);

  const allowedProperties = new Set([
    "section_id",
    "from_section_id",
    "to_section_id",
    "navigation_kind",
    "from_language",
    "to_language",
    "engagement_number",
    "is_reentry",
    "asset_name",
    "link_kind",
    "link_label",
    "destination_host",
    "destination_path",
    "max_scroll_depth_percent",
    "active_time_ms",
    "sections_engaged_unique",
    "section_engagements_total"
  ]);

  const pendingEvents = [];
  const debugEvents = [];
  let posthogReady = false;

  function cleanText(value, maxLength) {
    if (typeof value !== "string") return "";
    return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
  }

  function safeQueryValue(name) {
    const value = new URLSearchParams(location.search).get(name) || "";
    return /^[\w.-]{1,80}$/.test(value) ? value : "";
  }

  function commonProperties() {
    const referrer = document.referrer ? new URL(document.referrer) : null;
    return {
      portfolio_language: document.documentElement.lang || "zh-Hans",
      portfolio_site_version: config.siteVersion,
      portfolio_share_id: safeQueryValue("share_id"),
      portfolio_utm_source: safeQueryValue("utm_source"),
      portfolio_utm_medium: safeQueryValue("utm_medium"),
      portfolio_utm_campaign: safeQueryValue("utm_campaign"),
      portfolio_referrer_host: referrer?.host || "direct"
    };
  }

  function sanitizeProperties(properties) {
    const output = {};
    Object.entries(properties || {}).forEach(([key, value]) => {
      if (!allowedProperties.has(key)) return;
      if (typeof value === "boolean") output[key] = value;
      else if (typeof value === "number" && Number.isFinite(value)) output[key] = value;
      else if (typeof value === "string") output[key] = cleanText(value, 160);
    });
    return { ...commonProperties(), ...output };
  }

  function publishDebugEvents() {
    document.documentElement.dataset.analyticsMode = "debug";
    document.documentElement.dataset.analyticsEventCount = String(debugEvents.length);
    let output = document.querySelector("#portfolio-analytics-debug");
    if (!output) {
      output = document.createElement("script");
      output.id = "portfolio-analytics-debug";
      output.type = "application/json";
      document.head.appendChild(output);
    }
    output.textContent = JSON.stringify(debugEvents);
  }

  function track(eventName, properties, options) {
    if (!allowedEvents.has(eventName)) return;
    const event = { eventName, properties: sanitizeProperties(properties), options: options || {} };

    if (!config.productionHosts.has(location.hostname)) {
      debugEvents.push(event);
      publishDebugEvents();
      return;
    }

    if (!posthogReady || !window.posthog?.capture) {
      pendingEvents.push(event);
      return;
    }
    window.posthog.capture(event.eventName, event.properties, event.options);
  }

  function flushPendingEvents() {
    while (pendingEvents.length && window.posthog?.capture) {
      const event = pendingEvents.shift();
      window.posthog.capture(event.eventName, event.properties, event.options);
    }
  }

  window.PortfolioAnalytics = {
    track,
    getDebugEvents: () => debugEvents.slice()
  };

  if (!config.productionHosts.has(location.hostname)) {
    publishDebugEvents();
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `${config.assetHost}/static/1/array.js`;
  script.addEventListener("load", () => {
    if (!window.posthog?.init) return;
    window.posthog.init(config.projectToken, {
      api_host: config.apiHost,
      asset_host: config.assetHost,
      defaults: "2026-05-30",
      strict_script_versioning: true,
      persistence: "localStorage+cookie",
      cross_subdomain_cookie: false,
      secure_cookie: true,
      respect_dnt: true,
      person_profiles: "identified_only",
      autocapture: false,
      capture_pageview: true,
      capture_pageleave: true,
      disable_session_recording: true,
      loaded: (posthog) => {
        posthog.register(commonProperties());
        posthogReady = true;
        flushPendingEvents();
      }
    });
  });
  document.head.appendChild(script);
})();
