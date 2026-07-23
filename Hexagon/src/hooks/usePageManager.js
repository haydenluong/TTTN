import { useCallback, useRef, useState } from "react";
import { PageStatus, PageTemplate, createPage, createTranslation, nextPageId, validatePage } from "../data/pageModel";
import { buildPageHref, childSegment } from "../utils/pageUrl";
import { getSeedPages } from "../data/seedPages";

const STORAGE_KEY = "hexagon-pages";
const TRASH_KEY = "hexagon-pages-trash";
const SEEDED_KEY = "hexagon-pages-seeded";
// tăng version khi getSeedPages() có thêm trang mới -> browser đã seed bản cũ
// sẽ merge phần thiếu (không đụng trang admin tự tạo/sửa/xoá)
const SEED_VERSION = "2";
// bump lên mỗi khi sửa logic migrate bên dưới, kể cả browser đã migrate rồi
// cũng chạy lại (vd lần sửa href cứng trong nội dung Services/News)
const MIGRATED_KEY = "hexagon-pages-id-migration";
const MIGRATION_VERSION = "3";

const KNOWN_CHILD_SEGMENTS = ["dich-vu", "tin-tuc", "services", "news"];

// bỏ đúng 1 đoạn cha ở đầu slug nếu có, để ra lại href gốc trước khi có đoạn cha
// (vd "tin-tuc/hoat-dong/xyz" -> "hoat-dong/xyz")
function stripKnownSegment(slug) {
  const parts = slug.split("/");
  return KNOWN_CHILD_SEGMENTS.includes(parts[0]) ? parts.slice(1).join("/") : slug;
}

// nội dung Puck cũ (block Services, News trên trang chủ) có href gõ tay trỏ thẳng
// tới trang dịch vụ/bài viết (vd "/giai-phap-cong-nghe", "/hoat-dong/xyz") từ trước
// khi có đoạn cha trong url — quét cây content của trang chủ, thay bằng href thật
// (buildPageHref) của từng trang con
function fixChildHrefs(pages) {
  for (const home of pages.filter((p) => p.template === PageTemplate.HOME)) {
    const children = pages.filter(
      (p) =>
        p.parentId &&
        p.lang === home.lang &&
        (p.template === PageTemplate.SERVICE || p.template === PageTemplate.ARTICLE)
    );
    if (children.length === 0) continue;
    const hrefMap = new Map();
    for (const child of children) {
      hrefMap.set(`/${stripKnownSegment(child.slug)}`, buildPageHref(child));
    }
    walkAndFixHrefs(home.puckData, hrefMap);
  }
}

function walkAndFixHrefs(node, hrefMap) {
  if (!node || typeof node !== "object") return;
  if (typeof node.href === "string" && hrefMap.has(node.href)) {
    node.href = hrefMap.get(node.href);
  }
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") walkAndFixHrefs(value, hrefMap);
  }
}

// dữ liệu cũ: mỗi bản dịch có id riêng, nối với bản gốc qua translationOf.
// dữ liệu mới: bản gốc + bản dịch dùng chung 1 id, phân biệt bằng lang.
// hàm này gom từng cặp gốc/dịch cũ lại và phát cho cả cặp 1 id số tăng dần mới.
function migrateToSharedIds(pages) {
  const groups = new Map(); // old identity (translationOf ?? id) -> pages sharing it
  for (const p of pages) {
    const key = p.translationOf ?? p.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }

  let counter = 1;
  const migrated = [];
  for (const [key, group] of groups) {
    const seenLangs = new Set();
    let groupId = null;
    for (const p of group) {
      let idToUse;
      if (!seenLangs.has(p.lang)) {
        if (groupId === null) groupId = String(counter++);
        idToUse = groupId;
        seenLangs.add(p.lang);
      } else {
        // 2 bản dịch cùng ngôn ngữ trỏ về 1 gốc (lỗi dữ liệu cũ) -> tách riêng, không xoá
        console.warn(
          `[migration] duplicate ${p.lang} translation for group "${key}" (slug "${p.slug}") — giving it its own id`
        );
        idToUse = String(counter++);
      }
      const { translationOf, ...rest } = p;
      migrated.push({
        ...rest,
        id: idToUse,
        parentId: rest.parentId ?? null,
        autoSlug: rest.autoSlug ?? false,
      });
    }
  }

  // dữ liệu cũ chưa từng có parentId — suy ra bằng cách khớp template cùng ngôn ngữ
  // (mỗi ngôn ngữ chỉ có 1 trang chủ / 1 danh sách bài viết), rồi ráp thêm đoạn cha
  // vào đầu slug nếu chưa có (vd "giai-phap-cong-nghe" -> "dich-vu/giai-phap-cong-nghe")
  for (const p of migrated) {
    if (p.parentId) continue;
    const wantsParentTemplate =
      p.template === PageTemplate.SERVICE
        ? PageTemplate.HOME
        : p.template === PageTemplate.ARTICLE
          ? PageTemplate.NEWS_LIST
          : null;
    if (!wantsParentTemplate) continue;
    const parent = migrated.find((par) => par.lang === p.lang && par.template === wantsParentTemplate);
    if (!parent) continue;
    p.parentId = parent.id;
    const segment = childSegment(parent.template, p.lang);
    if (segment && !p.slug.startsWith(`${segment}/`)) {
      p.slug = `${segment}/${p.slug}`;
    }
  }

  fixChildHrefs(migrated);

  return migrated;
}

