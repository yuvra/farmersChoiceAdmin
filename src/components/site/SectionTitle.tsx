import styles from "./SectionTitle.module.css";

export default function SectionTitle({
	kicker,
	title,
	lead,
	align = "left",
}: {
	kicker?: string;
	title: string;
	lead?: string;
	align?: "left" | "center";
}) {
	return (
		<div
			className={`${styles.wrap} ${align === "center" ? styles.center : ""}`}
		>
			{kicker ? <span className="fcKicker">{kicker}</span> : null}
			<h2 className="fcTitle">{title}</h2>
			{lead ? <p className="fcLead">{lead}</p> : null}
		</div>
	);
}
