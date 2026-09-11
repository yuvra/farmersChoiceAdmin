import Link from "next/link";
import { whatsappLink } from "@/config/site";
import styles from "./DealerSection.module.css";

export default function DealerSection() {
	return (
		<section className={styles.band}>
			<div className={`fcContainer ${styles.inner}`}>
				<div>
					<p className="fcKicker" style={{ color: "var(--fc-sage)" }}>
						Business Partners
					</p>
					<h2 className={styles.title}>Partner With Farmers Choice</h2>
					<p className={styles.lead}>
						We welcome dealers, distributors, retailers and agriculture
						professionals interested in partnering with Farmers Choice.
					</p>
				</div>
				<div className={styles.actions}>
					<a
						href={whatsappLink(
							"Hello Farmers Choice, I am interested in becoming a dealer/distributor."
						)}
						target="_blank"
						rel="noopener noreferrer"
						className="fcBtn fcBtnLight"
					>
						Become a Dealer
					</a>
					<Link href="/#contact" className="fcBtn fcBtnGhostLight">
						Send Enquiry
					</Link>
				</div>
			</div>
		</section>
	);
}
