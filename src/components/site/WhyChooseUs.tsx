import SectionTitle from "./SectionTitle";

const items = [
	{
		title: "Quality Tested Products",
		text: "Carefully selected agri inputs focused on dependable farm performance.",
	},
	{
		title: "Farmer-Focused Solutions",
		text: "Practical products chosen for real field needs, not catalogue filler.",
	},
	{
		title: "Better Soil Health",
		text: "Organic and biological options that support long-term soil condition.",
	},
	{
		title: "Sustainable Agriculture",
		text: "Inputs aligned with sustainable and responsible farming practices.",
	},
	{
		title: "Reliable Crop Nutrition",
		text: "Nutrition support across growth stages for field and horticulture crops.",
	},
	{
		title: "Technical Guidance",
		text: "Help selecting suitable products based on crop and farm requirements.",
	},
	{
		title: "Competitive Pricing",
		text: "Value-focused pricing for farmers, dealers and agri businesses.",
	},
	{
		title: "Trusted Agricultural Inputs",
		text: "A clear, honest product range for everyday farm decision-making.",
	},
];

export default function WhyChooseUs() {
	return (
		<section className="fcSection fcSectionAlt" id="why-us">
			<div className="fcContainer">
				<SectionTitle
					kicker="Why Farmers Choice"
					title="Built for trust in the field"
					lead="We focus on quality inputs, practical guidance and products that support soil health, plant nutrition and sustainable productivity."
				/>
				<div className="fcGrid4">
					{items.map((item) => (
						<article
							key={item.title}
							className="fcCard"
							style={{ padding: "1.25rem" }}
						>
							<h3
								style={{
									margin: "0 0 0.45rem",
									fontFamily: "var(--font-display), Georgia, serif",
									fontSize: "1.08rem",
									color: "var(--fc-forest)",
								}}
							>
								{item.title}
							</h3>
							<p
								style={{
									margin: 0,
									color: "var(--fc-muted)",
									fontSize: "0.92rem",
									lineHeight: 1.55,
								}}
							>
								{item.text}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
