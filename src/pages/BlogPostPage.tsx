import type { ReactNode } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { postBySlug } from "@/content/blog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

// Ultra-light markdown renderer: supports ## headings, - lists, [text](url) links, **bold**, paragraphs.
function renderMarkdown(md: string) {
  const blocks = md.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return <h2 key={i} className="font-display text-2xl md:text-3xl font-bold mt-10 mb-4">{block.slice(3)}</h2>;
    }
    if (/^-\s+/m.test(block)) {
      const items = block.split(/\n/).filter(l => l.trim().startsWith("-"));
      return (
        <ul key={i} className="list-disc list-outside pl-6 space-y-2 my-4 text-muted-foreground">
          {items.map((li, j) => <li key={j}>{inline(li.replace(/^-\s+/, ""))}</li>)}
        </ul>
      );
    }
    return <p key={i} className="my-4 text-muted-foreground leading-relaxed">{inline(block)}</p>;
  });
}

function inline(text: string): ReactNode {
  // links
  const parts: ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      const isInternal = m[2].startsWith("/");
      parts.push(isInternal
        ? <Link key={key++} to={m[2]} className="text-primary underline underline-offset-2">{m[1]}</Link>
        : <a key={key++} href={m[2]} className="text-primary underline underline-offset-2">{m[1]}</a>);
    } else if (m[3]) {
      parts.push(<strong key={key++} className="text-foreground font-semibold">{m[3]}</strong>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? postBySlug(slug) : null;
  if (!post) return <Navigate to="/blog" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    keywords: post.tags.join(", "),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${post.title} — CitiTour`}
        description={post.excerpt}
        canonicalUrl={`/blog/${post.slug}`}
        ogType="article"
        keywords={post.tags}
        structuredData={jsonLd}
      />

      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold">CitiTour</Link>
          <Button asChild variant="ghost" size="sm"><Link to="/blog"><ArrowLeft className="w-4 h-4 mr-1" /> Blog</Link></Button>
        </div>
      </header>

      <article className="container mx-auto px-4 max-w-2xl py-16 md:py-24">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{post.tags[0]}</div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight mb-4">{post.title}</h1>
        <p className="text-muted-foreground text-lg mb-6">{post.excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readMinutes} min read</span>
          <span>• {post.author}</span>
        </div>
        <div className="prose prose-lg">{renderMarkdown(post.body)}</div>
      </article>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CitiTour</p>
          <div className="flex gap-6"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div>
        </div>
      </footer>
    </div>
  );
}
