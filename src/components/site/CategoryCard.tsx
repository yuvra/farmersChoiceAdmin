import Link from "next/link";
import type { Category } from "@/data/categories";

export default function CategoryCard({ category }: { category: Category }) {
	return (
		<article className="fcCard">
			<img
				src={category.image}
				alt={category.name}
				className="fcCardImg"
				loading="lazy"
			/>
			<div className="fcCardBody">
				<h3>{category.name}</h3>
				<p>{category.description}</p>
				<Link
					href={`/catalogue?category=${category.slug}`}
					className="fcBtn fcBtnSecondary"
				>
					View Products
				</Link>
			</div>
		</article>
	);
}
