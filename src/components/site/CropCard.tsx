import type { Crop } from "@/data/crops";

export default function CropCard({ crop }: { crop: Crop }) {
	return (
		<article className="fcCard">
			<img src={crop.image} alt={crop.name} className="fcCardImg" loading="lazy" />
			<div className="fcCardBody">
				<h3>{crop.name}</h3>
				<p>{crop.blurb}</p>
			</div>
		</article>
	);
}
