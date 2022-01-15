import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
    await db.user.create({
        data: { email: "admin@local", name: "Admin", apiToken: "161a8803-c0d8-4164-a70d-990e33bb550a" },
    });
}

seed();
