import Link from "next/link";
import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import Hero from "@/components/site/Hero";
import SectionTitle from "@/components/site/SectionTitle";
import CategoryCard from "@/components/site/CategoryCard";
import ProductCard from "@/components/site/ProductCard";
import SolutionCard from "@/components/site/SolutionCard";
import CropCard from "@/components/site/CropCard";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import Testimonials from "@/components/site/Testimonials";
import DealerSection from "@/components/site/DealerSection";
import ContactForm from "@/components/site/ContactForm";
import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/data/products";
import { solutions } from "@/data/solutions";
import { crops } from "@/data/crops";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: "Farmers Choice | Agriculture & Organic Farming Products",
	description: siteConfig.description,
};

const processSteps = [
	{
		n: "01",
		title: "Understand Crop Requirement",
		text: "We start by understanding your crop, soil condition and farming goal.",
	},
	{
		n: "02",
		title: "Recommend Suitable Products",
		text: "We suggest practical products from our agri-input range for your need.",
	},
	{
		n: "03",
		title: "Apply Correct Dosage",
		text: "Follow labelled directions for safe and effective field application.",
	},
	{
		n: "04",
		title: "Monitor Crop Improvement",
		text: "Track crop response and adjust your nutrition program as needed.",
	},
];

export default function HomePage() {
	const featured = getFeaturedProducts();

	return (
		<SiteShell>
			<Hero />

			<section className="fcSection" id="categories">
				<div className="fcContainer">
					<SectionTitle
						kicker="Product Categories"
						title="Agriculture inputs for every farm need"
						lead="Browse organic fertilizers, bio products, micronutrients, soil health solutions and specialty crop nutrition."
					/>
					<div className="fcGrid4">
						{categories.map((category) => (
							<CategoryCard key={category.id} category={category} />
						))}
					</div>
				</div>
			</section>

			<section className="fcSection fcSectionAlt" id="products">
				<div className="fcContainer">
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							gap: "1rem",
							alignItems: "end",
							flexWrap: "wrap",
							marginBottom: "0.5rem",
						}}
					>
						<SectionTitle
							kicker="Featured Products"
							title="Trusted products for healthier crops"
							lead="Explore sample products from our catalogue. Pack sizes and details can be updated anytime from the product data file."
						/>
						<Link href="/catalogue" className="fcBtn fcBtnPrimary">
							View All Products
						</Link>
					</div>
					<div className="fcGrid3">
						{featured.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			</section>

			<WhyChooseUs />

			<section className="fcSection" id="solutions">
				<div className="fcContainer">
					<SectionTitle
						kicker="Agriculture Solutions"
						title="Solutions based on farm requirements"
						lead="Choose a goal and explore related products for soil, roots, flowering, fruiting and crop quality."
					/>
					<div className="fcGrid4">
						{solutions.map((solution) => (
							<SolutionCard key={solution.id} solution={solution} />
						))}
					</div>
				</div>
			</section>

			<section className="fcSection fcSectionAlt" id="crops">
				<div className="fcContainer">
					<SectionTitle
						kicker="Crops We Serve"
						title="Supporting major Indian crops"
						lead="From horticulture to field crops, Farmers Choice products support practical nutrition and soil-care programs."
					/>
					<div className="fcGrid4">
						{crops.map((crop) => (
							<CropCard key={crop.id} crop={crop} />
						))}
					</div>
				</div>
			</section>

			<section className="fcSection" id="about">
				<div className="fcContainer" style={{ maxWidth: 820 }}>
					<SectionTitle
						kicker="About Farmers Choice"
						title="Committed to healthier crops and sustainable productivity"
					/>
					<p className="fcLead" style={{ maxWidth: "48rem" }}>
						Farmers Choice is committed to helping farmers achieve healthier
						crops and sustainable productivity through dependable agricultural
						inputs. We focus on quality, practical farm solutions and products
						that support soil health, plant nutrition and long-term farm
						performance.
					</p>
					<p className="fcLead" style={{ marginTop: "1rem", maxWidth: "48rem" }}>
						Whether you are a farmer, dealer or agri professional, our goal is
						to make product selection clearer and support better decisions in
						the field.
					</p>
				</div>
			</section>

			<section className="fcSection fcSectionAlt" id="how-we-help">
				<div className="fcContainer">
					<SectionTitle
						kicker="How We Help Farmers"
						title="A simple four-step approach"
					/>
					<div className="fcGrid4">
						{processSteps.map((step) => (
							<article
								key={step.n}
								className="fcCard"
								style={{ padding: "1.3rem" }}
							>
								<p
									style={{
										margin: "0 0 0.6rem",
										fontWeight: 700,
										color: "var(--fc-green-mid)",
										letterSpacing: "0.08em",
									}}
								>
									{step.n}
								</p>
								<h3
									style={{
										margin: "0 0 0.45rem",
										fontFamily: "var(--font-display), Georgia, serif",
										fontSize: "1.1rem",
										color: "var(--fc-forest)",
									}}
								>
									{step.title}
								</h3>
								<p
									style={{
										margin: 0,
										color: "var(--fc-muted)",
										fontSize: "0.92rem",
										lineHeight: 1.55,
									}}
								>
									{step.text}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<Testimonials />
			<DealerSection />
			<ContactForm />
		</SiteShell>
	);
}
