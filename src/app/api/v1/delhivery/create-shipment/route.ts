export const runtime = "nodejs";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

/**
 * Create a Delhivery forward shipment from an existing order.
 *
 * Required env (.env.local):
 *   DELHIVERY_API_TOKEN
 *   DELHIVERY_PICKUP_LOCATION  — exact registered warehouse name (case-sensitive)
 * Optional:
 *   DELHIVERY_DEFAULT_WEIGHT_GM — default 500
 */

type CreateShipmentBody = {
	userId: string;
	orderId: string;
	pickupLocation?: string;
};

const PIN = /^\d{6}$/;

const formatAddressLine = (addr: Record<string, any> | null | undefined) => {
	if (!addr) return "";
	const parts = [
		addr.flat ? `Flat / House No.: ${addr.flat}` : null,
		addr.street ? `Street: ${addr.street}` : null,
		addr.landmark ? `Landmark: ${addr.landmark}` : null,
		addr.city ? `City: ${addr.city}` : null,
		addr.district ? `District: ${addr.district}` : null,
	].filter(Boolean);
	return parts.join(", ");
};

/** Parse pack size from variant title text into grams (1L liquid ≈ 1000g). */
const parsePackSizeToGrams = (title: string): number | null => {
	const text = String(title || "").toLowerCase().replace(/,/g, "");
	if (!text) return null;

	const litre = text.match(/(\d+(?:\.\d+)?)\s*(?:l|ltr|ltrs|liter|liters|litre|litres)\b/);
	if (litre) return Math.round(Number(litre[1]) * 1000);

	const ml = text.match(/(\d+(?:\.\d+)?)\s*(?:ml|mL)\b/i);
	if (ml) return Math.round(Number(ml[1]));

	const kg = text.match(/(\d+(?:\.\d+)?)\s*(?:kg|kgs)\b/);
	if (kg) return Math.round(Number(kg[1]) * 1000);

	const gram = text.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|gms|gram|grams)\b/);
	if (gram) return Math.round(Number(gram[1]));

	return null;
};

const getItemVariantTitle = (item: any): string => {
	return (
		item?.variant?.title?.en ||
		item?.variant?.title ||
		item?.selectedVariant?.title?.en ||
		item?.product?.mapVariant?.[0]?.title?.en ||
		""
	);
};

/**
 * Estimate item weight in grams.
 * Liquid Organic Farming / Biomix units default to 1L (1000g) each when pack size is unknown.
 */
const estimateItemWeightGrams = (item: any): number => {
	const qty = Math.max(1, Number(item?.quantity) || 1);
	const title = getItemVariantTitle(item);
	const name = String(item?.product?.productName?.en || "");
	const type = String(item?.product?.productType?.en || "");

	const fromTitle = parsePackSizeToGrams(title);
	if (fromTitle && fromTitle > 0) return fromTitle * qty;

	const isBiomix = /biomix/i.test(name);
	const isOrganicFarming = /organic\s*farming/i.test(type);
	if (isBiomix || isOrganicFarming) {
		// Unit pack is 1 litre liquid → qty 2 = 2L = 2000g
		return 1000 * qty;
	}

	return 0;
};

const estimateOrderWeightGrams = (
	items: any[],
	fallbackGrams: number
): number => {
	const total = items.reduce(
		(sum, item) => sum + estimateItemWeightGrams(item),
		0
	);
	if (total > 0) return total;
	return Number.isFinite(fallbackGrams) && fallbackGrams > 0
		? fallbackGrams
		: 500;
};

/** Standard Biomix / Organic Farming bottle pack (cm). */
const BIOMIX_PACK_CM = {
	length: 15,
	breadth: 5,
	height: 5,
} as const;

const isBiomixOrOrganicItem = (item: any): boolean => {
	const name = String(item?.product?.productName?.en || "");
	const type = String(item?.product?.productType?.en || "");
	return /biomix/i.test(name) || /organic\s*farming/i.test(type);
};

