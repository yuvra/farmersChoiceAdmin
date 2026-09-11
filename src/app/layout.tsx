import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const display = Fraunces({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["500", "600", "700"],
});

const sans = Manrope({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: {
		default: "Farmers Choice | Agriculture & Organic Farming Products",
		template: "%s | Farmers Choice",
	},
	description:
		"Farmers Choice provides quality agricultural inputs including organic fertilizers, bio fertilizers, micronutrients, soil health products, crop nutrition and sustainable farming solutions.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${display.variable} ${sans.variable}`}>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
