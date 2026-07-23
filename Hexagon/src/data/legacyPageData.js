import { puckConfig } from "../puck.config";

// các hàm load/build puckData của những trang tĩnh cũ, chuyển từ App.jsx sang đây
// để seedPages.js cũng dùng được (mirror trang cũ vào Page Manager).
// tất cả đều là hàm (không phải const module-level) vì file này nằm trong vòng
// import puck.config → Header → usePageManager → seedPages → đây → puck.config

export const homeStorageKey = "puck-data-home";

function buildHomeInitialData() {
  return {
    content: [
      { type: "Hero", props: { ...puckConfig.components.Hero.defaultProps, id: "Hero-1" } },
      { type: "About", props: { ...puckConfig.components.About.defaultProps, id: "About-1" } },
      { type: "Services", props: { ...puckConfig.components.Services.defaultProps, id: "Services-1" } },
      { type: "News", props: { ...puckConfig.components.News.defaultProps, id: "News-1" } },
      { type: "Partners", props: { ...puckConfig.components.Partners.defaultProps, id: "Partners-1" } },
      { type: "Contact", props: { ...puckConfig.components.Contact.defaultProps, id: "Contact-1" } },
    ],
    root: {},
  };
}

export function loadHomeData() {
  const saved = localStorage.getItem(homeStorageKey);
  return saved ? JSON.parse(saved) : buildHomeInitialData();
}

export function serviceStorageKey(slug) {
  return `puck-data-service-${slug}`;
}

export function buildServiceInitialData(page) {
  return {
    content: [
      {
        type: "ServiceHero",
        props: {
          ...puckConfig.components.ServiceHero.defaultProps,
          reverse: page.reverse ?? "false",
          title: page.title,
          description: page.description,
          imageUrl: page.image,
          imageAlt: page.title,
          id: `ServiceHero-${page.slug}`,
        },
      },
      {
        type: "ServiceFeatures",
        props: {
          ...puckConfig.components.ServiceFeatures.defaultProps,
          features: page.features,
          id: `ServiceFeatures-${page.slug}`,
        },
      },
      {
        type: "ServiceSteps",
        props: {
          ...puckConfig.components.ServiceSteps.defaultProps,
          steps: page.steps.map((value) => ({ value })),
          id: `ServiceSteps-${page.slug}`,
        },
      },
      {
        type: "ServiceCta",
        props: {
          ...puckConfig.components.ServiceCta.defaultProps,
          id: `ServiceCta-${page.slug}`,
        },
      },
    ],
    root: {},
  };
}

export function loadServiceData(page) {
  const saved = localStorage.getItem(serviceStorageKey(page.slug));
  return saved ? JSON.parse(saved) : buildServiceInitialData(page);
}

export const newsListStorageKey = "puck-data-news-list";

export function loadNewsListData() {
  const saved = localStorage.getItem(newsListStorageKey);
  if (saved) return JSON.parse(saved);
  return {
    content: [
      { type: "NewsListIntro", props: { ...puckConfig.components.NewsListIntro.defaultProps, id: "NewsListIntro-1" } },
    ],
    root: {},
  };
}

export function newsArticleStorageKey(slug) {
  return `puck-data-news-article-${slug}`;
}

export function buildNewsArticleInitialData(article) {
  return {
    content: [
      {
        type: "NewsArticleContent",
        props: {
          ...puckConfig.components.NewsArticleContent.defaultProps,
          title: article.title,
          date: article.date,
          time: article.time ?? "",
          image: article.image ?? "",
          imageAlt: article.title,
          body: (article.body ?? [article.excerpt]).map((text) => ({ text })),
          hashtags: (article.hashtags ?? []).map((tag) => ({ tag })),
          showCompanyInfo: article.showCompanyInfo ?? false,
          id: `NewsArticleContent-${article.slug}`,
        },
      },
    ],
    root: {},
  };
}

export function loadNewsArticleData(article) {
  const saved = localStorage.getItem(newsArticleStorageKey(article.slug));
  return saved ? JSON.parse(saved) : buildNewsArticleInitialData(article);
}
