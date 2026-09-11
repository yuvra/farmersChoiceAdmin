export type Category = {
	id: string;
	name: string;
	slug: string;
	description: string;
	image: string;
};

export const categories: Category[] = [
	{
		id: "organic-fertilizers",
		name: "Organic Fertilizers",
		slug: "organic-fertilizers",
		description:
			"Natural nutrition options that support soil fertility and steady crop growth.",
		image:
			"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "bio-fertilizers",
		name: "Bio Fertilizers",
		slug: "bio-fertilizers",
		description:
			"Microbial formulations that help improve nutrient availability in the soil.",
		image:
			"https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "micronutrients",
		name: "Micronutrients",
		slug: "micronutrients",
		description:
			"Targeted nutrition to help correct common micronutrient gaps in crops.",
		image:
			"https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "soil-health",
		name: "Soil Health",
		slug: "soil-health",
		description:
			"Conditioners and organic inputs focused on healthier, more productive soil.",
		image:
			"https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "plant-growth-promoters",
		name: "Plant Growth Promoters",
		slug: "plant-growth-promoters",
		description:
			"Supportive products for vegetative growth, flowering and crop vigor.",
		image:
			"https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "bio-fungicides",
		name: "Bio Fungicides",
		slug: "bio-fungicides",
		description:
			"Beneficial microbial options for farm programs focused on soil and plant care.",
		image:
			"https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "bio-pesticides",
		name: "Bio Pesticides",
		slug: "bio-pesticides",
		description:
			"Eco-conscious pest management inputs for integrated farm practices.",
		image:
			"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "specialty-crop-nutrition",
		name: "Specialty Crop Nutrition",
		slug: "specialty-crop-nutrition",
		description:
			"Focused nutrition blends for horticulture and high-value crop stages.",
		image:
			"https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80",
	},
];

export function getCategoryBySlug(slug: string) {
	return categories.find((c) => c.slug === slug);
}
