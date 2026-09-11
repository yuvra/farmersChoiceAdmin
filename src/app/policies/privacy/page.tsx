import PolicyShell from "../PolicyShell";
import { BUSINESS } from "../policy-meta";

export const metadata = {
	title: `Privacy Policy | ${BUSINESS.name}`,
};

export default function PrivacyPage() {
	return (
		<PolicyShell title="Privacy Policy">
			<p>
				<strong>Introduction</strong>
			</p>
			<p>
				This Privacy Policy describes how {BUSINESS.legalName} and its
				affiliates (collectively &quot;{BUSINESS.name}, we, our, us&quot;)
				collect, use, share, protect or otherwise process your information /
				personal data through our website{" "}
				<a href={BUSINESS.website} style={{ color: "#2f6b3a" }}>
					{BUSINESS.website}
				</a>{" "}
				(hereinafter referred to as Platform). Please note that you may be
				able to browse certain sections of the Platform without registering
				with us. We do not offer any product/service under this Platform
				outside India and your personal data will primarily be stored and
				processed in India. By visiting this Platform, providing your
				information or availing any product/service offered on the Platform,
				you expressly agree to be bound by the terms and conditions of this
				Privacy Policy, the Terms of Use and the applicable service/product
				terms and conditions, and agree to be governed by the laws of India
				including but not limited to the laws applicable to data protection
				and privacy. If you do not agree please do not use or access our
				Platform.
			</p>
			<p>
				<strong>Collection</strong> — We collect your personal data when you
				use our Platform, services or otherwise interact with us during the
				course of our relationship. Some of the information that we may
				collect includes but is not limited to personal data / information
				provided to us during sign-up/registering or using our Platform such
				as name, date of birth, address, telephone/mobile number, email ID
				and/or any such information shared as proof of identity or address.
				Some of the sensitive personal data may be collected with your
				consent, such as your bank account or credit or debit card or other
				payment instrument information, all of the above being in accordance
				with applicable law(s). You always have the option to not provide
				information, by choosing not to use a particular service or feature on
				the Platform. We may track your behaviour, preferences, and other
				information that you choose to provide on our Platform. We will also
				collect your information related to your transactions on Platform and
				such third-party business partner platforms.
			</p>
			<p>
				<strong>Usage</strong> — We use personal data to provide the services
				you request. To the extent we use your personal data to market to you,
				we will provide the ability to opt-out of such uses. We use your
				personal data to assist in handling and fulfilling orders; enhancing
				customer experience; to resolve disputes; troubleshoot problems;
				inform you about offers, products, services, and updates; customise
				your experience; detect and protect us against error, fraud and other
				criminal activity; enforce our terms and conditions; conduct marketing
				research, analysis and surveys; and as otherwise described to you at
				the time of collection of information.
			</p>
			<p>
				<strong>Sharing</strong> — We may share your personal data internally
				within our group entities, our other corporate entities, and
				affiliates to provide you access to the services and products offered
				by them. We may disclose personal data to third parties such as
				sellers, business partners, logistics partners (including courier
				partners), prepaid payment instrument issuers, and other payment
				partners opted by you. These disclosures may be required for us to
				provide you access to our services and products, to comply with our
				legal obligations, to enforce our user agreement, to facilitate our
				marketing and advertising activities, to prevent, detect, mitigate,
				and investigate fraudulent or illegal activities related to our
				services. We may disclose personal and sensitive personal data to
				government agencies or other authorised law enforcement agencies if
				required to do so by law.
			</p>
			<p>
				<strong>Security Precautions</strong> — To protect your personal data
				from unauthorised access or disclosure, loss or misuse we adopt
				reasonable security practices and procedures. However, the
				transmission of information is not completely secure for reasons
				beyond our control. By using the Platform, the users accept the
				security implications of data transmission over the internet.
			</p>
			<p>
				<strong>Data Deletion and Retention</strong> — You have an option to
				delete your account by visiting your profile and settings on our
				Platform, or by writing to us at the contact information provided
				below. We may in event of any pending grievance, claims, pending
				shipments or any other services refuse or delay deletion of the
				account. We retain your personal data for a period no longer than is
				required for the purpose for which it was collected or as required
				under any applicable law.
			</p>
			<p>
				<strong>Your Rights</strong> — You may access, rectify, and update
				your personal data directly through the functionalities provided on
				the Platform or by contacting us.
			</p>
			<p>
				<strong>Consent</strong> — By visiting this Platform or by providing
				your information, you consent to the collection, use, storage,
				disclosure and otherwise processing of your information on the
				Platform in accordance with this Privacy Policy. You have an option to
				withdraw your consent that you have already provided by writing to the
				Grievance Officer at the contact information provided below. Please
				mention “Withdrawal of consent for processing personal data” in your
				subject line.
			</p>
			<p>
				<strong>Changes to this Privacy Policy</strong> — Please check our
				Privacy Policy periodically for changes. We may update this Privacy
				Policy to reflect changes to our information practices.
			</p>
			<p>
				<strong>Grievance Officer</strong>
			</p>
			<p>
				Name: Grievance Officer, {BUSINESS.name}
				<br />
				Designation: Customer Support / Grievance Officer
				<br />
				Address: {BUSINESS.address}
				<br />
				Email: {BUSINESS.email}
				<br />
				Phone: {BUSINESS.phone}
				<br />
				Time: Monday – Friday (9:00 – 18:00)
			</p>
		</PolicyShell>
	);
}
