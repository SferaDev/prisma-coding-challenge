import { marked } from "marked";
import { json, LoaderFunction, useLoaderData } from "remix";
import { Post, PostActions } from "~/models/Post";
import { validate } from "~/utils/errors.server";

interface LoaderData {
    post: Post;
    html: string;
}

export const loader: LoaderFunction = async ({ params }) => {
    validate(params.blog, "Please provide a blog slug", 400);
    validate(params.post, "Please provide a post slug", 400);

    const post = await PostActions.get(params.blog, params.post);
    const html = marked(post.content, { sanitize: true });

    PostActions.view(params.blog, params.post);

    return json<LoaderData>({ post, html });
};

export default function Index() {
    const { post, html } = useLoaderData<LoaderData>();

    return (
        <>
            <h1 className="w-full text-xl font-medium text-gray-900 my-4">{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </>
    );
}
