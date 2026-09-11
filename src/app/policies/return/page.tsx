import PolicyShell from "../PolicyShell";
import { BUSINESS } from "../policy-meta";

export const metadata = {
	title: `Return Policy | ${BUSINESS.name}`,
};

export default function ReturnPage() {
	return (
		<PolicyShell title="Return Policy">
			<p>
				We offer refund / exchange within the first 20 days from the date of
				your purchase. If 20 days have passed since your purchase, you will
				not be offered a return, exchange or refund of any kind.
			</p>
			<p>
				In order to become eligible for a return or an exchange, (i) the
				purchased item should be unused and in the same condition as you
				received it, (ii) the item must have original packaging, (iii) if the
				item that you purchased was on a sale, then the item may not be
				eligible for a return / exchange. Further, only such items are
				replaced by us (based on an exchange request), if such items are found
				defective or damaged.
			</p>
			<p>
				You agree that there may be a certain category of products / items
				that are exempted from returns or refunds. Such categories of the
				products would be identified to you at the time of purchase.
			</p>
			<p>
				For exchange / return accepted request(s) (as applicable), once your
				returned product / item is received and inspected by us, we will send
				you an email to notify you about receipt of the returned / exchanged
				product. Further, if the same has been approved after the quality
				check at our end, your request (i.e. return / exchange) will be
				processed in accordance with our policies.
			</p>
			<p>
				To raise a return request, contact {BUSINESS.email} or{" "}
				{BUSINESS.phone}.
			</p>
		</PolicyShell>
	);
}
