import { z } from "zod";
import { compact, uniq } from "~/utils/arrays";
import { validate } from "~/utils/errors.server";
import { promiseMap } from "~/utils/promises";
import { Unknown } from "~/utils/types";
import { db } from "../services/db.server";
import { PostActions } from "./Post";

export const BlogModel = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    posts: z
        .array(
            z.object({
                slug: z.string().min(1),
                title: z.string().nullable().default(null),
                content: z.string(),
                viewCount: z.number().optional(),
            })
        )
        .optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Blog = z.infer<typeof BlogModel>;

export class BlogActions {
    public static async get(slug: string, options: { includePosts: boolean }): Promise<Blog> {
        const blog = await db.blog.findUnique({ where: { slug }, include: { posts: options.includePosts } });
        validate(blog !== null, "Blog does not exist", 404);

        return blog;
    }

    public static async list(options: { includePosts: boolean }): Promise<Blog[]> {
        return db.blog.findMany({ include: { posts: options.includePosts } });
    }

    public static async create(raw: Unknown<Blog[]>): Promise<Blog[]> {
        const blogs = BlogModel.array().nonempty().parse(raw);

        const items = await promiseMap(blogs, async ({ name, slug: blogSlug, posts = [] }) => {
            validate((await db.blog.findUnique({ where: { slug: blogSlug } })) === null, "Blog already exists", 409);
            validate(uniq(posts.map(({ slug }) => slug)).length === posts.length, "Duplicate post slugs", 409);

            await db.blog.create({ data: { name, slug: blogSlug } });
            await PostActions.create(blogSlug, posts);

            return this.get(blogSlug, { includePosts: true });
        });

        return compact(items);
    }

    public static async delete(slug: string): Promise<boolean> {
        validate((await db.blog.findUnique({ where: { slug } })) !== null, "Blog does not exist", 404);

        try {
            await db.post.deleteMany({ where: { blogSlug: slug } });
            await db.blog.delete({ where: { slug } });

            return true;
        } catch (error: any) {
            return false;
        }
    }
}
