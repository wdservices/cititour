import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  robots?: string;
  structuredData?: Record<string, any> | Array<Record<string, any>> | string;
}

const setMeta = (attr: { name?: string; property?: string }, content: string) => {
  const selector = attr.name ? `meta[name="${attr.name}"]` : `meta[property="${attr.property}"]`;
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    if (attr.name) tag.setAttribute("name", attr.name);
    if (attr.property) tag.setAttribute("property", attr.property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setLinkCanonical = (href: string) => {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const SEO_LD_ID = "seo-jsonld";

const setStructuredData = (data: SEOProps["structuredData"]) => {
  if (!data) return;
  // Remove previous SEO-injected scripts
  document.head.querySelectorAll(`script[data-seo="${SEO_LD_ID}"]`).forEach(n => n.remove());
  const arr = Array.isArray(data) ? data : [data];
  arr.forEach((item) => {
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-seo", SEO_LD_ID);
    script.textContent = typeof item === "string" ? item : JSON.stringify(item);
    document.head.appendChild(script);
  });
};

const SEO = ({ title, description, keywords, canonicalUrl, ogImage, ogType, robots, structuredData }: SEOProps) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta({ property: "og:title" }, title);
      setMeta({ name: "twitter:title" }, title);
    }
    if (description) {
      setMeta({ name: "description" }, description);
      setMeta({ property: "og:description" }, description);
      setMeta({ name: "twitter:description" }, description);
    }
    if (keywords && keywords.length) setMeta({ name: "keywords" }, keywords.join(", "));
    if (canonicalUrl) {
      setLinkCanonical(canonicalUrl);
      setMeta({ property: "og:url" }, canonicalUrl);
    }
    if (ogImage) {
      setMeta({ property: "og:image" }, ogImage);
      setMeta({ name: "twitter:image" }, ogImage);
      setMeta({ name: "twitter:card" }, "summary_large_image");
    }
    if (ogType) setMeta({ property: "og:type" }, ogType);
    setMeta({ name: "robots" }, robots || "index, follow");
    if (structuredData) setStructuredData(structuredData);
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, robots, structuredData]);

  return null;
};

export default SEO;
