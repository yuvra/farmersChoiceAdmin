import { siteConfig } from "@/config/site";

export const BUSINESS = {
	name: siteConfig.name,
	legalName: siteConfig.legalName,
	address: siteConfig.address,
	phone: siteConfig.phone,
	email: siteConfig.email,
	website: siteConfig.website,
	playStoreUrl: siteConfig.playStoreUrl,
	platformLabel:
		"Farmers Choice website, mobile application and related services",
};

export type PolicySlug =
	| "terms"
	| "privacy"
	| "refund"
	| "return"
	| "shipping";

export const POLICY_LINKS: { slug: PolicySlug; title: string }[] = [
	{ slug: "terms", title: "Terms and Conditions" },
	{ slug: "privacy", title: "Privacy Policy" },
	{ slug: "refund", title: "Refund and Cancellation Policy" },
	{ slug: "return", title: "Return Policy" },
	{ slug: "shipping", title: "Shipping Policy" },
];
