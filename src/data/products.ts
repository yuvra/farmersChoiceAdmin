export type Product = {
	id: string;
	slug: string;
	name: string;
	categoryId: string;
	categoryName: string;
	shortDescription: string;
	overview: string;
	benefits: string[];
	recommendedCrops: string[];
	applicationNote: string;
	packSizes: string[];
	image: string;
	featured?: boolean;
	relatedSlugs: string[];
};

export const products: Product[] = [
	{
		id: "trichoderma",
		slug: "trichoderma",
		name: "Trichoderma",
		categoryId: "bio-fungicides",
		categoryName: "Bio Fungicides",
		shortDescription:
			"Beneficial microbial formulation commonly used in soil and root-zone care programs.",
		overview:
			"Trichoderma is a beneficial microbial product used in sustainable farm programs to support healthier soil and root environments. Final usage guidance should follow the product label and local agronomy advice.",
		benefits: [
			"Supports soil biological activity",
			"Useful in root-zone care programs",
			"Fits organic and sustainable practices",
			"Suitable for multiple crop systems",
		],
		recommendedCrops: ["Tomato", "Onion", "Pomegranate", "Vegetables", "Grapes"],
		applicationNote:
			"Application method and dosage depend on crop stage and field conditions. Please refer to the product label or contact Farmers Choice for guidance. Do not treat this page as a dosage recommendation.",
		packSizes: ["250 g", "500 g", "1 kg"],
		image:
			"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80",
		featured: true,
		relatedSlugs: ["organic-soil-conditioner", "bio-npk"],
	},
	{
		id: "humic-acid",
		slug: "humic-acid",
		name: "Humic Acid",
		categoryId: "soil-health",
		categoryName: "Soil Health",
		shortDescription:
			"Organic soil-support input that helps improve nutrient availability and soil condition.",
		overview:
			"Humic Acid is widely used as a soil conditioner and crop nutrition support product. It is valued for helping soils retain nutrients and supporting better plant response when used as part of a balanced program.",
		benefits: [
			"Supports soil structure and conditioning",
			"Helps improve nutrient use efficiency",
			"Useful across field and horticulture crops",
			"Complements regular fertilizer schedules",
		],
		recommendedCrops: ["Sugarcane", "Grapes", "Banana", "Cotton", "Vegetables"],
		applicationNote:
			"Use according to crop requirement and labelled directions. Contact us for crop-specific product selection support.",
		packSizes: ["500 ml", "1 L", "5 L"],
		image:
			"https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80",
		featured: true,
		relatedSlugs: ["seaweed-extract", "organic-soil-conditioner"],
	},
	{
		id: "seaweed-extract",
		slug: "seaweed-extract",
		name: "Seaweed Extract",
		categoryId: "plant-growth-promoters",
		categoryName: "Plant Growth Promoters",
		shortDescription:
			"Natural growth-support extract used to improve plant vigor and stress tolerance programs.",
		overview:
			"Seaweed Extract is a popular plant growth support product used to encourage healthier vegetative growth and better crop response under field conditions.",
		benefits: [
			"Supports plant vigor",
			"Useful during active growth stages",
			"Helps crops cope with field stress",
			"Compatible with many nutrition programs",
		],
		recommendedCrops: ["Grapes", "Tomato", "Pomegranate", "Onion", "Vegetables"],
		applicationNote:
			"Follow labelled instructions for foliar or soil application. This website does not provide verified dosage claims.",
		packSizes: ["250 ml", "500 ml", "1 L"],
		image:
			"https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1000&q=80",
		featured: true,
		relatedSlugs: ["humic-acid", "chelated-micronutrient-mix"],
	},
	{
		id: "chelated-micronutrient-mix",
		slug: "chelated-micronutrient-mix",
		name: "Chelated Micronutrient Mix",
		categoryId: "micronutrients",
		categoryName: "Micronutrients",
		shortDescription:
			"Balanced micronutrient blend for crops showing multi-nutrient deficiency symptoms.",
		overview:
			"Chelated Micronutrient Mix is designed to support crops that need broader micronutrient nutrition as part of a complete crop care plan.",
		benefits: [
			"Supports overall micronutrient balance",
			"Useful for horticulture and field crops",
			"Helps address mixed deficiency symptoms",
			"Easy to include in nutrition schedules",
		],
		recommendedCrops: ["Pomegranate", "Grapes", "Tomato", "Soybean", "Cotton"],
		applicationNote:
			"Select based on soil/leaf observations and agronomy guidance. Always follow the product label.",
		packSizes: ["100 g", "250 g", "500 g", "1 kg"],
		image:
			"https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1000&q=80",
		featured: true,
		relatedSlugs: ["calcium-boron", "magnesium"],
	},
	{
		id: "calcium-boron",
		slug: "calcium-boron",
		name: "Calcium Boron",
		categoryId: "specialty-crop-nutrition",
		categoryName: "Specialty Crop Nutrition",
		shortDescription:
			"Specialty nutrition support often used around flowering and fruit development stages.",
		overview:
			"Calcium Boron is commonly considered in crop programs where flowering, fruit setting and fruit quality support are important.",
		benefits: [
			"Supports flowering and fruiting stages",
			"Useful for fruit quality focused programs",
			"Fits horticulture nutrition schedules",
			"Complements broader micronutrient plans",
		],
		recommendedCrops: ["Pomegranate", "Grapes", "Tomato", "Banana"],
		applicationNote:
			"Application timing depends on crop phenology. Refer to label guidance or request a product consultation.",
		packSizes: ["250 ml", "500 ml", "1 L"],
		image:
			"https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1000&q=80",
		featured: true,
		relatedSlugs: ["chelated-micronutrient-mix", "seaweed-extract"],
	},
	{
		id: "magnesium",
		slug: "magnesium",
		name: "Magnesium",
		categoryId: "micronutrients",
		categoryName: "Micronutrients",
		shortDescription:
			"Magnesium nutrition support for crops needing better green growth and chlorophyll activity.",
		overview:
			"Magnesium products are used when crops need targeted magnesium support within a balanced nutrition plan.",
		benefits: [
			"Supports greener vegetative growth",
			"Helps address magnesium-related symptoms",
			"Useful across many crop types",
			"Works with standard nutrition programs",
		],
		recommendedCrops: ["Sugarcane", "Banana", "Tomato", "Vegetables"],
		applicationNote:
			"Confirm need based on crop symptoms or soil advice. Follow labelled usage only.",
		packSizes: ["1 kg", "5 kg", "25 kg"],
		image:
			"https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80",
		featured: true,
		relatedSlugs: ["chelated-micronutrient-mix", "bio-npk"],
	},
	{
		id: "bio-npk",
		slug: "bio-npk",
		name: "Bio NPK",
		categoryId: "bio-fertilizers",
		categoryName: "Bio Fertilizers",
		shortDescription:
			"Bio-based nutrition support aimed at improving nutrient availability around the root zone.",
		overview:
			"Bio NPK is positioned as a biological support input for farm nutrition programs focused on soil life and nutrient efficiency.",
		benefits: [
			"Supports biological nutrient processes",
			"Complements chemical fertilizer programs",
			"Useful for soil-focused farming",
			"Suitable for multiple cropping systems",
		],
		recommendedCrops: ["Cotton", "Soybean", "Sugarcane", "Vegetables"],
		applicationNote:
			"Use as directed on the product packaging. Farmers Choice can help you choose the right pack size.",
		packSizes: ["500 ml", "1 L", "5 L"],
		image:
			"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
		featured: true,
		relatedSlugs: ["trichoderma", "organic-soil-conditioner"],
	},
	{
		id: "organic-soil-conditioner",
		slug: "organic-soil-conditioner",
		name: "Organic Soil Conditioner",
		categoryId: "organic-fertilizers",
		categoryName: "Organic Fertilizers",
		shortDescription:
			"Organic conditioner to support soil texture, moisture handling and long-term soil health.",
		overview:
			"Organic Soil Conditioner is intended to support healthier soils as part of sustainable farm management and organic input programs.",
		benefits: [
			"Supports soil conditioning",
			"Useful in organic farming programs",
			"Helps improve soil workability",
			"Fits long-term soil health planning",
		],
		recommendedCrops: ["Onion", "Vegetables", "Pomegranate", "Other Horticulture Crops"],
		applicationNote:
			"Application rates vary by soil type and crop. Please use labelled directions or contact us for product selection help.",
		packSizes: ["5 kg", "10 kg", "25 kg"],
		image:
			"https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80",
		featured: true,
		relatedSlugs: ["humic-acid", "trichoderma"],
	},
];

export function getProductBySlug(slug: string) {
	return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts() {
	return products.filter((p) => p.featured);
}

export function getProductsByCategory(categoryId: string) {
	return products.filter((p) => p.categoryId === categoryId);
}

export function getRelatedProducts(product: Product) {
	return product.relatedSlugs
		.map((slug) => getProductBySlug(slug))
		.filter(Boolean) as Product[];
}
