import { json, LoaderFunction, useLoaderData } from "remix";
import { ItemList } from "~/components/item-list/ItemList";
import { Blog, BlogActions } from "~/models/Blog";

interface LoaderData {
    blogs: Blog[];
}

export const loader: LoaderFunction = async () => {
    const blogs = await BlogActions.list({ includePosts: false });

    return json<LoaderData>({ blogs });
};

export default function Index() {
    const { blogs } = useLoaderData<LoaderData>();

    const items = blogs.map(blog => ({
        title: blog.name,
        link: `/${blog.slug}`,
    }));

    return <ItemList items={items} />;
}
