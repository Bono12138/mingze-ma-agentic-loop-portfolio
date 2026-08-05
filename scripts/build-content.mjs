import { readFile, writeFile } from "node:fs/promises";
import { marked } from "marked";

const locales = {
  "zh-Hans": {
    source: "content/zh-Hans.md",
    htmlLang: "zh-Hans",
    shortName: "简体中文",
    eyebrow: "项目履历 · 金融风险与 AI 工具落地",
    summary: "金融风险、系统、数据与流程的交叉工作。从安永的 IT 控制与系统审阅，到 Akulaku Group 的 ECL、操作风险管理与 Agent 工具落地。",
    mobileSummary: ["金融风险、系统、数据与流程", "安永的 IT 控制与系统审阅", "Akulaku Group 的 ECL", "操作风险管理与 Agent 工具落地"],
    titleLines: {
      desktop: ["从 Copilot 到 Agentic Loop", "AI 工具落地与基础设施搭建经历"],
      mobile: ["Copilot 实践", "Agentic Loop 实践", "AI 工具落地", "基础设施搭建经历"]
    },
    navLabels: ["工作背景", "0630 ECL 更新", "审计回应架构", "Superset 查询工具", "从工具到分层设计", "四层能力与知识底座", "Bono Insight 插件", "分享与快速落地案例", "流程的来源", "公开链接"],
    roles: ["ECL 与操作风险", "ITGC、ITAC 与系统控制", "Agentic Engineering"],
    labels: {
      contents: "目录",
      menu: "打开目录",
      close: "关闭目录",
      read: "阅读项目经历",
      download: "下载三语言 PDF",
      pdf: "PDF",
      language: "语言",
      progress: "阅读进度",
      top: "返回顶部",
      skip: "跳到正文",
      openImage: "放大查看图片",
      closeImage: "关闭图片",
      visit: "访问线上版本",
      repository: "查看公开仓库",
      liveEvidence: "真实上线页面",
      document: "三语言项目履历",
      updated: "整理于 2026 年 8 月",
      previous: "上一节",
      next: "下一节"
    }
  },
  "zh-Hant": {
    source: "content/zh-Hant.md",
    htmlLang: "zh-Hant",
    shortName: "繁體中文",
    eyebrow: "項目履歷 · 金融風險與 AI 工具落地",
    summary: "金融風險、系統、數據與流程的交叉工作。從安永的 IT 控制與系統審閱，到 Akulaku Group 的 ECL、操作風險管理與 Agent 工具落地。",
    mobileSummary: ["金融風險、系統、數據與流程", "安永的 IT 控制與系統審閱", "Akulaku Group 的 ECL", "操作風險管理與 Agent 工具落地"],
    titleLines: {
      desktop: ["從 Copilot 到 Agentic Loop", "AI 工具落地與基礎設施搭建經歷"],
      mobile: ["Copilot 實踐", "Agentic Loop 實踐", "AI 工具落地", "基礎設施搭建經歷"]
    },
    navLabels: ["工作背景", "0630 ECL 更新", "審計回應架構", "Superset 查詢工具", "從工具到分層設計", "四層能力與知識底座", "Bono Insight 插件", "分享與快速落地案例", "流程的來源", "公開連結"],
    roles: ["ECL 與操作風險", "ITGC、ITAC 與系統控制", "Agentic Engineering"],
    labels: {
      contents: "目錄",
      menu: "打開目錄",
      close: "關閉目錄",
      read: "閱讀項目經歷",
      download: "下載三語言 PDF",
      pdf: "PDF",
      language: "語言",
      progress: "閱讀進度",
      top: "返回頂部",
      skip: "跳到正文",
      openImage: "放大查看圖片",
      closeImage: "關閉圖片",
      visit: "訪問線上版本",
      repository: "查看公開倉庫",
      liveEvidence: "真實上線頁面",
      document: "三語言項目履歷",
      updated: "整理於 2026 年 8 月",
      previous: "上一節",
      next: "下一節"
    }
  },
  en: {
    source: "content/en.md",
    htmlLang: "en",
    shortName: "English",
    eyebrow: "Project experience · Financial risk and AI tool delivery",
    summary: "Work across financial risk, systems, data and process: from IT controls and systems review at EY to ECL, operational risk and Agent tooling at Akulaku Group.",
    mobileSummary: ["Financial risk, systems, data and process", "IT controls and systems review at EY", "ECL and operational risk at Akulaku Group", "Agent tooling in live workflows"],
    titleLines: {
      desktop: ["From Copilot to the Agentic Loop", "Delivering AI Tools", "Building the Supporting Infrastructure"],
      mobile: ["Copilot", "Agentic Loop", "AI Tool Delivery", "Supporting Infrastructure"]
    },
    navLabels: ["Professional background", "The 0630 ECL update", "Audit-response architecture", "Superset query tool", "From tool to architecture", "Four-layer foundation", "Bono Insight plugin", "Sharing and rapid delivery", "Where processes come from", "Public links"],
    roles: ["ECL and operational risk", "ITGC, ITAC and systems control", "Agentic engineering"],
    labels: {
      contents: "Contents",
      menu: "Open contents",
      close: "Close contents",
      read: "Read the project experience",
      download: "Download the trilingual PDF",
      pdf: "PDF",
      language: "Language",
      progress: "Reading progress",
      top: "Back to top",
      skip: "Skip to the article",
      openImage: "Open image",
      closeImage: "Close image",
      visit: "Visit the live site",
      repository: "View public repository",
      liveEvidence: "Live production page",
      document: "Trilingual project portfolio",
      updated: "Prepared in August 2026",
      previous: "Previous section",
      next: "Next section"
    }
  }
};

