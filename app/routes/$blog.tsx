import { json, LoaderFunction, useLoaderData } from "remix";
import { ItemList } from "~/components/item-list/ItemList";
import { Blog, BlogActions } from "~/models/Blog";
import { validate } from "~/utils/errors.server";

interface LoaderData {
    blog: Blog;
}

export const loader: LoaderFunction = async ({ params }) => {
    validate(params.blog, "Please provide a blog slug", 400);

    const blog = await BlogActions.get(params.blog, { includePosts: true });

    return json<LoaderData>({ blog });
};

export default function Index() {
    const { blog } = useLoaderData<LoaderData>();

    const items = blog.posts?.map((post, index) => ({
        title: post.title ?? `Post ${index + 1}`,
        link: `/${blog.slug}/${post.slug}`,
        label: `${post.viewCount} views`,
    }));

    return <ItemList items={items ?? []} />;
}
