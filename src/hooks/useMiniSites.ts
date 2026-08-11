import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MINI_SITES, MiniSite } from "@/content/miniSites";

/**
 * Mini sites come from a curated seed list. Anything an admin deletes in the
 * dashboard is recorded in `mini_site_removals/{slug}` so the removal is
 * reflected here too. Firestore failures degrade gracefully to the full list.
 */
export function useMiniSites() {
  const [sites, setSites] = useState<MiniSite[]>(MINI_SITES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const snap = await getDocs(collection(db, "mini_site_removals"));
        const removed = new Set(snap.docs.map((d) => d.id));
        if (active) setSites(MINI_SITES.filter((s) => !removed.has(s.slug)));
      } catch {
        if (active) setSites(MINI_SITES);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { sites, loading };
}
