import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { comparePassword, createToken } from "@/lib/auth";
import { initDatabase } from "@/lib/init-db";

export async function POST(request) {
    try {
        await initDatabase();

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const result = await pool.query("SELECT * FROM teams WHERE email = $1", [
            email,
        ]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const team = result.rows[0];
        const valid = await comparePassword(password, team.password_hash);

        if (!valid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const token = createToken({
            id: team.id,
            teamName: team.team_name,
            email: team.email,
            isAdmin: team.is_admin,
        });

        const response = NextResponse.json({
            success: true,
            team: {
                id: team.id,
                team_name: team.team_name,
                email: team.email,
                members: team.members,
                is_admin: team.is_admin,
            },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
