"use client";

import { useState, useEffect } from "react";

// tracks a media query as a boolean. `defaultValue` is what's returned on
// the server/first paint, before `window` exists - the effect corrects it
// to the real value as soon as it mounts.
export function useMediaQuery(query: string, defaultValue: boolean) {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    function onChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
