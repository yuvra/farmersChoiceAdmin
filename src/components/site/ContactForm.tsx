"use client";

import { FormEvent, useState } from "react";
import { siteConfig, whatsappLink } from "@/config/site";
import SectionTitle from "./SectionTitle";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
	const [status, setStatus] = useState<string>("");

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const name = String(data.get("name") || "");
		const mobile = String(data.get("mobile") || "");
		const email = String(data.get("email") || "");
		const location = String(data.get("location") || "");
		const crop = String(data.get("crop") || "");
		const product = String(data.get("product") || "");
		const message = String(data.get("message") || "");

		const composed = `Farmers Choice Enquiry%0AName: ${name}%0AMobile: ${mobile}%0AEmail: ${email}%0ALocation: ${location}%0ACrop: ${crop}%0AProduct: ${product}%0AMessage: ${message}`;
		window.open(
			`https://wa.me/${siteConfig.whatsapp}?text=${composed}`,
			"_blank"
		);
		setStatus("Opening WhatsApp with your enquiry…");
	};

	return (
		<section className="fcSection fcSectionAlt" id="contact">
			<div className="fcContainer">
				<SectionTitle
					kicker="Contact"
					title="Talk to Farmers Choice"
					lead="Share your crop requirement and the product you are interested in. We will help you with product selection and dealer support."
				/>
				<div className={styles.grid}>
					<form className={styles.form} onSubmit={onSubmit}>
						<div className={styles.row}>
							<label>
								Name
								<input name="name" required placeholder="Your full name" />
							</label>
							<label>
								Mobile Number
								<input
									name="mobile"
									required
									placeholder="10-digit mobile number"
								/>
							</label>
						</div>
						<div className={styles.row}>
							<label>
								Email
								<input
									name="email"
									type="email"
									placeholder="you@example.com"
								/>
							</label>
							<label>
								Location
								<input name="location" placeholder="Village / District" />
							</label>
						</div>
						<div className={styles.row}>
							<label>
								Crop
								<input name="crop" placeholder="e.g. Grapes, Tomato" />
							</label>
							<label>
								Product interested in
								<input
									name="product"
									placeholder="e.g. Humic Acid, Trichoderma"
								/>
							</label>
						</div>
						<label>
							Message
							<textarea
								name="message"
								rows={4}
								placeholder="Tell us about your requirement"
							/>
						</label>
						<div className={styles.actions}>
							<button type="submit" className="fcBtn fcBtnPrimary">
								Send Enquiry
							</button>
							<a
								href={whatsappLink("Hello Farmers Choice, I need product help.")}
								target="_blank"
								rel="noopener noreferrer"
								className="fcBtn fcBtnSecondary"
							>
								WhatsApp Us
							</a>
						</div>
						{status ? <p className={styles.status}>{status}</p> : null}
					</form>
					<aside className={styles.aside}>
						<h3>Reach us directly</h3>
						<p>
							<strong>Phone:</strong>{" "}
							<a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
						</p>
						<p>
							<strong>Email:</strong>{" "}
							<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
						</p>
						<p>
							<strong>Address:</strong> {siteConfig.address}
						</p>
						<p>
							<strong>App:</strong>{" "}
							<a
								href={siteConfig.playStoreUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Available on Google Play
							</a>
						</p>
					</aside>
				</div>
			</div>
		</section>
	);
}
