import Link from "next/link";
import type { Product } from "@/data/products";
import { whatsappLink } from "@/config/site";

export default function ProductCard({ product }: { product: Product }) {
	const enquireMsg = `Hello Farmers Choice, I want to enquire about ${product.name}.`;

	return (
		<article className="fcCard">
			<img
				src={product.image}
				alt={product.name}
				className="fcCardImg"
				loading="lazy"
			/>
			<div className="fcCardBody">
				<span className="fcMeta">{product.categoryName}</span>
				<h3>{product.name}</h3>
				<p>{product.shortDescription}</p>
				<p style={{ marginTop: "-0.35rem" }}>
					<strong style={{ color: "var(--fc-forest)" }}>Packs:</strong>{" "}
					{product.packSizes.join(" · ")}
				</p>
				<ul
					style={{
						margin: "0 0 1rem",
						paddingLeft: "1.1rem",
						color: "var(--fc-muted)",
						fontSize: "0.9rem",
						lineHeight: 1.45,
					}}
				>
					{product.benefits.slice(0, 3).map((b) => (
						<li key={b}>{b}</li>
					))}
				</ul>
				<div className="fcActions">
					<Link
						href={`/catalogue/${product.slug}`}
						className="fcBtn fcBtnSecondary"
					>
						View Details
					</Link>
					<a
						href={whatsappLink(enquireMsg)}
						target="_blank"
						rel="noopener noreferrer"
						className="fcBtn fcBtnPrimary"
					>
						Enquire Now
					</a>
				</div>
			</div>
		</article>
	);
}
