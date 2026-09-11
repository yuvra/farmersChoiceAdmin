import Link from "next/link";
import type { Solution } from "@/data/solutions";

export default function SolutionCard({ solution }: { solution: Solution }) {
	const href = solution.relatedProductSlugs[0]
		? `/catalogue/${solution.relatedProductSlugs[0]}`
		: "/catalogue";

	return (
		<article className="fcCard" style={{ padding: "1.25rem" }}>
			<h3
				style={{
					margin: "0 0 0.5rem",
					fontFamily: "var(--font-display), Georgia, serif",
					fontSize: "1.15rem",
					color: "var(--fc-forest)",
				}}
			>
				{solution.title}
			</h3>
			<p
				style={{
					margin: "0 0 1rem",
					color: "var(--fc-muted)",
					fontSize: "0.94rem",
					lineHeight: 1.55,
				}}
			>
				{solution.description}
			</p>
			<Link href={href} className="fcBtn fcBtnSecondary">
				View Related Products
			</Link>
		</article>
	);
}
