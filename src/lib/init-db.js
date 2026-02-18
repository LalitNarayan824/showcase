import pool from "./db.js";
import { hashPassword } from "./auth.js";

export async function initDatabase() {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        team_name VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        members TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

        await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        project_name VARCHAR(200) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

        // Seed admin user if not exists
        const adminEmail = process.env.ADMIN_EMAIL || "admin@showcase.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        const existing = await client.query(
            "SELECT id FROM teams WHERE email = $1",
            [adminEmail]
        );

        if (existing.rows.length === 0) {
            const hash = await hashPassword(adminPassword);
            await client.query(
                `INSERT INTO teams (team_name, email, password_hash, members, is_admin)
         VALUES ($1, $2, $3, $4, $5)`,
                ["Admin", adminEmail, hash, "Admin User", true]
            );
            console.log("Admin user seeded.");
        }

        console.log("Database initialized.");
    } finally {
        client.release();
    }
}
