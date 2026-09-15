import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageIntro({ label, title, description }: { label: string; title: string; description: string }) {
  return <header className="page-intro"><div className="site-container"><p className="label text-primary">{label}</p><h1>{title}</h1><p>{description}</p></div></header>;
}
export function StartBand({ title = "Bring the idea. We’ll map the system." }: { title?: string }) {
  return <section className="start-band"><div className="site-container"><p className="label text-primary">Begin</p><h2>{title}</h2><Button asChild><Link to="/start-your-project">Start your project <ArrowRight size={16} /></Link></Button></div></section>;
}
export function Meta({ label }: { label: string }) { return <span className="label text-primary">{label}</span>; }