const sectionIds = [
  "background",
  "ecl-update",
  "audit-response",
  "superset-tool",
  "architecture-evolution",
  "foundation",
  "insight-plugin",
  "supporting-cases",
  "process-origins",
  "public-links"
];

marked.setOptions({
  gfm: true,
  breaks: false
});

function cleanMarkdown(markdown) {
  return markdown
    .replace(/^!\[[^\]]*\]\([^\n)]+\)\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n");
}

function normaliseLinks(html) {
  return html
    .replace(/href="(https?:\/\/[^\"]+)"/g, 'href="$1" target="_blank" rel="noreferrer"')
    .replace(/<a href="(https?:\/\/[^\"]+)" target="_blank" rel="noreferrer">\1<\/a>/g, '<a class="url-link" href="$1" target="_blank" rel="noreferrer">$1</a>');
}

function parseDocument(markdown) {
  const cleaned = cleanMarkdown(markdown.trim());
  const firstLineEnd = cleaned.indexOf("\n");
  const title = cleaned.slice(2, firstLineEnd).trim();
  const rest = cleaned.slice(firstLineEnd + 1).trim();
  const parts = rest.split(/^## /gm);
  const byline = parts.shift().trim();
  const sections = parts.map((part, index) => {
    const headingEnd = part.indexOf("\n");
    const heading = part.slice(0, headingEnd).trim();
    const body = part.slice(headingEnd + 1).trim();
    return {
      id: sectionIds[index],
      heading,
      html: normaliseLinks(marked.parse(body))
    };
  });
  if (sections.length !== sectionIds.length) {
    throw new Error(`Expected ${sectionIds.length} sections, found ${sections.length}`);
  }
  return { title, byline, sections };
}

const siteContent = {};
for (const [locale, config] of Object.entries(locales)) {
  const markdown = await readFile(config.source, "utf8");
  siteContent[locale] = {
    ...config,
    ...parseDocument(markdown)
  };
}

const output = `window.PORTFOLIO_CONTENT = ${JSON.stringify(siteContent, null, 2)};\n`;
await writeFile("assets/content-data.js", output, "utf8");
console.log("Built assets/content-data.js");
