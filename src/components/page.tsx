import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export function ScrollReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-intro">
      <div className="site-container">
        <p className="label text-primary">{label}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}
export function StartBand({
  title = "Bring the idea. We’ll map the system.",
}: {
  title?: string;
}) {
  return (
    <section className="start-band">
      <div className="site-container">
        <p className="label text-primary">Begin</p>
        <h2>{title}</h2>
        <Button asChild>
          <Link to="/start-your-project">
            Start your project <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </section>
  );
}
export function Meta({ label }: { label: string }) {
  return <span className="label text-primary">{label}</span>;
}
