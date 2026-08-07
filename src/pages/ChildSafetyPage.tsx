import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";

function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <h4 className="font-display text-lg font-bold pr-4">{question}</h4>
        {open ? <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 shrink-0 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground space-y-3">{children}</div>}
    </div>
  );
}

export default function ChildSafetyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Child Safety Standards Policy — Citivas"
        description="Citivas is committed to protecting children from sexual abuse and exploitation. Learn about our Child Safety Standards policy, reporting mechanisms, and compliance."
        canonicalUrl="/child-safety"
      />

      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/citivas-logo.png" alt="Citivas" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-display text-2xl font-extrabold">Citivas</span>
            </Link>
            <span className="text-muted-foreground text-sm hidden md:inline">/</span>
            <span className="text-sm font-medium hidden md:inline">Child Safety</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-full hidden md:flex">
              <Link to="/contact-support">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
        <div className="mb-8">
          <Link to="/docs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Help Center
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">Child Safety Standards Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: August 2026</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">

          <section>
            <h2 className="font-display text-2xl font-extrabold mb-4">Our Commitment to Child Safety</h2>
            <p className="text-muted-foreground leading-relaxed">
              Citivas is committed to protecting children from sexual abuse and exploitation. We do not tolerate the creation, distribution, or promotion of child sexual abuse material (CSAM) on our platform, and we take every report of suspected child exploitation seriously.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              This policy explains our standards, how to report a concern, and how we respond.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold mb-4">Our Standards Against Child Sexual Abuse and Exploitation (CSAE)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Citivas strictly prohibits:</p>
            <ul className="space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Uploading, sharing, or requesting child sexual abuse material (CSAM) in any form, on any part of the platform (chat, listings, images, profiles, or messages)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Grooming, sexual solicitation, or exploitation of a minor</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Using Citivas — including our chat, marketplace, or business listing features — to facilitate contact with a minor for any exploitative purpose</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Any content or behavior that sexualizes, endangers, or exploits a child</span>
              </li>
            </ul>
            <div className="mt-4 rounded-xl bg-red-500/5 border border-red-500/10 p-4">
              <p className="text-sm text-muted-foreground">
                Any account found violating these standards will be immediately suspended, its content removed, and — where legally required or appropriate — reported to the National Center for Missing & Exploited Children (NCMEC), the Nigeria Police Force, NAPTIP (National Agency for the Prohibition of Trafficking in Persons), or other relevant law enforcement authorities.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold mb-4">How to Report a Concern</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you encounter content or behavior on Citivas that you believe involves child sexual abuse or exploitation, you can report it:
            </p>
            <div className="rounded-xl bg-muted/50 border border-border p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="font-bold text-foreground">In-app:</span>
                <span className="text-muted-foreground">Use the "Report" option available on chat conversations, business listings, and marketplace items</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-foreground">By email:</span>
                <span className="text-muted-foreground">childsafety@citivas.com</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Reports are reviewed by our safety team as a priority. We do not require you to have an account to submit a report, and we do not disclose your identity to the reported party.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold mb-4">How We Handle Reports and CSAM</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When a report is received or CSAM is otherwise detected on our platform, we:
            </p>
            <ol className="space-y-3 text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs mt-0.5">1</span>
                <span>Immediately remove the content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs mt-0.5">2</span>
                <span>Suspend the associated account pending investigation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs mt-0.5">3</span>
                <span>Preserve evidence as required for law enforcement reporting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs mt-0.5">4</span>
                <span>Report to NCMEC and/or relevant local authorities where legally required or appropriate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs mt-0.5">5</span>
                <span>Do not re-view, redistribute, or forward CSAM content internally beyond what is strictly necessary for legal reporting obligations</span>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold mb-4">Compliance with Child Safety Laws</h2>
            <p className="text-muted-foreground leading-relaxed">
              Citivas complies with applicable child safety laws, including reporting obligations under Nigerian law and, where applicable to our platform's reach, U.S. federal law (18 U.S.C. § 2258A) governing electronic service providers' obligations to report apparent CSAM to NCMEC.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold mb-4">Child Safety Point of Contact</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For law enforcement inquiries, regulatory questions, or escalated child safety concerns, contact:
            </p>
            <div className="rounded-xl bg-muted/50 border border-border p-5 space-y-1">
              <p className="font-bold text-foreground">Bluewaves Technology</p>
              <p className="text-muted-foreground">Email: childsafety@citivas.com</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem question="What category of apps are in scope for this policy?">
                <p>This policy applies to Anonymous or Random Chat apps, and apps in the Social and Dating categories on Google Play.</p>
              </FaqItem>
              <FaqItem question="How do I know if my app is considered an Anonymous or Random chat app or part of the Social or Dating category?">
                <p>Google Play categorizes apps based on their functionality. If your app enables user-to-user communication, allows user-generated content, or facilitates social interactions, it may fall under this policy. Check your app's Play Console listing for its assigned category.</p>
              </FaqItem>
              <FaqItem question="What if my app is not for kids or does not allow kid users?">
                <p>Even if your app is not designed for children or is age-gated, you may still be in scope if it allows user-generated content or user-to-user interactions. Child safety requirements apply broadly to protect all users.</p>
              </FaqItem>
              <FaqItem question="What if my app is just for adults?">
                <p>Adult-only apps are not exempt from child safety requirements. You must still have published standards against CSAE, provide in-app reporting mechanisms, and comply with child safety laws.</p>
              </FaqItem>
              <FaqItem question="What if my app is age-gated?">
                <p>Age-gating alone does not exempt your app from compliance. You must still meet all Child Safety Standards requirements.</p>
              </FaqItem>
              <FaqItem question="What are the requirements for the CSAE published standards?">
                <p>Your published standards must clearly state a zero-tolerance policy against CSAE, describe prohibited behaviors and content, outline consequences for violations, and explain how users can report violations.</p>
              </FaqItem>
              <FaqItem question="What kinds of in-app mechanisms should my app have? Can users report through an email or form?">
                <p>Apps must provide an easily accessible in-app mechanism for users to report content or behavior that may constitute CSAE or CSAM. Email or web forms alone are not sufficient — the reporting mechanism must be integrated into the app itself.</p>
              </FaqItem>
              <FaqItem question="What does it mean to take 'appropriate action' to address CSAM?">
                <p>Appropriate action includes immediately removing the content, suspending the associated account, preserving evidence for law enforcement, reporting to NCMEC and/or local authorities, and not redistributing the material internally beyond what is strictly necessary.</p>
              </FaqItem>
              <FaqItem question="Do these standards align with global norms on child safety standards?">
                <p>Yes. These standards align with frameworks developed by the Tech Coalition, INHOPE, NCMEC, and international best practices for combating online child sexual exploitation.</p>
              </FaqItem>
            </div>
          </section>

        </div>

        <div className="mt-16 p-8 md:p-12 rounded-2xl bg-muted/50 border border-border text-center">
          <h3 className="font-display text-2xl font-extrabold mb-3">Need to report a concern?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            If you encounter content or behavior involving child safety on Citivas, report it immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="rounded-full">
              <Link to="/contact-support">Contact Support</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <a href="mailto:childsafety@citivas.com">
                <ExternalLink className="w-4 h-4 mr-2" />
                Email childsafety@citivas.com
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
