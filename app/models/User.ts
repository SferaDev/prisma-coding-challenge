import { z } from "zod";
import { db } from "~/services/db.server";
import { Unknown } from "~/utils/types";

export const UserModel = z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    email: z.string().min(1),
    apiToken: z.string().optional(),
    active: z.boolean().optional(),
});

export type User = z.infer<typeof UserModel>;

export class UserActions {
    public static async getOrCreate(data: Unknown<User>) {
        const { name, email, active } = UserModel.parse(data);

        const user = await db.user.findUnique({ where: { email } });
        if (user) return user;

        return db.user.create({ data: { name, email, active } });
    }

    public static async validateToken(apiToken: string) {
        const user = await db.user.findFirst({ where: { apiToken } });
        return user?.active ?? false;
    }
}
