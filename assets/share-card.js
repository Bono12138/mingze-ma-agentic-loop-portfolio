(function () {
  const copy = {
    "zh-Hans": {
      htmlLang: "zh-Hans",
      eyebrow: "项目履历速览",
      title: "Copilot → Agentic Loop\nAI 工具落地\n基础设施搭建经历",
      summary: "金融风险、系统、数据与流程\nECL 与操作风险 · IT 控制 · Agentic Engineering",
      name: "马铭泽",
      domains: ["ECL 与操作风险", "ITGC、ITAC 与系统控制", "Agent 工具与流程"],
      case1Title: "ECL 项目交付\n审计回应架构",
      case1Body: "Agent 参与取数、计算、检查与交付。\n调查、决策、实施和终审分别留痕。",
      case2Title: "查询工具抽象\n四层能力底座",
      case2Body: "把 Superset 查询抽成可复用工具，\n再分出任务、方法、原子能力和依据。",
      case3Title: "Bono Insight 插件\n快速落地案例",
      case3Body: "Bono Insight 以 Codex 插件发布。\n辅助案例均为真实工具或上线页面。",
      scan: "扫描查看完整内容",
      footerTitle: "三语言网站与项目履历 PDF"
    },
    "zh-Hant": {
      htmlLang: "zh-Hant",
      eyebrow: "項目履歷速覽",
      title: "Copilot → Agentic Loop\nAI 工具落地\n基礎設施搭建經歷",
      summary: "金融風險、系統、數據與流程\nECL 與操作風險 · IT 控制 · Agentic Engineering",
      name: "馬銘澤",
      domains: ["ECL 與操作風險", "ITGC、ITAC 與系統控制", "Agent 工具與流程"],
      case1Title: "ECL 項目交付\n審計回應架構",
      case1Body: "Agent 參與取數、計算、檢查與交付。\n調查、決策、實施和終審分別留痕。",
      case2Title: "查詢工具抽象\n四層能力底座",
      case2Body: "把 Superset 查詢抽成可重用工具，\n再分出任務、方法、原子能力和依據。",
      case3Title: "Bono Insight 插件\n快速落地案例",
      case3Body: "Bono Insight 以 Codex 插件發佈。\n輔助案例均為真實工具或上線頁面。",
      scan: "掃描查看完整內容",
      footerTitle: "三語言網站與項目履歷 PDF"
    },
    en: {
      htmlLang: "en",
      eyebrow: "Project experience at a glance",
      title: "Copilot → Agentic Loop\nAI Tool Delivery\nSupporting Infrastructure",
      summary: "Financial risk, systems, data and process\nECL and operational risk · IT controls · Agentic engineering",
      name: "Mingze Ma",
      domains: ["ECL and operational risk", "ITGC, ITAC and systems control", "Agent tooling and process"],
      case1Title: "ECL project delivery\nAudit-response architecture",
      case1Body: "Agents support retrieval, calculation, control checks and delivery.\nInvestigation, decision, implementation and final review remain separate.",
      case2Title: "Query-tool abstraction\nFour-layer foundation",
      case2Body: "Superset execution became a reusable capability.\nTasks, methods, atomic tools and evidence are maintained separately.",
      case3Title: "Bono Insight plugin\nRapid delivery cases",
      case3Body: "Bono Insight is distributed as a Codex plugin.\nThe supporting cases are real tools or live pages.",
      scan: "Scan to view the full portfolio",
      footerTitle: "Trilingual website and project portfolio PDF"
    }
  };

  const language = new URLSearchParams(location.search).get("lang") || "zh-Hans";
  const active = copy[language] || copy["zh-Hans"];
  document.documentElement.lang = active.htmlLang;
  document.querySelectorAll("[data-copy]").forEach((element) => {
    element.textContent = active[element.dataset.copy];
  });
  document.querySelector("#card-domains").innerHTML = active.domains.map((domain, index) => `<div class="card-domain"><span>0${index + 1}</span><span>${domain}</span></div>`).join("");
  const suffix = language === "zh-Hans" ? "sc" : language === "zh-Hant" ? "tc" : "en";
  document.querySelector("[data-image='audit']").src = `assets/images/audit-${suffix}.png`;
  document.querySelector("[data-image='layers']").src = `assets/images/layers-${suffix}.png`;
})();
