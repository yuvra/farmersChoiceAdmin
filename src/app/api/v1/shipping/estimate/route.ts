//  # POST /api/v1/delhivery/shipping/estimate (stub)
// app/api/v1/delhivery/shipping/estimate/route.ts
export const runtime = "nodejs";

type Body = {
  from_pincode: string;
  to_pincode: string;
  weight_grams: number;
  cod?: boolean;
  declared_value?: number;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  // TODO: call Delhivery "invoice/charges estimate" API here
  return Response.json({
    status: "stub",
    note: "Wire this to Delhivery cost estimate endpoint",
    echo: body,
  });
}
