import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogueClient from "./CatalogueClient";

export const metadata: Metadata = {
	title: "Products | Farmers Choice",
	description:
		"Browse Farmers Choice agriculture products including organic fertilizers, bio fertilizers, micronutrients and soil health solutions.",
};

export default function CataloguePage() {
	return (
		<Suspense fallback={<div style={{ padding: 40 }}>Loading products…</div>}>
			<CatalogueClient />
		</Suspense>
	);
}
