import { testimonials } from "@/data/testimonials";
import SectionTitle from "./SectionTitle";

export default function Testimonials() {
	return (
		<section className="fcSection">
			<div className="fcContainer">
				<SectionTitle
					kicker="Testimonials"
					title="What growers say"
					lead="Demo testimonials for layout only — replace with real customer feedback before public marketing use."
				/>
				<div className="fcGrid3">
					{testimonials.map((t) => (
						<article
							key={t.id}
							className="fcCard"
							style={{ padding: "1.35rem" }}
						>
							<p
								style={{
									margin: "0 0 1rem",
									fontSize: "0.78rem",
									fontWeight: 700,
									letterSpacing: "0.08em",
									textTransform: "uppercase",
									color: "var(--fc-green-mid)",
								}}
							>
								Demo content
							</p>
							<p
								style={{
									margin: "0 0 1.1rem",
									fontFamily: "var(--font-display), Georgia, serif",
									fontSize: "1.15rem",
									lineHeight: 1.45,
									color: "var(--fc-forest-deep)",
								}}
							>
								“{t.quote}”
							</p>
							<strong style={{ color: "var(--fc-forest)" }}>{t.name}</strong>
							<p
								style={{
									margin: "0.2rem 0 0",
									color: "var(--fc-muted)",
									fontSize: "0.9rem",
								}}
							>
								{t.role} · {t.location}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
