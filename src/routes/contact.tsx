import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { PageIntro } from "@/components/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact GSTPIXEL" },
      {
        name: "description",
        content:
          "Contact GSTPIXEL by phone, WhatsApp, or email, or start a guided project enquiry.",
      },
      { property: "og:title", content: "Contact GSTPIXEL" },
      {
        property: "og:description",
        content:
          "Reach GSTPIXEL by phone, WhatsApp, or email, or start a guided project enquiry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro
        label="Contact"
        title="Start right. Stay compliant. Grow online."
        description="Reach GSTPIXEL directly, or use the guided enquiry to build a clear project summary first."
      />
      <section className="content-band">
        <div className="site-container detail-grid">
          <div>
            <p className="label text-primary">Guided route</p>
            <h2>Build a clear project summary.</h2>
            <p>
              The enquiry adapts to websites, applications, automation, GST,
              FSSAI, registration, compliance, consultancy, or help choosing.
              Your answers stay editable and travel with you as context.
            </p>
            <Button asChild className="mt-6">
              <Link to="/start-your-project">
                Start your project <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          <div>
            <p className="label text-primary">Direct contact</p>
            <h2>GSTPIXEL</h2>
            <ul className="big-list">
              <li>
                Ashis Gurung, Business Consultant
              </li>
              <li>
                India:{" "}
                <a className="underline underline-offset-4" href="tel:+919046520548">
                  +91 90465 20548
                </a>{" "}
                ·{" "}
                <a className="underline underline-offset-4" href="tel:+918116076725">
                  +91 81160 76725
                </a>
              </li>
              <li>
                Bhutan:{" "}
                <a className="underline underline-offset-4" href="tel:+97577260538">
                  +975 77260538
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-4"
                  href="mailto:support@gstpixel.com"
                >
                  support@gstpixel.com
                </a>
              </li>
              <li>
                Ramgaon, Near Anthony School, Jaigaon – 736182
              </li>
              <li>GSTIN: 19ESPPG2569P1ZP</li>
            </ul>
            <Button asChild variant="quiet" className="mt-6">
              <a
                href="https://wa.me/919046520548"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </Button>
            <p className="mt-6 text-sm text-muted-foreground">
              GSTPIXEL is an independent business and is not a government
              portal. Compliance-related support does not constitute legal
              advice; confirm official requirements with the relevant
              authorities.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
