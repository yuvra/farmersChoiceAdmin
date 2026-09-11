import PolicyShell from "../PolicyShell";
import { BUSINESS } from "../policy-meta";

export const metadata = {
	title: `Shipping Policy | ${BUSINESS.name}`,
};

export default function ShippingPage() {
	return (
		<PolicyShell title="Shipping Policy">
			<p>
				The orders for the user are shipped through registered domestic
				courier companies and/or speed post only. Orders are shipped within 7
				days from the date of the order and/or payment or as per the delivery
				date agreed at the time of order confirmation and delivering of the
				shipment, subject to courier company / post office norms.
			</p>
			<p>
				Platform Owner ({BUSINESS.name}) shall not be liable for any delay in
				delivery by the courier company / postal authority. Delivery of all
				orders will be made to the address provided by the buyer at the time
				of purchase.
			</p>
			<p>
				Delivery of our services / order updates will be confirmed on your
				email ID / mobile number as specified at the time of registration or
				checkout. If there are any shipping cost(s) levied by the seller or
				the Platform Owner (as the case may be), the same is not refundable
				unless required by applicable law or expressly stated otherwise.
			</p>
			<p>
				For shipping related queries, contact {BUSINESS.email} or{" "}
				{BUSINESS.phone}. Pickup / warehouse location references may include
				Rahuri and related Maharashtra fulfillment points used by{" "}
				{BUSINESS.name}.
			</p>
		</PolicyShell>
	);
}
