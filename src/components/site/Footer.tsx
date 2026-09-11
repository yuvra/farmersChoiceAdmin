import Link from "next/link";
import { siteConfig, whatsappLink } from "@/config/site";
import { categories } from "@/data/categories";
import { POLICY_LINKS } from "@/app/policies/policy-meta";
import styles from "./Footer.module.css";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={`fcContainer ${styles.grid}`}>
				<div>
					<h3 className={styles.brand}>{siteConfig.name}</h3>
					<p className={styles.copy}>
						Reliable agricultural inputs for soil health, crop nutrition and
						sustainable farm productivity.
					</p>
				</div>
				<div>
					<h4>Product Categories</h4>
					<ul>
						{categories.slice(0, 6).map((c) => (
							<li key={c.id}>
								<Link href={`/catalogue?category=${c.slug}`}>{c.name}</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h4>Useful Links</h4>
					<ul>
						<li>
							<Link href="/catalogue">Products</Link>
						</li>
						<li>
							<Link href="/#about">About Us</Link>
						</li>
						<li>
							<Link href="/#why-us">Why Farmers Choice</Link>
						</li>
						<li>
							<Link href="/#contact">Contact</Link>
						</li>
						{POLICY_LINKS.slice(0, 3).map((p) => (
							<li key={p.slug}>
								<Link href={`/policies/${p.slug}`}>{p.title}</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h4>Contact</h4>
					<ul className={styles.contact}>
						<li>
							<a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
						</li>
						<li>
							<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
						</li>
						<li>
							<a
								href={whatsappLink()}
								target="_blank"
								rel="noopener noreferrer"
							>
								WhatsApp
							</a>
						</li>
						<li>{siteConfig.address}</li>
					</ul>
				</div>
			</div>
			<div className={`fcContainer ${styles.bottom}`}>
				<p>
					© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
				</p>
				<div className={styles.legal}>
					<Link href="/policies/privacy">Privacy Policy</Link>
					<Link href="/policies/terms">Terms</Link>
					<a
						href={siteConfig.playStoreUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						Google Play
					</a>
				</div>
			</div>
		</footer>
	);
}
