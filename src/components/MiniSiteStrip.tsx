import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MiniSiteCard from "@/components/MiniSiteCard";
import { useMiniSites } from "@/hooks/useMiniSites";
import type { MiniSiteType } from "@/content/miniSites";

interface Props {
  types: MiniSiteType[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  limit?: number;
}

/**
 * Reusable strip of mini-website businesses, shared by the hotel, shortlet
 * and restaurant listing pages so all three surfaces stay identical.
 */
const MiniSiteStrip = ({ types, eyebrow = "Mini websites", title, subtitle, limit = 3 }: Props) => {
  const navigate = useNavigate();
  const { sites } = useMiniSites();
  const results = sites.filter((s) => types.includes(s.type)).slice(0, limit);

  if (results.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
          <h2 className="text-xl font-bold leading-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <button
          onClick={() => navigate("/mini-sites")}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          See all <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((site) => (
          <MiniSiteCard key={site.slug} site={site} compact />
        ))}
      </div>
    </section>
  );
};

export default MiniSiteStrip;
