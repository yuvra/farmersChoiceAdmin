export const runtime = "nodejs";

const TOKEN = process.env.DELHIVERY_API_TOKEN as string;
if (!TOKEN) throw new Error("DELHIVERY_API_TOKEN missing in .env.local");

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const pinCode = searchParams.get("pin_code");

	if (pinCode === "") {
		return Response.json({ Result: "Plaese Enter Pincode" });
	}

	console.log("***pinCode***", pinCode);

	const URL_PROD = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pinCode}`;

	const Result = await fetch(URL_PROD.toString(), {
		headers: {
			Authorization: `Token ${TOKEN}`,
			Accept: "application/json",
		},
		cache: "no-store",
	});

	console.log("***upstream***", Result);

	if (!Result.ok) {
		const text = await Result.text();
		return new Response(text || "Delhivery error", {
			status: Result.status,
		});
	}

	const data = await Result.json();

	return Response.json(data);
}
