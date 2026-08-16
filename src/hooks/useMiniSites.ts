import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MINI_SITES, MiniSite, propertyDocToMiniSite } from "@/content/miniSites";

/**
 * Mini sites combine two sources:
 *  1. the curated seed catalogue (`listedBy: "admin"`), and
 *  2. properties users list from the dashboard (`house_listings`), mapped
 *     onto the exact same MiniSite shape so both render identically.
 * Anything an admin deletes is recorded in `mini_site_removals/{slug}`.
 * Firestore failures degrade gracefully to the seed list.
 */
export function useMiniSites() {
  const [sites, setSites] = useState<MiniSite[]>(MINI_SITES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [removalRes, propRes] = await Promise.allSettled([
          getDocs(collection(db, "mini_site_removals")),
          getDocs(collection(db, "house_listings")),
        ]);
        const removed = new Set(
          removalRes.status === "fulfilled" ? removalRes.value.docs.map((d) => d.id) : []
        );
        const userSites =
          propRes.status === "fulfilled"
            ? propRes.value.docs.map((d) => propertyDocToMiniSite(d.id, d.data() as any))
            : [];
        const all = [...userSites, ...MINI_SITES].filter((s) => !removed.has(s.slug));
        if (active) setSites(all);
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
