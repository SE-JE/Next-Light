import { useEffect, useState } from "react";

// ==============================>
// ## Search with typing reference
// ==============================>
export const useLazySearch = (keyword: string) => {
  const [keywordSearch, setKeywordSearch]  =  useState("");
  const [doSearch, setDoSearch]            =  useState(false);

  useEffect(() => {
    if (keyword != undefined) {
      const delaySearch  =  setTimeout(() => setDoSearch(!doSearch), 500);
      
      return () => clearTimeout(delaySearch);
    }
  }, [keyword]);

  useEffect(() => setKeywordSearch(keyword), [doSearch]);

  return [keywordSearch];
};
