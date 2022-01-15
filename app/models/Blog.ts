import invariant from "tiny-invariant";
import { z } from "zod";
import { uniq } from "~/utils/arrays";
import { promiseMap } from "~/utils/promises";
import { Unknown } from "~/utils/types";
import { db } from "../utils/db.server";
import { PostModel } from "./Post";

export const BlogModel = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    posts: z.array(PostModel).optional(),
});

export type Blog = z.infer<typeof BlogModel>;

export class BlogActions {
    public static async get(slug: string, options: { includePosts: boolean }) {
        return db.blog.findUnique({ where: { slug }, include: { posts: options.includePosts } });
    }

    public static async list(options: { includePosts: boolean }) {
        return db.blog.findMany({ include: { posts: options.includePosts } });
    }

    public static async create(raw: Unknown<Blog[]>) {
        const blogs = BlogModel.array().nonempty().parse(raw);

        return promiseMap(blogs, async ({ name, slug: blogSlug, posts = [] }) => {
            invariant((await db.blog.findUnique({ where: { slug: blogSlug } })) === null, "Blog already exists");
            invariant(uniq(posts.map(({ slug }) => slug)).length === posts.length, "Duplicate post slugs");

            await db.blog.create({ data: { name, slug: blogSlug } });

            await promiseMap(posts, async ({ title, slug: postSlug, content }) =>
                db.post.create({ data: { title, slug: postSlug, content, blog: { connect: { slug: blogSlug } } } })
            );

            return db.blog.findUnique({ where: { slug: blogSlug }, include: { posts: true } });
        });
    }

    public static async delete(slug: string) {
        invariant((await db.blog.findUnique({ where: { slug } })) !== null, "Blog does not exist");

        await db.post.deleteMany({ where: { blogSlug: slug } });
        await db.blog.delete({ where: { slug } });

        return true;
    }
}
