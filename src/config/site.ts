export const siteConfig = {
	name: "Farmers Choice",
	legalName: "Farmers Choice",
	tagline: "Better Inputs. Healthier Crops. Stronger Farms.",
	description:
		"Farmers Choice provides quality agricultural inputs including organic fertilizers, bio fertilizers, micronutrients, soil health products, crop nutrition and sustainable farming solutions.",
	phone: "9011262635",
	whatsapp: "919011262635",
	email: "007yuvraj.mane@gmail.com",
	address:
		"Atp - Rahimatpur, Tal - Koregaon, Dist - Satara, Pincode - 415511, Maharashtra, India",
	website:
		"https://farmers-choice-admin-git-master-yuvraj-s-projects.vercel.app",
	playStoreUrl:
		"https://play.google.com/store/apps/details?id=com.anonymous.krushisewakendra",
	social: {
		playStore:
			"https://play.google.com/store/apps/details?id=com.anonymous.krushisewakendra",
	},
} as const;

export function whatsappLink(message?: string) {
	const text = message
		? `?text=${encodeURIComponent(message)}`
		: "";
	return `https://wa.me/${siteConfig.whatsapp}${text}`;
}
