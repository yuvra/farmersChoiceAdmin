"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import styles from "./Header.module.css";

const links = [
	{ href: "/", label: "Home" },
	{ href: "/catalogue", label: "Products" },
	{ href: "/#categories", label: "Categories" },
	{ href: "/#about", label: "About Us" },
	{ href: "/#why-us", label: "Why Farmers Choice" },
	{ href: "/#contact", label: "Contact" },
];

export default function Header() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
			<div className={`fcContainer ${styles.inner}`}>
				<Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
					<span className={styles.logoMark}>FC</span>
					<span>{siteConfig.name}</span>
				</Link>

				<nav className={styles.desktopNav} aria-label="Primary">
					{links.map((l) => (
						<Link key={l.href} href={l.href}>
							{l.label}
						</Link>
					))}
				</nav>

				<div className={styles.desktopActions}>
					<Link href="/catalogue" className="fcBtn fcBtnPrimary">
						Explore Products
					</Link>
					<Link href="/login" className={styles.adminLink}>
						Admin
					</Link>
				</div>

				<button
					type="button"
					className={styles.menuBtn}
					aria-label={open ? "Close menu" : "Open menu"}
					aria-expanded={open}
					onClick={() => setOpen((v) => !v)}
				>
					<span />
					<span />
					<span />
				</button>
			</div>

			{open ? (
				<div className={styles.mobilePanel}>
					<nav aria-label="Mobile">
						{links.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								onClick={() => setOpen(false)}
							>
								{l.label}
							</Link>
						))}
					</nav>
					<Link
						href="/catalogue"
						className="fcBtn fcBtnPrimary"
						onClick={() => setOpen(false)}
					>
						Explore Products
					</Link>
					<Link
						href="/login"
						className={styles.adminLink}
						onClick={() => setOpen(false)}
					>
						Admin Login
					</Link>
				</div>
			) : null}
		</header>
	);
}
