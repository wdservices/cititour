import { Link } from "react-router-dom";
import { MapPin, Star, UtensilsCrossed, BedDouble, ShieldCheck } from "lucide-react";
import { MiniSite, formatNaira, MINI_SITE_TYPE_LABEL } from "@/content/miniSites";

interface Props {
  site: MiniSite;
  compact?: boolean;
}

/**
 * Unified card for every mini-site surface (marketplace, stays listing,
 * category pages) so restaurants and stays never drift apart visually.
 */
const MiniSiteCard = ({ site, compact = false }: Props) => {
  const isFood = site.type === "restaurant";
  const Icon = isFood ? UtensilsCrossed : BedDouble;

  return (
    <Link
      to={`/m/${site.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <div className={`relative overflow-hidden ${compact ? "h-36" : "h-44"}`}>
        <img
          src={site.cover}
          alt={`${site.name} — ${MINI_SITE_TYPE_LABEL[site.type]} in ${site.city}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-foreground">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {MINI_SITE_TYPE_LABEL[site.type]}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-semibold text-background">
          <Star className="h-3 w-3 fill-current text-primary" />
          {site.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {site.name}
          </h3>
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-label="Verified listing" />
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{site.tagline}</p>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{site.city}</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-semibold text-foreground">
            {formatNaira(site.priceFrom)}
            <span className="text-xs font-normal text-muted-foreground">
              {isFood ? " avg / plate" : " / night"}
            </span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {isFood ? "Order" : "Book"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MiniSiteCard;
