import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { hashPassword, createToken } from "@/lib/auth";
import { initDatabase } from "@/lib/init-db";

export async function POST(request) {
    try {
        await initDatabase();

        const { teamName, email, password, members } = await request.json();

        if (!teamName || !email || !password) {
            return NextResponse.json(
                { error: "Team name, email, and password are required" },
                { status: 400 }
            );
        }

        // Check if team or email exists
        const existing = await pool.query(
            "SELECT id FROM teams WHERE email = $1 OR team_name = $2",
            [email, teamName]
        );

        if (existing.rows.length > 0) {
            return NextResponse.json(
                { error: "Team name or email already registered" },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);

        const result = await pool.query(
            `INSERT INTO teams (team_name, email, password_hash, members)
       VALUES ($1, $2, $3, $4) RETURNING id, team_name, email, members, is_admin`,
            [teamName, email, passwordHash, members || ""]
        );

        const team = result.rows[0];
        const token = createToken({
            id: team.id,
            teamName: team.team_name,
            email: team.email,
            isAdmin: team.is_admin,
        });

        const response = NextResponse.json({ success: true, team });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
