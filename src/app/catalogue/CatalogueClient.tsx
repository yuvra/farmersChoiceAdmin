"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SiteShell from "@/components/site/SiteShell";
import SectionTitle from "@/components/site/SectionTitle";
import ProductCard from "@/components/site/ProductCard";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export default function CatalogueClient() {
	const params = useSearchParams();
	const initialCategory = params.get("category") || "all";
	const [category, setCategory] = useState(initialCategory);
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		return products.filter((p) => {
			const matchedCategory = categories.find((c) => c.slug === category);
			const catOk =
				category === "all" ||
				p.categoryId === category ||
				matchedCategory?.id === p.categoryId;
			const q = query.trim().toLowerCase();
			const qOk =
				!q ||
				p.name.toLowerCase().includes(q) ||
				p.shortDescription.toLowerCase().includes(q) ||
				p.categoryName.toLowerCase().includes(q);
			return catOk && qOk;
		});
	}, [category, query]);

	return (
		<SiteShell>
			<section className="fcSection">
				<div className="fcContainer">
					<SectionTitle
						kicker="Products"
						title="Explore Farmers Choice products"
						lead="Filter by category or search by product name. Enquire on WhatsApp for pricing and availability."
					/>

					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "0.75rem",
							marginBottom: "1.5rem",
						}}
					>
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search products…"
							style={{
								flex: "1 1 220px",
								padding: "0.75rem 0.9rem",
								borderRadius: 10,
								border: "1px solid var(--fc-line)",
								font: "inherit",
							}}
						/>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							style={{
								padding: "0.75rem 0.9rem",
								borderRadius: 10,
								border: "1px solid var(--fc-line)",
								font: "inherit",
								minWidth: 200,
							}}
						>
							<option value="all">All categories</option>
							{categories.map((c) => (
								<option key={c.id} value={c.slug}>
									{c.name}
								</option>
							))}
						</select>
					</div>

					{filtered.length === 0 ? (
						<p style={{ color: "var(--fc-muted)" }}>No products found.</p>
					) : (
						<div className="fcGrid3">
							{filtered.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</div>
			</section>
		</SiteShell>
	);
}
