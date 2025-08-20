//  # POST /api/v1/delhivery/pickup (stub)
// app/api/v1/delhivery/pickup/route.ts
export const runtime = "nodejs";

type PickupBody = {
  pickup_date: string;      // YYYY-MM-DD
  pickup_time: string;      // "18:00-21:00"
  warehouse: string;        // must match registered warehouse
  quantity: number;
};

export async function POST(req: Request) {
  const body = (await req.json()) as PickupBody;
  // TODO: call Delhivery pickup API here
  return Response.json({
    status: "stub",
    note: "Implement Delhivery pickup creation",
    echo: body,
  });
}
