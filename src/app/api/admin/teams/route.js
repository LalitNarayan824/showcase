import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getTeamFromRequest } from "@/lib/auth";

export async function GET() {
    try {
        const team = await getTeamFromRequest();
        if (!team || !team.isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const result = await pool.query(
            "SELECT id, team_name, email, members, is_admin, created_at FROM teams ORDER BY created_at DESC"
        );

        return NextResponse.json({ teams: result.rows });
    } catch (error) {
        console.error("Admin teams error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
