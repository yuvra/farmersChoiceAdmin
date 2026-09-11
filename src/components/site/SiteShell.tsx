import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import "./site.css";

export default function SiteShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="fcSite">
			<Header />
			<main>{children}</main>
			<Footer />
			<WhatsAppButton />
		</div>
	);
}
