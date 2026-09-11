import Link from "next/link";
import { BUSINESS, POLICY_LINKS } from "./policy-meta";

export const metadata = {
	title: `Policies | ${BUSINESS.name}`,
	description: `${BUSINESS.name} terms, privacy, refund, return and shipping policies`,
};

export default function PoliciesIndexPage() {
	return (
		<main
			style={{
				minHeight: "100vh",
				background: "#f7f7f5",
				color: "#1a1a1a",
				padding: "40px 16px",
			}}
		>
			<div
				style={{
					maxWidth: 720,
					margin: "0 auto",
					background: "#fff",
					borderRadius: 12,
					padding: 28,
					boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
				}}
			>
				<h1 style={{ fontSize: 30, marginBottom: 8 }}>{BUSINESS.name}</h1>
				<p style={{ color: "#555", marginBottom: 24 }}>
					Public policy documents for our Android app and payments
					verification.
				</p>
				<ul style={{ listStyle: "none", display: "grid", gap: 12 }}>
					{POLICY_LINKS.map((p) => (
						<li key={p.slug}>
							<Link
								href={`/policies/${p.slug}`}
								style={{
									display: "block",
									padding: "14px 16px",
									border: "1px solid #e5e5e5",
									borderRadius: 8,
									color: "#2f6b3a",
									fontWeight: 600,
								}}
							>
								{p.title}
							</Link>
						</li>
					))}
				</ul>
				<p style={{ marginTop: 24, color: "#666", fontSize: 14 }}>
					{BUSINESS.address}
					<br />
					Phone: {BUSINESS.phone} · Email: {BUSINESS.email}
				</p>
			</div>
		</main>
	);
}
