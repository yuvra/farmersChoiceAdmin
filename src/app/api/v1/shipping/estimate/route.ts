export const runtime = "nodejs";

/**
 * Calculate Shipping Cost (Delhivery)
 * - Status is fixed to "Delivered"
 * - Billing mode defaults to "S" (Surface). Pass "E" for  Express if needed.
 * - POST only, simple JSON body
 * 
 * Status options (ss):
 * 1. Delivered → Shipment successfully delivered to customer.
 *    Charges = forward delivery charges (pickup → delivery).
 *
 * 2. RTO (Return to Origin) → Shipment could not be delivered (refused, wrong address, not available).
 *    Courier sends package back to warehouse.
 *    Charges = forward + return charges.
 *
 * 3. DTO (Deliver to Origin) → Reverse logistics (planned return).
 *    Courier picks from customer → delivers to seller/warehouse.
 *    Charges = reverse shipment charges only.
 */

type RequestBody = {
  from_pincode?: string;              // origin (o_pin)
  to_pincode: string;                // destination (d_pin)
  weight_grams: number;              // cgm (grams)
  payment_type?: "Pre-paid" | "COD";  // pt
  billing_mode?: "E" | "S";          // md (optional, default "E")
};

const TOKEN = process.env.DELHIVERY_API_TOKEN as string;
if (!TOKEN) throw new Error("DELHIVERY_API_TOKEN missing in .env.local");

// Staging by default. For production, change to: https://track.delhivery.com
const baseUrl = "https://track.delhivery.com" //"https://staging-express.delhivery.com";  


const PIN = /^\d{6}$/;

export async function POST(req: Request) {

  
  
  let body: RequestBody;
  try {
    body = await req.json();
    console.log("body**", body);
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Defaults
  const billingMode = body.billing_mode ?? "S"; // Surface
  const status = "Delivered";
  const from_pincode = body.from_pincode ?? "415511"
  const payment_type = body.payment_type ?? 'Pre-paid'

  // Simple validation
  const errors: string[] = [];
  if (!PIN.test(body.to_pincode)) errors.push("to_pincode must be 6 digits");
  if (!Number.isFinite(body.weight_grams) || body.weight_grams < 0)
    errors.push("weight_grams must be a non-negative number (grams)");
  if (payment_type !== "Pre-paid" && payment_type !== "COD")
    errors.push("payment_type must be 'Pre-paid' or 'COD'");
  if (billingMode !== "E" && billingMode !== "S")
    errors.push("billing_mode must be 'E' or 'S'");
  if (errors.length) return Response.json({ error: errors.join("; ") }, { status: 422 });

  // Build upstream URL with clear names
  const endpoint = `${baseUrl}/api/kinko/v1/invoice/charges/.json`;
  const url = new URL(endpoint);
  url.searchParams.set("md", billingMode);
  url.searchParams.set("ss", status);
  url.searchParams.set("o_pin", from_pincode);
  url.searchParams.set("d_pin", body.to_pincode);
  url.searchParams.set("cgm", String(body.weight_grams));
  url.searchParams.set("pt", payment_type);

  // Call Delhivery
  const resp = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Token ${TOKEN}` },
    cache: "no-store",
  });

  if (!resp.ok) {
    const text = await resp.text();
    return new Response(text || "Delhivery error", { status: resp.status });
  }

  const raw = await resp.json();

  // Easy-to-read response (keep raw for details)
  return Response.json({
    // input: {
    //   mode: billingMode === "E" ? "Express" : "Surface",
    //   status,
    //   from: body.from_pincode,
    //   to: body.to_pincode,
    //   grams: body.weight_grams,
    //   paymentType: body.payment_type,
    // },
    // result: {
    //   total_amount: raw?.total_amount ?? null,
    //   zone: raw?.zone ?? null,
    //   wt_rule_id: raw?.wt_rule_id ?? null,
    //   zonal_charge: raw?.zonal_charge ?? null,
    // },
    raw
  });
}
