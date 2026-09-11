import Link from "next/link";
import { siteConfig } from "@/config/site";
import styles from "./Hero.module.css";

export default function Hero() {
	return (
		<section className={styles.hero}>
			<div className={styles.media} aria-hidden />
			<div className={styles.shade} aria-hidden />
			<div className={`fcContainer ${styles.content}`}>
				<p className={styles.eyebrow}>Agriculture & Organic Farming Products</p>
				<h1 className={styles.title}>{siteConfig.tagline}</h1>
				<p className={styles.lead}>
					Farmers Choice provides reliable, high-quality agricultural products
					designed to improve soil health, crop nutrition, plant growth and
					farm productivity.
				</p>
				<div className={styles.actions}>
					<Link href="/catalogue" className="fcBtn fcBtnLight">
						Explore Products
					</Link>
					<a href="#contact" className="fcBtn fcBtnGhostLight">
						Contact Us
					</a>
				</div>
			</div>
		</section>
	);
}
