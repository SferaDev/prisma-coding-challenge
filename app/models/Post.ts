import { z } from "zod";
import { uniq } from "~/utils/arrays";
import { validate } from "~/utils/errors.server";
import { promiseMap } from "~/utils/promises";
import { Unknown } from "~/utils/types";
import { db } from "../services/db.server";
import { Blog, BlogActions } from "./Blog";

export const PostModel = z.object({
    slug: z.string().min(1),
    title: z.string().nullable().default(null),
    content: z.string(),
    viewCount: z.number().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Post = z.infer<typeof PostModel>;

export class PostActions {
    public static async get(blogSlug: string, slug: string): Promise<Post> {
        const post = await db.post.findUnique({ where: { blogSlug_slug: { blogSlug, slug } } });
        validate(post !== null, "Post does not exist", 404);

        return post;
    }

    public static async list(blogSlug: string): Promise<Post[]> {
        return db.post.findMany({ where: { blogSlug } });
    }

    public static async view(blogSlug: string, slug: string): Promise<void> {
        const { viewCount = 0 } = await this.get(blogSlug, slug);

        await db.post.update({
            where: { blogSlug_slug: { blogSlug, slug } },
            data: { viewCount: viewCount + 1 },
        });
    }

    public static async create(blogSlug: string, body: Unknown<Post[]>): Promise<Blog> {
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

        return BlogActions.get(blogSlug, { includePosts: true });
    }

    public static async delete(blogSlug: string, slug: string): Promise<boolean> {
        validate(
            (await db.post.findUnique({ where: { blogSlug_slug: { blogSlug, slug } } })) !== null,
            "Post does not exist",
            404
        );

        try {
            await db.post.delete({ where: { blogSlug_slug: { blogSlug, slug } } });

            return true;
        } catch (error: any) {
            return false;
        }
    }
}
