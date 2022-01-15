import { z } from "zod";
import { db } from "~/utils/db.server";
import { Unknown } from "~/utils/types";

export const UserModel = z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    email: z.string().min(1),
    apiToken: z.string().optional(),
});

export type User = z.infer<typeof UserModel>;

export class UserActions {
    public static async getOrCreate(data: Unknown<User>) {
        const { name, email } = UserModel.parse(data);

        const user = await db.user.findUnique({ where: { email } });
        if (user) return user;

        return db.user.create({ data: { name, email } });
    }

    public static async validateToken(apiToken: string) {
        const user = await db.user.findFirst({ where: { apiToken } });
        return !!user;
    }
}
