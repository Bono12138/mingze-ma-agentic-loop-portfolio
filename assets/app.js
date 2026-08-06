(function () {
  "use strict";

  const content = window.PORTFOLIO_CONTENT;
  const analytics = window.PortfolioAnalytics || { track() {} };
  const supportedLanguages = ["zh-Hans", "zh-Hant", "en"];
  const sectionAssets = {
    "audit-response": [
      { type: "single", asset: "audit", caption: { "zh-Hans": "审计回应总体架构", "zh-Hant": "審計回應總體架構", en: "Audit-response architecture" } }
    ],
    "superset-tool": [
      {
        type: "grid",
        items: [
          { src: "assets/images/wiki-superset-query.png", caption: { "zh-Hans": "公司 Wiki：Superset 查询工具", "zh-Hant": "公司 Wiki：Superset 查詢工具", en: "Company Wiki: Superset query tool" } },
          { src: "assets/images/wiki-query-governance.png", caption: { "zh-Hans": "公司 Wiki：查询治理与工程化发布", "zh-Hant": "公司 Wiki：查詢治理與工程化發佈", en: "Company Wiki: query governance and release" } }
        ]
      },
      {
        type: "feedback",
        items: [
          { src: "assets/images/internal-feedback-superset-01.jpg", caption: { "zh-Hans": "不同部门同事的真实使用反馈（一）", "zh-Hant": "不同部門同事的真實使用反饋（一）", en: "Real feedback from colleagues across departments (1)" } },
          { src: "assets/images/internal-feedback-superset-02.jpg", caption: { "zh-Hans": "不同部门同事的真实使用反馈（二）", "zh-Hant": "不同部門同事的真實使用反饋（二）", en: "Real feedback from colleagues across departments (2)" } }
        ]
      }
    ],
    "architecture-evolution": [
      { type: "single", asset: "feedback", caption: { "zh-Hans": "从工具使用反馈进入分层架构设计", "zh-Hant": "從工具使用反饋進入分層架構設計", en: "From tool feedback to layered architecture" } }
    ],
    foundation: [
      { type: "single", asset: "layers", caption: { "zh-Hans": "Bono Agent 四层能力与知识底座", "zh-Hant": "Bono Agent 四層能力與知識底座", en: "The four-layer Bono Agent capability and knowledge foundation" } },
      { type: "single", asset: "loop", caption: { "zh-Hans": "0630 ECL 项目与四层架构的反馈回路", "zh-Hant": "0630 ECL 項目與四層架構的反饋迴路", en: "The feedback loop between the 0630 ECL delivery and the four-layer architecture" } }
    ],
    "insight-plugin": [
      { type: "single", src: "assets/images/bono-insight-plugin.png", caption: { "zh-Hans": "Bono Insight 以 Codex 插件形式安装和使用", "zh-Hant": "Bono Insight 以 Codex 插件形式安裝和使用", en: "Bono Insight installed and used as a Codex plugin" }, portrait: true }
    ]
  };

  const projectAssets = [
    {
      title: "BonoBox",
      src: "assets/images/bonobox-visual.png",
      href: "https://github.com/Bono12138/bonobox",
      contain: true,
      label: { "zh-Hans": "公开工具", "zh-Hant": "公開工具", en: "Public tool" }
    },
    {
      title: "Quota Capsule",
      src: "assets/images/quota-capsule.png",
      href: "https://github.com/Bono12138/codex-quota-capsule",
      contain: true,
      label: { "zh-Hans": "macOS 工具", "zh-Hant": "macOS 工具", en: "macOS utility" }
    },
    {
      title: "World Cup Rank Room",
      src: "assets/images/worldcup-rank-room-live-20260806.png",
      href: "https://worldcup-rank-room.pages.dev/",
      wide: true,
      label: { "zh-Hans": "真实上线页面", "zh-Hant": "真實上線頁面", en: "Live production page" }
    }
  ];

  const imageDimensions = {
    "assets/images/audit-sc.png": [1920, 809],
    "assets/images/audit-tc.png": [1920, 809],
    "assets/images/audit-en.png": [1920, 879],
    "assets/images/feedback-sc.png": [1770, 467],
    "assets/images/feedback-tc.png": [1770, 467],
    "assets/images/feedback-en.png": [1770, 467],
    "assets/images/layers-sc.png": [1920, 1022],
    "assets/images/layers-tc.png": [1920, 1022],
    "assets/images/layers-en.png": [1920, 1100],
    "assets/images/loop-sc.png": [1920, 723],
    "assets/images/loop-tc.png": [1920, 723],
    "assets/images/loop-en.png": [1920, 765],
    "assets/images/wiki-superset-query.png": [1885, 730],
    "assets/images/wiki-query-governance.png": [1894, 732],
    "assets/images/internal-feedback-superset-01.jpg": [1172, 2654],
    "assets/images/internal-feedback-superset-02.jpg": [1172, 2649],
    "assets/images/bono-insight-plugin.png": [800, 905],
    "assets/images/vanke-finance-ai-sharing-redacted.png": [2996, 1676],
    "assets/images/bonobox-visual.png": [613, 992],
    "assets/images/quota-capsule.png": [872, 1120],
    "assets/images/worldcup-rank-room-live-20260806.png": [2880, 1800]
  };

  const protectedPhrases = [
    "Akulaku Group", "Agentic Loop", "Agentic Engineering", "Bono Agent", "Bono Insight",
    "World Cup Rank Room", "Claude Code", "Cursor CLI", "Financial Services Technology Risk",
    "Expected Credit Loss", "Artificial Intelligence", "风险管理", "金融风险", "操作风险",
    "基础设施", "基礎設施", "审计回应", "審計回應", "系统控制", "系統控制",
    "数据处理", "數據處理", "财务对账", "財務對賬", "外部审阅", "外部審閱",
    "业务流程", "業務流程", "代码片段", "程式碼片段", "查询脚本", "查詢腳本",
    "数据查询", "數據查詢", "数据分析", "數據分析", "业务知识", "業務知識",
    "原子能力", "方法层", "方法層", "任务层", "任務層", "依据层", "依據層"
  ].sort((a, b) => b.length - a.length);

  const dom = {
    html: document.documentElement,
    article: document.querySelector("#article"),
    title: document.querySelector("#page-title"),
    byline: document.querySelector("#byline"),
    summary: document.querySelector("#hero-summary"),
    eyebrow: document.querySelector("#hero-eyebrow"),
    roleList: document.querySelector("#role-list"),
    desktopToc: document.querySelector("#desktop-toc"),
    drawerToc: document.querySelector("#drawer-toc"),
    progress: document.querySelector(".reading-progress span"),
    menuButton: document.querySelector(".menu-button"),
    drawer: document.querySelector(".mobile-drawer"),
    backdrop: document.querySelector(".drawer-backdrop"),
    drawerClose: document.querySelector(".drawer-close"),
    topButton: document.querySelector(".back-to-top"),
    lightbox: document.querySelector(".lightbox"),
    lightboxImage: document.querySelector(".lightbox img"),
    lightboxCaption: document.querySelector(".lightbox-caption"),
    lightboxClose: document.querySelector(".lightbox-close"),
    heroImage: document.querySelector("[data-hero-figure] img"),
    heroButton: document.querySelector("[data-hero-figure] .media-button")
  };

  let activeLanguage = getInitialLanguage();
  let activeSection = normaliseSection(location.hash.slice(1));
  let sectionObserver;
  let navigationLockUntil = 0;
  let sectionEngagementTimer;
  let summarySent = false;
  let maxScrollDepthPercent = 0;
  let sectionEngagementsTotal = 0;
  let activeTimeMs = 0;
  let activeClockStartedAt = document.visibilityState === "visible" ? performance.now() : null;
  const sectionEngagementCounts = new Map();
  const engagedSections = new Set();

  function getInitialLanguage() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    return supportedLanguages.includes(fromUrl) ? fromUrl : "zh-Hans";
  }

  function normaliseSection(sectionId) {
    const valid = content["zh-Hans"].sections.some((section) => section.id === sectionId);
    return valid ? sectionId : "background";
  }

  function languageAssetSuffix(language) {
    return language === "zh-Hans" ? "sc" : language === "zh-Hant" ? "tc" : "en";
  }

  function updateUrl(language, sectionId, push) {
    const url = new URL(location.href);
    url.searchParams.set("lang", language);
    url.hash = sectionId;
    history[push ? "pushState" : "replaceState"]({}, "", url);
  }

  function applyLabels(locale) {
    document.querySelectorAll("[data-label]").forEach((element) => {
      const key = element.dataset.label;
      if (locale.labels[key]) element.textContent = locale.labels[key];
    });
    document.querySelector(".skip-link").textContent = locale.labels.skip;
    document.querySelector(".language-switcher").setAttribute("aria-label", locale.labels.language);
    document.querySelector(".reading-progress").setAttribute("aria-label", locale.labels.progress);
    dom.menuButton.setAttribute("aria-label", locale.labels.menu);
    dom.drawerClose.setAttribute("aria-label", locale.labels.close);
    dom.topButton.setAttribute("aria-label", locale.labels.top);
    dom.lightbox.setAttribute("aria-label", locale.labels.openImage);
    dom.lightboxClose.setAttribute("aria-label", locale.labels.closeImage);
  }

  function imageSizeAttributes(src) {
    const dimensions = imageDimensions[src];
    return dimensions ? ` width="${dimensions[0]}" height="${dimensions[1]}"` : "";
  }

  function mediaFigure(item, language) {
    const suffix = languageAssetSuffix(language);
    const src = item.src || `assets/images/${item.asset}-${suffix}.png`;
    const caption = item.caption[language];
    const figure = document.createElement("figure");
    figure.className = `section-media media-frame${item.portrait ? " portrait-media" : ""}`;
    figure.innerHTML = `
      <button type="button" class="media-button" data-lightbox-src="${src}" data-lightbox-caption="${escapeHtml(caption)}">
        <img src="${src}" alt="${escapeHtml(caption)}"${imageSizeAttributes(src)} loading="lazy">
        <span class="media-hint">${escapeHtml(content[language].labels.openImage)}</span>
      </button>
      <figcaption>${escapeHtml(caption)}</figcaption>`;
    return figure;
  }

  function mediaGrid(group, language) {
    const wrapper = document.createElement("div");
    wrapper.className = `media-grid${group.type === "feedback" ? " feedback-grid" : ""}`;
    group.items.forEach((item) => wrapper.appendChild(mediaFigure(item, language)));
    return wrapper;
  }

  function projectGallery(language) {
    const gallery = document.createElement("div");
    gallery.className = "project-gallery";

    const sharing = document.createElement("figure");
    const sharingCaption = language === "en" ? "AI practice sharing prepared for a finance team" : language === "zh-Hant" ? "為財務團隊準備的 AI 實踐分享材料" : "为财务团队准备的 AI 实践分享材料";
    sharing.className = "section-media media-frame project-card-wide";
    sharing.innerHTML = `
      <button type="button" class="media-button" data-lightbox-src="assets/images/vanke-finance-ai-sharing-redacted.png" data-lightbox-caption="${sharingCaption}">
        <img src="assets/images/vanke-finance-ai-sharing-redacted.png" alt="${sharingCaption}"${imageSizeAttributes("assets/images/vanke-finance-ai-sharing-redacted.png")} loading="lazy">
        <span class="media-hint">${content[language].labels.openImage}</span>
      </button>
      <figcaption>${sharingCaption}</figcaption>`;
    gallery.appendChild(sharing);

    projectAssets.forEach((project) => {
      const link = document.createElement("a");
      link.className = `project-card project-link${project.wide ? " project-card-wide" : ""}`;
      link.href = project.href;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.innerHTML = `
        <span class="project-card-media${project.contain ? " contain" : ""}">
          <img src="${project.src}" alt="${project.title}"${imageSizeAttributes(project.src)} loading="lazy">
        </span>
        <span class="project-card-copy">
          <small>${project.label[language]}</small>
          <strong>${project.title}</strong>
        </span>`;
      gallery.appendChild(link);
    });
    return gallery;
  }

  function buildPager(index, sections, locale) {
    const pager = document.createElement("nav");
    pager.className = "section-pager";
    pager.setAttribute("aria-label", locale.labels.contents);
    const previous = sections[index - 1];
    const next = sections[index + 1];
    if (previous) {
      pager.insertAdjacentHTML("beforeend", `<a href="#${previous.id}"><small>← ${locale.labels.previous}</small><strong>${escapeHtml(previous.heading)}</strong></a>`);
    } else {
      pager.insertAdjacentHTML("beforeend", "<span></span>");
    }
    if (next) {
      pager.insertAdjacentHTML("beforeend", `<a href="#${next.id}"><small>${locale.labels.next} →</small><strong>${escapeHtml(next.heading)}</strong></a>`);
    }
    return pager;
  }

  function render(language, preserveScroll) {
    const locale = content[language];
    const targetId = activeSection;
    activeSection = targetId;
    if (preserveScroll) navigationLockUntil = Date.now() + 1500;
    activeLanguage = language;
    dom.html.lang = locale.htmlLang;
    document.title = `${locale.title}｜${language === "en" ? "Mingze Ma" : "马铭泽"}`;
    document.querySelector('meta[name="description"]').content = locale.summary;
    dom.title.setAttribute("aria-label", locale.title);
    dom.title.innerHTML = `
      <span class="title-lines title-lines-desktop" aria-hidden="true">${locale.titleLines.desktop.map((line) => `<span class="title-line">${escapeHtml(line)}</span>`).join("")}</span>
      <span class="title-lines title-lines-mobile" aria-hidden="true">${locale.titleLines.mobile.map((line) => `<span class="title-line">${escapeHtml(line)}</span>`).join("")}</span>`;
    dom.byline.textContent = locale.byline;
    dom.summary.setAttribute("aria-label", locale.summary);
    const summaryLines = locale.mobileSummary.map((line) => `<span>${escapeHtml(line)}</span>`).join("");
    dom.summary.innerHTML = `<span class="hero-summary-desktop" aria-hidden="true">${summaryLines}</span><span class="hero-summary-mobile" aria-hidden="true">${summaryLines}</span>`;
    dom.eyebrow.textContent = locale.eyebrow;
    dom.roleList.replaceChildren(...locale.roles.map((role, index) => {
      const item = document.createElement("div");
      item.className = "role-item";
      item.innerHTML = `<span class="role-number">0${index + 1}</span><span>${escapeHtml(role)}</span>`;
      return item;
    }));
    applyLabels(locale);

    const heroAsset = `assets/images/timeline-${languageAssetSuffix(language)}.png`;
    dom.heroImage.src = heroAsset;
    dom.heroImage.alt = language === "en" ? "Four stages from Copilot to the Agentic Loop" : language === "zh-Hant" ? "從 Copilot 到 Agentic Loop 的四階段發展路徑" : "从 Copilot 到 Agentic Loop 的四阶段发展路径";
    dom.heroButton.dataset.lightboxSrc = heroAsset;
    dom.heroButton.dataset.lightboxCaption = dom.heroImage.alt;

    dom.article.innerHTML = "";
    locale.sections.forEach((section, index) => {
      const element = document.createElement("section");
      element.className = "article-section";
      element.id = section.id;
      element.dataset.section = section.id;
      element.innerHTML = `<span class="section-kicker">${String(index).padStart(2, "0")}</span><h2>${escapeHtml(section.heading)}</h2><div class="section-body">${section.html}</div>`;
      const body = element.querySelector(".section-body");

      placeSectionAssets(section.id, body, language);
      if (section.id === "supporting-cases") body.appendChild(projectGallery(language));
      element.appendChild(buildPager(index, locale.sections, locale));
      dom.article.appendChild(element);
    });

    const tocHtml = locale.sections.map((section, index) => `
      <a href="#${section.id}" data-section-link="${section.id}">
        <span class="toc-index">${String(index).padStart(2, "0")}</span>
        <span>${escapeHtml(locale.navLabels[index])}</span>
      </a>`).join("");
    dom.desktopToc.innerHTML = tocHtml;
    dom.drawerToc.innerHTML = tocHtml;
    if (language !== "en") applySemanticWrapping(dom.article, language);
    document.querySelectorAll(`.language-switcher button`).forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === language));
    });
    bindGeneratedInteractions();
    setActiveSection(targetId);
    updateUrl(language, targetId, false);
    if (preserveScroll) {
      const restoreSection = () => {
        document.getElementById(targetId)?.scrollIntoView({ block: "start", behavior: "instant" });
        setActiveSection(targetId);
        updateUrl(language, targetId, false);
      };
      restoreSection();
      setTimeout(restoreSection, 300);
      setTimeout(restoreSection, 900);
    }
  }

  function placeSectionAssets(sectionId, body, language) {
    const assets = sectionAssets[sectionId] || [];
    if (!assets.length) return;
    if (sectionId === "audit-response") {
      const figure = mediaFigure(assets[0], language);
      const pre = body.querySelector("pre");
      if (pre) pre.insertAdjacentElement("afterend", figure);
      else body.appendChild(figure);
      return;
    }
    if (sectionId === "foundation") {
      const layers = mediaFigure(assets[0], language);
      const loop = mediaFigure(assets[1], language);
      const pre = body.querySelector("pre");
      if (pre) pre.insertAdjacentElement("afterend", layers);
      else body.appendChild(layers);
      body.appendChild(loop);
      return;
    }
    assets.forEach((asset) => body.appendChild(asset.type === "grid" || asset.type === "feedback" ? mediaGrid(asset, language) : mediaFigure(asset, language)));
  }

  function applySemanticWrapping(root, language) {
    const selector = "p, li, h2, h3, figcaption, .toc-nav span:last-child, .project-card-copy strong";
    root.querySelectorAll(selector).forEach((element) => {
      if (element.closest("pre, code, a, button") || element.children.length > 0) return;
      wrapTextNode(element, language);
    });
  }

  function wrapTextNode(element, language) {
    const text = element.textContent;
    if (!/[\u3400-\u9fff]/.test(text)) return;
    const units = semanticUnits(text, language);
    if (units.length < 2) return;
    element.textContent = "";
    units.forEach((unit) => {
      const span = document.createElement("span");
      span.className = "semantic-unit";
      span.textContent = unit;
      element.appendChild(span);
    });
  }

  function semanticUnits(text, language) {
    const segmenter = new Intl.Segmenter(language, { granularity: "word" });
    const phrasePattern = new RegExp(`(${protectedPhrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
    const resolved = text.split(phrasePattern).filter(Boolean).flatMap((part) => {
      if (protectedPhrases.includes(part)) return [part];
      return [...segmenter.segment(part)].map((segment) => segment.segment);
    });
    const units = [];
    const prefixWords = new Set(["和", "与", "與", "及", "以及", "或", "并", "並", "在", "从", "從", "到", "为", "為", "由", "把", "被", "让", "讓", "将", "將", "对", "對", "向", "以", "而", "但", "则", "則"]);
    const closingPunctuation = /^[，。；：、！？）」』】》,.;:!?)]$/;
    const openingPunctuation = /^[（「『【《“‘(]$/;
    const quantityPrefix = /^(?:[一二三四五六七八九十两兩这這那每各]+(?:条條个個项項轮輪套次组組段层層类類种種份位))$/;
    let prefix = "";
    for (let index = 0; index < resolved.length; index += 1) {
      const token = resolved[index];
      if (!token) continue;
      if (/^\s+$/.test(token)) {
        prefix += token;
        continue;
      }
      if (closingPunctuation.test(token) && units.length) {
        units[units.length - 1] += token;
        continue;
      }
      if (openingPunctuation.test(token)) {
        prefix += token;
        continue;
      }
      if (/^\d+(?:\.\d+)?$/.test(token)) {
        let lookAhead = index + 1;
        let between = "";
        while (lookAhead < resolved.length && /^\s+$/.test(resolved[lookAhead])) {
          between += resolved[lookAhead];
          lookAhead += 1;
        }
        if (lookAhead < resolved.length && /^(?:年|月|日|个|個|条|條|项|項|轮|輪|次|%|％)$/.test(resolved[lookAhead])) {
          units.push(prefix + token + between + resolved[lookAhead]);
          prefix = "";
          index = lookAhead;
          continue;
        }
      }
      if (token === "的" && units.length && resolved[index + 1]) {
        prefix = units.pop() + token;
        continue;
      }
      if (prefixWords.has(token) || quantityPrefix.test(token)) {
        prefix += token;
        continue;
      }
      units.push(prefix + token);
      prefix = "";
    }
    if (prefix) {
      if (units.length) units[units.length - 1] += prefix;
      else units.push(prefix);
    }
    return units;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setActiveSection(sectionId) {
    const nextSection = normaliseSection(sectionId);
    const sectionChanged = nextSection !== activeSection;
    activeSection = nextSection;
    document.querySelectorAll("[data-section-link]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.sectionLink === activeSection);
      if (link.dataset.sectionLink === activeSection) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    if (sectionChanged || (!sectionEngagementTimer && !sectionEngagementCounts.has(activeSection))) {
      scheduleSectionEngagement(activeSection);
    }
  }

  function scheduleSectionEngagement(sectionId) {
    clearTimeout(sectionEngagementTimer);
    sectionEngagementTimer = undefined;
    if (document.visibilityState !== "visible") return;
    sectionEngagementTimer = setTimeout(() => {
      sectionEngagementTimer = undefined;
      if (document.visibilityState !== "visible" || activeSection !== sectionId) return;
      const engagementNumber = (sectionEngagementCounts.get(sectionId) || 0) + 1;
      sectionEngagementCounts.set(sectionId, engagementNumber);
      engagedSections.add(sectionId);
      sectionEngagementsTotal += 1;
      const measuredActiveTimeMs = activeTimeMs + (activeClockStartedAt === null ? 0 : performance.now() - activeClockStartedAt);
      analytics.track("portfolio_section_engaged", {
        section_id: sectionId,
        engagement_number: engagementNumber,
        is_reentry: engagementNumber > 1,
        max_scroll_depth_percent: Math.round(maxScrollDepthPercent),
        active_time_ms: Math.round(measuredActiveTimeMs),
        sections_engaged_unique: engagedSections.size,
        section_engagements_total: sectionEngagementsTotal
      });
    }, 4000);
  }

  function sectionAtViewport() {
    const threshold = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) + 140;
    const sections = [...document.querySelectorAll(".article-section")];
    let current = sections[0]?.id || "background";
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) current = section.id;
      else break;
    }
    return current;
  }

  function observeSections() {
    sectionObserver?.disconnect();
    sectionObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      if (Date.now() < navigationLockUntil) return;
      const sectionId = sectionAtViewport();
      if (sectionId !== activeSection) {
        setActiveSection(sectionId);
        updateUrl(activeLanguage, sectionId, false);
      }
    }, { rootMargin: "-22% 0px -66% 0px", threshold: [0, 0.1] });
    document.querySelectorAll(".article-section").forEach((section) => sectionObserver.observe(section));
  }

  function bindGeneratedInteractions() {
    document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
      button.addEventListener("click", () => openLightbox(button));
    });
    document.querySelectorAll("#drawer-toc a").forEach((link) => link.addEventListener("click", closeDrawer));
    document.querySelectorAll("[data-section-link], .section-pager a").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const sectionId = normaliseSection(link.getAttribute("href").slice(1));
        analytics.track("portfolio_section_navigated", {
          from_section_id: activeSection,
          to_section_id: sectionId,
          navigation_kind: link.closest(".section-pager") ? "section_pager" : "table_of_contents"
        });
        navigationLockUntil = Date.now() + 1200;
        setActiveSection(sectionId);
        updateUrl(activeLanguage, sectionId, false);
        document.getElementById(sectionId)?.scrollIntoView({ block: "start", behavior: "instant" });
      });
    });
  }

  function openLightbox(button) {
    const image = button.querySelector("img");
    analytics.track("portfolio_image_opened", {
      section_id: button.closest(".article-section")?.id || "hero",
      asset_name: button.dataset.lightboxSrc.split("/").pop() || "image"
    });
    dom.lightboxImage.src = button.dataset.lightboxSrc;
    dom.lightboxImage.alt = image?.alt || "";
    dom.lightboxCaption.textContent = button.dataset.lightboxCaption || image?.alt || "";
    dom.lightbox.showModal();
  }

  function openDrawer() {
    dom.backdrop.hidden = false;
    dom.drawer.setAttribute("aria-hidden", "false");
    dom.menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("drawer-open");
    requestAnimationFrame(() => {
      dom.drawer.classList.add("is-open");
      dom.drawerClose.focus();
    });
  }

  function closeDrawer() {
    dom.drawer.classList.remove("is-open");
    dom.drawer.setAttribute("aria-hidden", "true");
    dom.menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("drawer-open");
    setTimeout(() => { dom.backdrop.hidden = true; }, 200);
  }

  function handleScroll() {
    const root = document.documentElement;
    const available = root.scrollHeight - root.clientHeight;
    const scrollDepthPercent = available > 0 ? (root.scrollTop / available) * 100 : 0;
    maxScrollDepthPercent = Math.max(maxScrollDepthPercent, scrollDepthPercent);
    dom.progress.style.width = `${scrollDepthPercent}%`;
    dom.topButton.classList.toggle("is-visible", root.scrollTop > 700);
    if (Date.now() >= navigationLockUntil) {
      const current = sectionAtViewport();
      if (current !== activeSection) {
        setActiveSection(current);
        updateUrl(activeLanguage, current, false);
      }
    }
  }

  document.querySelectorAll(".language-switcher button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.lang !== activeLanguage) {
        const nextLanguage = button.dataset.lang;
        analytics.track("portfolio_language_changed", {
          from_language: activeLanguage,
          to_language: nextLanguage,
          section_id: activeSection
        });
        const sectionFromUrl = location.hash.slice(1);
        setActiveSection(sectionFromUrl ? normaliseSection(sectionFromUrl) : sectionAtViewport());
        render(nextLanguage, true);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = new URL(link.href, location.href);
    const label = link.textContent || link.getAttribute("aria-label") || "link";
    if (href.pathname.toLowerCase().endsWith(".pdf")) {
      analytics.track("portfolio_pdf_downloaded", {
        section_id: link.closest(".article-section")?.id || "header",
        asset_name: href.pathname.split("/").pop() || "portfolio.pdf"
      });
      return;
    }
    if (href.origin !== location.origin) {
      analytics.track("portfolio_outbound_link_opened", {
        section_id: link.closest(".article-section")?.id || "page",
        link_kind: link.classList.contains("project-link") ? "project" : "reference",
        link_label: label,
        destination_host: href.host,
        destination_path: href.pathname
      });
    }
  });
  dom.menuButton.addEventListener("click", openDrawer);
  dom.drawerClose.addEventListener("click", closeDrawer);
  dom.backdrop.addEventListener("click", closeDrawer);
  dom.topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  dom.lightboxClose.addEventListener("click", () => dom.lightbox.close());
  dom.lightbox.addEventListener("click", (event) => {
    if (event.target === dom.lightbox) dom.lightbox.close();
  });
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (activeClockStartedAt === null) activeClockStartedAt = performance.now();
      scheduleSectionEngagement(activeSection);
    } else {
      clearTimeout(sectionEngagementTimer);
      sectionEngagementTimer = undefined;
      if (activeClockStartedAt !== null) {
        activeTimeMs += performance.now() - activeClockStartedAt;
        activeClockStartedAt = null;
      }
    }
  });
  window.addEventListener("pagehide", () => {
    if (summarySent) return;
    if (activeClockStartedAt !== null) {
      activeTimeMs += performance.now() - activeClockStartedAt;
      activeClockStartedAt = null;
    }
    summarySent = true;
    analytics.track("portfolio_reading_summary", {
      section_id: activeSection,
      max_scroll_depth_percent: Math.round(maxScrollDepthPercent),
      active_time_ms: Math.round(activeTimeMs),
      sections_engaged_unique: engagedSections.size,
      section_engagements_total: sectionEngagementsTotal
    }, { transport: "sendBeacon" });
  });
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    summarySent = false;
    if (activeClockStartedAt === null) activeClockStartedAt = performance.now();
    scheduleSectionEngagement(activeSection);
  });
  window.addEventListener("popstate", () => {
    const nextLanguage = getInitialLanguage();
    activeSection = normaliseSection(location.hash.slice(1));
    if (nextLanguage !== activeLanguage) render(nextLanguage, true);
    else document.getElementById(activeSection)?.scrollIntoView();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dom.drawer.classList.contains("is-open")) closeDrawer();
    if (event.key === "Escape" && dom.lightbox.open) dom.lightbox.close();
  });

  render(activeLanguage, Boolean(location.hash));
  handleScroll();
})();
