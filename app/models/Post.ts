import { z } from "zod";
import { uniq } from "~/utils/arrays";
import { validate } from "~/utils/errors.server";
import { promiseMap } from "~/utils/promises";
import { Unknown } from "~/utils/types";
import { db } from "../utils/db.server";

export const PostModel = z.object({
    title: z.string().optional(),
    slug: z.string().min(1),
    content: z.string(),
});

export type Post = z.infer<typeof PostModel>;

export class PostActions {
    public static async get(blogSlug: string, slug: string) {
        const post = await db.post.findUnique({ where: { blogSlug_slug: { blogSlug, slug } } });
        validate(post !== null, "Post does not exist", 404);

        return post;
    }

    public static async list(blogSlug: string) {
        return db.post.findMany({ where: { blogSlug } });
    }

    public static async create(blogSlug: string, body: Unknown<Post[]>) {
        const posts = PostModel.array().nonempty().parse(body);

        validate(uniq(posts.map(({ slug }) => slug)).length === posts.length, "Duplicate post slugs", 409);
        validate(
            (
                await promiseMap(posts, async ({ slug }) =>
                    db.post.findUnique({ where: { blogSlug_slug: { blogSlug, slug } } })
                )
            ).every(post => post === null),
            "One of the posts already exists",
            409
        );

        await promiseMap(posts, async ({ title, slug: postSlug, content }) =>
            db.post.create({ data: { title, slug: postSlug, content, blog: { connect: { slug: blogSlug } } } })
        );

        return db.blog.findUnique({ where: { slug: blogSlug }, include: { posts: true } });
    }

    public static async delete(blogSlug: string, slug: string) {
        validate(
            (await db.post.findUnique({ where: { blogSlug_slug: { blogSlug, slug } } })) !== null,
            "Post does not exist",
            404
        );

        await db.post.delete({ where: { blogSlug_slug: { blogSlug, slug } } });

        return true;
    }
}
