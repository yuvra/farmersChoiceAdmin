/**
 * DEMO CONTENT — replace with real customer testimonials before production marketing use.
 */
export type Testimonial = {
	id: string;
	name: string;
	role: string;
	location: string;
	quote: string;
	isDemo: true;
};

export const testimonials: Testimonial[] = [
	{
		id: "t1",
		name: "Ramesh Patil",
		role: "Grape Grower",
		location: "Nashik, Maharashtra",
		quote:
			"The product range is practical and the team explains what fits our crop stage clearly.",
		isDemo: true,
	},
	{
		id: "t2",
		name: "Suresh Jadhav",
		role: "Pomegranate Farmer",
		location: "Solapur, Maharashtra",
		quote:
			"We appreciate reliable agri inputs with honest guidance rather than overpromises.",
		isDemo: true,
	},
	{
		id: "t3",
		name: "Anita Deshmukh",
		role: "Vegetable Grower",
		location: "Satara, Maharashtra",
		quote:
			"Ordering and follow-up were simple. The soil and nutrition options are useful for our farm.",
		isDemo: true,
	},
];
