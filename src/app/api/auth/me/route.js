import { NextResponse } from "next/server";
import { getTeamFromRequest } from "@/lib/auth";

export async function GET() {
    const team = await getTeamFromRequest();
    if (!team) {
        return NextResponse.json({ team: null }, { status: 401 });
    }
    return NextResponse.json({ team });
}