function loadPages() {
  let existing = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) existing = JSON.parse(raw);
  } catch {
    existing = [];
  }

  if (localStorage.getItem(SEEDED_KEY) !== SEED_VERSION) {
    const seeds = getSeedPages().filter(
      (s) => !existing.some((p) => p.id === s.id || p.slug === s.slug)
    );
    existing = [...existing, ...seeds];
    localStorage.setItem(SEEDED_KEY, SEED_VERSION);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }

  if (localStorage.getItem(MIGRATED_KEY) !== MIGRATION_VERSION) {
    existing = migrateToSharedIds(existing);
    localStorage.setItem(MIGRATED_KEY, MIGRATION_VERSION);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }

  return existing;
}

function loadTrash() {
  try {
    const raw = localStorage.getItem(TRASH_KEY);
    return raw !== null ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function usePageManager() {
  const [pages, setPages] = useState(loadPages);
  const pagesRef = useRef(pages);

  const [trash, setTrash] = useState(loadTrash);
  const trashRef = useRef(trash);

  // lưu đồng bộ ngay trong event handler — lưu qua useEffect sẽ mất dữ liệu
  // nếu caller navigate() ngay sau đó (component unmount trước khi effect chạy)
  const commit = useCallback((next) => {
    pagesRef.current = next;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setPages(next);
  }, []);

  const commitTrash = useCallback((next) => {
    trashRef.current = next;
    localStorage.setItem(TRASH_KEY, JSON.stringify(next));
    setTrash(next);
  }, []);

  const addPage = useCallback(
    (pageInput) => {
      const page = createPage({ ...pageInput, id: pageInput.id ?? nextPageId(pagesRef.current) });
      const check = validatePage(page);
      if (!check.valid) throw new Error(`Invalid page: ${check.errors.join(", ")}`);
      commit([...pagesRef.current, page]);
      return page;
    },
    [commit]
  );

  // id không còn là duy nhất theo từng dòng (bản vi/en dùng chung) -> phải kèm lang
  const updatePage = useCallback(
    (id, lang, changes) => {
      commit(
        pagesRef.current.map((p) =>
          p.id === id && p.lang === lang ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p
        )
      );
    },
    [commit]
  );

  // xoá mềm: chuyển sang trash, không mất dữ liệu ngay
  const deletePage = useCallback(
    (id, lang) => {
      const target = pagesRef.current.find((p) => p.id === id && p.lang === lang);
      if (!target) return;
      commit(pagesRef.current.filter((p) => !(p.id === id && p.lang === lang)));
      commitTrash([...trashRef.current, { ...target, deletedAt: new Date().toISOString() }]);
    },
    [commit, commitTrash]
  );

  const publishPage = useCallback(
    (id, lang) => {
      updatePage(id, lang, { status: PageStatus.PUBLISHED });
    },
    [updatePage]
  );

  const unpublishPage = useCallback(
    (id, lang) => {
      updatePage(id, lang, { status: PageStatus.DRAFT });
    },
    [updatePage]
  );

  // tạo bản dịch cho page có id này — page nào cũng có thể sinh ra bản còn thiếu
  const createTranslationPage = useCallback(
    (id, targetLang, overrides) => {
      const source = pagesRef.current.find((p) => p.id === id && p.lang !== targetLang);
      if (!source) throw new Error(`Page ${id} not found`);
      const newPage = createTranslation(source, targetLang, pagesRef.current, overrides);
      commit([...pagesRef.current, newPage]);
      return newPage;
    },
    [commit]
  );

  // còn bản còn lại (vi hoặc en) giữ id này thì khôi phục về id cũ,
  // không thì phát id mới (max hiện tại + 1)
  const restorePage = useCallback(
    (id, lang) => {
      const entry = trashRef.current.find((p) => p.id === id && p.lang === lang);
      if (!entry) return null;
      const idStillLive = pagesRef.current.some((p) => p.id === id);
      const restoredId = idStillLive ? id : nextPageId(pagesRef.current);
      const { deletedAt, ...page } = entry;
      const restored = { ...page, id: restoredId, updatedAt: new Date().toISOString() };
      commit([...pagesRef.current, restored]);
      commitTrash(trashRef.current.filter((p) => !(p.id === id && p.lang === lang)));
      return restored;
    },
    [commit, commitTrash]
  );

  const restoreAllPages = useCallback(() => {
    let working = [...pagesRef.current];
    for (const entry of trashRef.current) {
      const idStillLive = working.some((p) => p.id === entry.id);
      const restoredId = idStillLive ? entry.id : nextPageId(working);
      const { deletedAt, ...page } = entry;
      working = [...working, { ...page, id: restoredId, updatedAt: new Date().toISOString() }];
    }
    commit(working);
    commitTrash([]);
  }, [commit, commitTrash]);

  const purgeTrashPage = useCallback(
    (id, lang) => {
      commitTrash(trashRef.current.filter((p) => !(p.id === id && p.lang === lang)));
    },
    [commitTrash]
  );

  const purgeAllTrash = useCallback(() => commitTrash([]), [commitTrash]);

  return {
    pages,
    trash,
    addPage,
    updatePage,
    deletePage,
    publishPage,
    unpublishPage,
    createTranslation: createTranslationPage,
    restorePage,
    restoreAllPages,
    purgeTrashPage,
    purgeAllTrash,
  };
}