/**
 * Package dimensions for Delhivery (cm).
 * Biomix: 15 × 5 × 5 per litre bottle; height scales with total qty when stacked.
 */
const estimatePackageDimensionsCm = (
	items: any[]
): { length: number; breadth: number; height: number } => {
	const biomixQty = items.reduce((sum, item) => {
		if (!isBiomixOrOrganicItem(item)) return sum;
		return sum + Math.max(1, Number(item?.quantity) || 1);
	}, 0);

	if (biomixQty > 0) {
		return {
			length: BIOMIX_PACK_CM.length,
			breadth: BIOMIX_PACK_CM.breadth,
			height: BIOMIX_PACK_CM.height * biomixQty,
		};
	}

	// Sensible non-zero default so Delhivery One doesn't show 0×0×0
	return { length: 15, breadth: 10, height: 10 };
};

const mapPaymentMode = (
	paymentMethod: unknown
): { payment_mode: "COD" | "Pre-paid"; isCod: boolean } => {
	const raw = String(paymentMethod ?? "").toLowerCase();
	const isCod = raw.includes("cod") || raw.includes("cash");
	return { payment_mode: isCod ? "COD" : "Pre-paid", isCod };
};

const extractWaybill = (data: any): string | null => {
	const fromPackages = data?.packages?.[0]?.waybill || data?.packages?.[0]?.wbn;
	if (fromPackages) return String(fromPackages);
	if (data?.waybill) return String(data.waybill);
	return null;
};

const extractErrorMessage = (data: any, fallback: string) => {
	const remarks = data?.packages?.[0]?.remarks;
	if (Array.isArray(remarks) && remarks.length) {
		return remarks.map(String).join("; ");
	}
	if (typeof remarks === "string" && remarks) return remarks;
	if (data?.rmk) return String(data.rmk);
	if (data?.error) return String(data.error);
	if (data?.message) return String(data.message);
	return fallback;
};

