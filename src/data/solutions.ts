export type Solution = {
	id: string;
	title: string;
	description: string;
	relatedCategoryIds: string[];
	relatedProductSlugs: string[];
};

export const solutions: Solution[] = [
	{
		id: "soil-health",
		title: "Improve Soil Health",
		description:
			"Build healthier soil with conditioners, organic inputs and biological support products.",
		relatedCategoryIds: ["soil-health", "organic-fertilizers"],
		relatedProductSlugs: ["organic-soil-conditioner", "humic-acid"],
	},
	{
		id: "root-development",
		title: "Improve Root Development",
		description:
			"Support stronger root zones with biological and soil-focused products.",
		relatedCategoryIds: ["bio-fungicides", "bio-fertilizers"],
		relatedProductSlugs: ["trichoderma", "bio-npk"],
	},
	{
		id: "flowering",
		title: "Increase Flowering",
		description:
			"Nutrition options often considered during flowering and fruit-setting stages.",
		relatedCategoryIds: ["specialty-crop-nutrition", "plant-growth-promoters"],
		relatedProductSlugs: ["calcium-boron", "seaweed-extract"],
	},
	{
		id: "fruit-size",
		title: "Improve Fruit Size",
		description:
			"Specialty nutrition support for fruit development focused crop programs.",
		relatedCategoryIds: ["specialty-crop-nutrition", "micronutrients"],
		relatedProductSlugs: ["calcium-boron", "chelated-micronutrient-mix"],
	},
	{
		id: "micronutrient-deficiencies",
		title: "Correct Micronutrient Deficiencies",
		description:
			"Targeted micronutrient products for crops showing deficiency symptoms.",
		relatedCategoryIds: ["micronutrients"],
		relatedProductSlugs: ["chelated-micronutrient-mix", "magnesium"],
	},
	{
		id: "plant-growth",
		title: "Improve Plant Growth",
		description:
			"Growth-support inputs to encourage healthier vegetative development.",
		relatedCategoryIds: ["plant-growth-promoters", "bio-fertilizers"],
		relatedProductSlugs: ["seaweed-extract", "bio-npk"],
	},
	{
		id: "soil-borne",
		title: "Manage Soil-Borne Problems",
		description:
			"Beneficial microbial options for soil and root-zone care programs.",
		relatedCategoryIds: ["bio-fungicides"],
		relatedProductSlugs: ["trichoderma"],
	},
	{
		id: "crop-quality",
		title: "Improve Crop Quality",
		description:
			"Balanced nutrition and soil-care products to support better harvest quality.",
		relatedCategoryIds: ["specialty-crop-nutrition", "soil-health"],
		relatedProductSlugs: ["humic-acid", "calcium-boron"],
	},
];
