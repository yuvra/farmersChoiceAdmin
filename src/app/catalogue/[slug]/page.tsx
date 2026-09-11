import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import ProductCard from "@/components/site/ProductCard";
import SectionTitle from "@/components/site/SectionTitle";
import {
	getProductBySlug,
	getRelatedProducts,
	products,
} from "@/data/products";
import { whatsappLink } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
	return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const product = getProductBySlug(slug);
	if (!product) return { title: "Product | Farmers Choice" };
	return {
		title: `${product.name} | Farmers Choice`,
		description: product.shortDescription,
	};
}

export default async function ProductDetailPage({ params }: Props) {
	const { slug } = await params;
	const product = getProductBySlug(slug);
	if (!product) notFound();

	const related = getRelatedProducts(product);
	const enquire = whatsappLink(
		`Hello Farmers Choice, I want to enquire about ${product.name}.`
	);

	return (
		<SiteShell>
			<section className="fcSection">
				<div className="fcContainer">
					<p style={{ marginBottom: "1rem" }}>
						<Link
							href="/catalogue"
							style={{ color: "var(--fc-green)", fontWeight: 600 }}
						>
							← Back to products
						</Link>
					</p>

					<div
						style={{
							display: "grid",
							gap: "1.75rem",
							gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
							alignItems: "start",
						}}
					>
						<img
							src={product.image}
							alt={product.name}
							style={{
								width: "100%",
								borderRadius: 14,
								objectFit: "cover",
								aspectRatio: "4 / 3",
								boxShadow: "var(--fc-shadow)",
							}}
						/>
						<div>
							<span className="fcMeta">{product.categoryName}</span>
							<h1
								style={{
									margin: "0 0 0.8rem",
									fontFamily: "var(--font-display), Georgia, serif",
									fontSize: "clamp(2rem, 4vw, 2.8rem)",
									color: "var(--fc-forest-deep)",
									letterSpacing: "-0.03em",
								}}
							>
								{product.name}
							</h1>
							<p className="fcLead" style={{ marginBottom: "1.2rem" }}>
								{product.shortDescription}
							</p>
							<p style={{ color: "var(--fc-muted)", marginBottom: "1rem" }}>
								<strong style={{ color: "var(--fc-forest)" }}>Pack sizes:</strong>{" "}
								{product.packSizes.join(" · ")}
							</p>
							<div className="fcActions">
								<a
									href={enquire}
									target="_blank"
									rel="noopener noreferrer"
									className="fcBtn fcBtnPrimary"
								>
									Enquire Now
								</a>
								<a
									href={enquire}
									target="_blank"
									rel="noopener noreferrer"
									className="fcBtn fcBtnSecondary"
								>
									WhatsApp
								</a>
							</div>
						</div>
					</div>

					<div
						style={{
							display: "grid",
							gap: "1.25rem",
							marginTop: "2.5rem",
							gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
						}}
					>
						<article className="fcCard" style={{ padding: "1.25rem" }}>
							<h2
								style={{
									margin: "0 0 0.7rem",
									fontFamily: "var(--font-display), Georgia, serif",
									fontSize: "1.25rem",
									color: "var(--fc-forest)",
								}}
							>
								Overview
							</h2>
							<p style={{ margin: 0, color: "var(--fc-muted)", lineHeight: 1.6 }}>
								{product.overview}
							</p>
						</article>
						<article className="fcCard" style={{ padding: "1.25rem" }}>
							<h2
								style={{
									margin: "0 0 0.7rem",
									fontFamily: "var(--font-display), Georgia, serif",
									fontSize: "1.25rem",
									color: "var(--fc-forest)",
								}}
							>
								Benefits
							</h2>
							<ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--fc-muted)", lineHeight: 1.55 }}>
								{product.benefits.map((b) => (
									<li key={b}>{b}</li>
								))}
							</ul>
						</article>
						<article className="fcCard" style={{ padding: "1.25rem" }}>
							<h2
								style={{
									margin: "0 0 0.7rem",
									fontFamily: "var(--font-display), Georgia, serif",
									fontSize: "1.25rem",
									color: "var(--fc-forest)",
								}}
							>
								Recommended crops
							</h2>
							<p style={{ margin: 0, color: "var(--fc-muted)", lineHeight: 1.6 }}>
								{product.recommendedCrops.join(", ")}
							</p>
						</article>
						<article className="fcCard" style={{ padding: "1.25rem" }}>
							<h2
								style={{
									margin: "0 0 0.7rem",
									fontFamily: "var(--font-display), Georgia, serif",
									fontSize: "1.25rem",
									color: "var(--fc-forest)",
								}}
							>
								Application / usage
							</h2>
							<p style={{ margin: 0, color: "var(--fc-muted)", lineHeight: 1.6 }}>
								{product.applicationNote}
							</p>
						</article>
					</div>

					{related.length > 0 ? (
						<div style={{ marginTop: "3rem" }}>
							<SectionTitle
								kicker="Related"
								title="Related products"
							/>
							<div className="fcGrid3">
								{related.map((p) => (
									<ProductCard key={p.id} product={p} />
								))}
							</div>
						</div>
					) : null}
				</div>
			</section>
		</SiteShell>
	);
}
