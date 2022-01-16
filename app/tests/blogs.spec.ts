import { db } from "~/services/db.server";
import { randomUid } from "~/utils/uids";
import { action as actionBlogs } from "../routes/api/blogs";
import { action as actionBlog, loader as loaderBlog } from "../routes/api/blogs.$blog";
import { loader as loaderBlogPosts } from "../routes/api/blogs.$blog.posts";
import { action as actionBlogPost } from "../routes/api/blogs.$blog.posts.$post";
import { callEndpoint } from "./testUtils";

const apiToken = "161a8803-c0d8-4164-a70d-990e33bb550a";

describe("Integration tests for Blogs", () => {
    beforeAll(async () => {
        await db.user.create({
            data: { email: "test@local", name: "Test user", apiToken, active: true },
        });
    });

    afterAll(async () => {
        await db.user.delete({ where: { email: "test@local" } });
    });

    it("Should create a new blog without posts", async () => {
        const blog = {
            name: "Test Blog",
            slug: `test-blog-${randomUid()}`,
        };

        // Create a new blog
        const createBlogResponse = await callEndpoint({
            endpoint: actionBlogs,
            method: "POST",
            route: "blogs",
            body: [blog],
            apiToken,
        });
        expect(createBlogResponse).toHaveLength(1);
        expect(createBlogResponse[0]).toHaveProperty("slug", blog.slug);

        // Ensure the blog was created
        const getBlogResponse = await callEndpoint({
            endpoint: loaderBlog,
            method: "GET",
            route: `blogs/${blog.slug}`,
            params: { blog: blog.slug },
            apiToken,
        });
        expect(getBlogResponse).toHaveProperty("slug", blog.slug);

        // Validate the blog exists in the database
        const validateDbExistsResponse = await db.blog.findUnique({ where: { slug: blog.slug } });
        expect(validateDbExistsResponse).toBeDefined();

        // Remove the blog
        await callEndpoint({
            endpoint: actionBlog,
            method: "DELETE",
            route: `blogs/${blog.slug}`,
            params: { blog: blog.slug },
            apiToken,
        });

        // Validate the blog was removed from the database
        const validateDbRemovedResponse = await db.blog.findUnique({ where: { slug: blog.slug } });
        expect(validateDbRemovedResponse).toBeNull();
    });

    it("Should create a new blog with posts", async () => {
        const blog = {
            name: "Test Blog",
            slug: `test-blog-${randomUid()}`,
            posts: [
                {
                    title: "Test Post 1 ",
                    slug: `test-post-${randomUid()}`,
                    content: "Test content",
                },
                {
                    title: "Test Post 2",
                    slug: `test-post-${randomUid()}`,
                    content: "Test content",
                },
            ],
        };

        // Create a new blog
        const createBlogResponse = await callEndpoint({
            endpoint: actionBlogs,
            method: "POST",
            route: "blogs",
            body: [blog],
            apiToken,
        });
        expect(createBlogResponse).toHaveLength(1);
        expect(createBlogResponse[0]).toHaveProperty("slug", blog.slug);

        // Ensure the blog was created
        const getBlogResponse = await callEndpoint({
            endpoint: loaderBlog,
            method: "GET",
            route: `blogs/${blog.slug}`,
            params: { blog: blog.slug },
            apiToken,
        });
        expect(getBlogResponse).toHaveProperty("slug", blog.slug);

        // Ensure the blog posts were created
        const getBlogPostsResponse = await callEndpoint({
            endpoint: loaderBlogPosts,
            method: "GET",
            route: `blogs/${blog.slug}/posts`,
            params: { blog: blog.slug },
            apiToken,
        });
        expect(getBlogPostsResponse).toHaveLength(2);

        // Remove the blog
        await callEndpoint({
            endpoint: actionBlogPost,
            method: "DELETE",
            route: `blogs/${blog.slug}/posts/${blog.posts[0].slug}`,
            params: { blog: blog.slug, post: blog.posts[0].slug },
            apiToken,
        });

        // Ensure one of the blog posts has been deleted
        const getBlogPostsAfterDeleteResponse = await callEndpoint({
            endpoint: loaderBlogPosts,
            method: "GET",
            route: `blogs/${blog.slug}/posts`,
            params: { blog: blog.slug },
            apiToken,
        });
        expect(getBlogPostsAfterDeleteResponse).toHaveLength(1);
        expect(getBlogPostsAfterDeleteResponse[0]).toHaveProperty("slug", blog.posts[1].slug);

        // Validate the blog exists in the database
        const validateDbExistsResponse = await db.blog.findUnique({ where: { slug: blog.slug } });
        expect(validateDbExistsResponse).toBeDefined();

        // Remove the blog
        await callEndpoint({
            endpoint: actionBlog,
            method: "DELETE",
            route: `blogs/${blog.slug}`,
            params: { blog: blog.slug },
            apiToken,
        });

        // Validate the blog was removed from the database
        const validateDbRemovedResponse = await db.blog.findUnique({ where: { slug: blog.slug } });
        expect(validateDbRemovedResponse).toBeNull();
    });
});
