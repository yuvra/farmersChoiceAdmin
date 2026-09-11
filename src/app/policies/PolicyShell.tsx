import Link from "next/link";
import { BUSINESS, POLICY_LINKS } from "./policy-meta";

export default function PolicyShell({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<main
			style={{
				minHeight: "100vh",
				background: "#f7f7f5",
				color: "#1a1a1a",
				padding: "32px 16px 64px",
			}}
		>
			<div
				style={{
					maxWidth: 800,
					margin: "0 auto",
					background: "#fff",
					borderRadius: 12,
					padding: "28px 24px",
					boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
				}}
			>
				<p style={{ marginBottom: 4, color: "#2f6b3a", fontWeight: 700 }}>
					{BUSINESS.name}
				</p>
				<h1 style={{ fontSize: 28, marginBottom: 8 }}>{title}</h1>
				<p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
					Last updated for PhonePe / app store verification
				</p>

				<article
					style={{
						lineHeight: 1.7,
						fontSize: 15,
						display: "grid",
						gap: 14,
					}}
				>
					{children}
				</article>

				<nav
					style={{
						marginTop: 36,
						paddingTop: 20,
						borderTop: "1px solid #eee",
						display: "grid",
						gap: 8,
					}}
				>
					<p style={{ fontWeight: 600, marginBottom: 4 }}>Other policies</p>
					{POLICY_LINKS.map((p) => (
						<Link
							key={p.slug}
							href={`/policies/${p.slug}`}
							style={{ color: "#2f6b3a", textDecoration: "underline" }}
						>
							{p.title}
						</Link>
					))}
					<Link
						href="/policies"
						style={{ color: "#555", marginTop: 8, textDecoration: "underline" }}
					>
						← All policies
					</Link>
				</nav>
			</div>
		</main>
	);
}
