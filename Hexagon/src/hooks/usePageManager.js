import { useCallback, useRef, useState } from "react";
import { PageStatus, createPage, duplicateToOtherLanguage, validatePage } from "../data/pageModel";
import { getSeedPages } from "../data/seedPages";

const STORAGE_KEY = "hexagon-pages";
const SEEDED_KEY = "hexagon-pages-seeded";
// tăng version khi getSeedPages() có thêm trang mới -> browser đã seed bản cũ
// sẽ merge phần thiếu (không đụng trang admin tự tạo/sửa/xoá)
const SEED_VERSION = "2";

// seeding is tracked by its own flag, not by whether STORAGE_KEY exists:
// dev builds wrote "[]" before seeds existed, so key-presence can't tell
// "never seeded" apart from "admin deleted everything on purpose"
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

  return existing;
}

export function usePageManager() {
  const [pages, setPages] = useState(loadPages);
  const pagesRef = useRef(pages);

  // lưu đồng bộ ngay trong event handler — lưu qua useEffect sẽ mất dữ liệu
  // nếu caller navigate() ngay sau đó (component unmount trước khi effect chạy)
  const commit = useCallback((next) => {
    pagesRef.current = next;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setPages(next);
  }, []);

  const addPage = useCallback(
    (pageInput) => {
      const page = createPage(pageInput);
      const check = validatePage(page);
      if (!check.valid) throw new Error(`Invalid page: ${check.errors.join(", ")}`);
      commit([...pagesRef.current, page]);
      return page;
    },
    [commit]
  );

  const updatePage = useCallback(
    (id, changes) => {
      commit(
        pagesRef.current.map((p) =>
          p.id === id ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p
        )
      );
    },
    [commit]
  );

  const deletePage = useCallback(
    (id) => {
      commit(pagesRef.current.filter((p) => p.id !== id));
    },
    [commit]
  );

  const publishPage = useCallback(
    (id) => {
      updatePage(id, { status: PageStatus.PUBLISHED });
    },
    [updatePage]
  );

  const unpublishPage = useCallback(
    (id) => {
      updatePage(id, { status: PageStatus.DRAFT });
    },
    [updatePage]
  );

  const duplicatePage = useCallback(
    (id) => {
      const source = pagesRef.current.find((p) => p.id === id);
      if (!source) throw new Error(`Page ${id} not found`);
      const newPage = duplicateToOtherLanguage(source, pagesRef.current);
      commit([...pagesRef.current, newPage]);
      return newPage;
    },
    [commit]
  );

  return {
    pages,
    addPage,
    updatePage,
    deletePage,
    publishPage,
    unpublishPage,
    duplicatePage,
  };
}