export async function POST(req: Request) {
	const token = process.env.DELHIVERY_API_TOKEN;
	const defaultPickupLocation = process.env.DELHIVERY_PICKUP_LOCATION;
	const defaultWeight = Number(
		process.env.DELHIVERY_DEFAULT_WEIGHT_GM || "500"
	);

	if (!token) {
		return Response.json(
			{ error: "DELHIVERY_API_TOKEN missing in .env.local" },
			{ status: 500 }
		);
	}

	let body: CreateShipmentBody;
	try {
		body = await req.json();
	} catch {
		return Response.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const { userId, orderId } = body;
	const pickupLocation =
		(body.pickupLocation || "").trim() || defaultPickupLocation || "";

	if (!pickupLocation) {
		return Response.json(
			{ error: "Pickup location is required" },
			{ status: 400 }
		);
	}

	if (!userId || !orderId) {
		return Response.json(
			{ error: "userId and orderId are required" },
			{ status: 400 }
		);
	}

	const userRef = doc(db, "userProfilesAndOrderStatus", userId);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		return Response.json({ error: "User not found" }, { status: 404 });
	}

	const userData = userSnap.data() as any;
	const orders: any[] = Array.isArray(userData.orders) ? userData.orders : [];
	const orderIndex = orders.findIndex((o) => o?.id === orderId);
	if (orderIndex < 0) {
		return Response.json({ error: "Order not found" }, { status: 404 });
	}

	const order = orders[orderIndex];
	if (order.delhiveryWaybill) {
		return Response.json(
			{
				error: "Shipment already created on Delhivery",
				waybill: order.delhiveryWaybill,
			},
			{ status: 409 }
		);
	}

	const profile = userData.profile?.[0] || {};
	const addr = order.shippingAddress || order.address || profile;

	const name = addr?.name || profile?.name;
	const phone = String(addr?.phone || profile?.phone || "").replace(/\D/g, "");
	const add = formatAddressLine(addr);
	const city = addr?.city || profile?.city;
	const state = addr?.state || profile?.state;
	const country = addr?.country || profile?.country || "India";
	const pin = String(addr?.pincode || profile?.pincode || "").trim();

	if (!name || !phone || !add || !city || !state || !pin) {
		return Response.json(
			{
				error:
					"Missing required address fields (name, phone, address, city, state, pincode)",
			},
			{ status: 400 }
		);
	}
	if (!PIN.test(pin)) {
		return Response.json(
			{ error: "Invalid pincode — must be 6 digits" },
			{ status: 400 }
		);
	}
	if (phone.length < 10) {
		return Response.json(
			{ error: "Invalid phone number" },
			{ status: 400 }
		);
	}

	const items: any[] = Array.isArray(order.items) ? order.items : [];
	const productsDesc =
		items
			.map((item) => item?.product?.productName?.en)
			.filter(Boolean)
			.join(", ") || "Order items";
	const quantity =
		items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0) || 1;
	const totalAmount = Number(order.totalAmount || 0);
	const { payment_mode, isCod } = mapPaymentMode(order.paymentMethod);
	const weight = estimateOrderWeightGrams(items, defaultWeight);
	const dims = estimatePackageDimensionsCm(items);

	const delhiveryOrderRef = `${orderId}-${Date.now()}`;
	const shipment: Record<string, any> = {
		// Delhivery rejects reused order ids — make each create attempt unique
		order: delhiveryOrderRef,
		name: String(name),
		phone,
		add,
		city: String(city),
		state: String(state),
		country: String(country),
		pin,
		payment_mode,
		products_desc: productsDesc,
		quantity,
		total_amount: String(totalAmount),
		weight: String(weight),
		shipment_length: dims.length,
		shipment_width: dims.breadth,
		shipment_height: dims.height,
	};

	if (isCod) {
		shipment.cod_amount = String(totalAmount);
	}

	const payload = {
		pickup_location: {
			name: pickupLocation,
		},
		shipments: [shipment],
	};

	const endpoint = "https://track.delhivery.com/api/cmu/create.json";
	let upstream: Response;
	try {
		upstream = await fetch(endpoint, {
			method: "POST",
			headers: {
				Authorization: `Token ${token}`,
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			body: new URLSearchParams({
				format: "json",
				data: JSON.stringify(payload),
			}).toString(),
			cache: "no-store",
		});
	} catch (err) {
		return Response.json(
			{
				error: "Failed to reach Delhivery API",
				detail: err instanceof Error ? err.message : String(err),
			},
			{ status: 502 }
		);
	}

	const rawText = await upstream.text();
	let data: any = null;
	try {
		data = rawText ? JSON.parse(rawText) : null;
	} catch {
		data = { raw: rawText };
	}

	if (!upstream.ok) {
		return Response.json(
			{
				error: extractErrorMessage(data, "Delhivery API error"),
				raw: data,
			},
			{ status: 502 }
		);
	}

	const packageStatus = String(data?.packages?.[0]?.status || "").toLowerCase();

	// Delhivery often returns HTTP 200 with package-level Fail
	if (
		data?.success === false ||
		packageStatus === "fail" ||
		packageStatus === "error"
	) {
		return Response.json(
			{
				error: extractErrorMessage(data, "Delhivery rejected shipment"),
				raw: data,
			},
			{ status: 400 }
		);
	}

	const waybill = extractWaybill(data);
	if (!waybill) {
		return Response.json(
			{
				error: extractErrorMessage(
					data,
					"Delhivery did not return a waybill"
				),
				raw: data,
			},
			{ status: 502 }
		);
	}

	const createdAt = new Date().toISOString();
	const updatedOrders = orders.map((o, idx) =>
		idx === orderIndex
			? {
					...o,
					delhiveryWaybill: waybill,
					delhiveryCreatedAt: createdAt,
					delhiveryOrderRef,
				}
			: o
	);

	await updateDoc(userRef, { orders: updatedOrders });

	return Response.json({
		success: true,
		waybill,
		delhiveryOrderRef,
		delhiveryCreatedAt: createdAt,
		raw: data,
	});
}
