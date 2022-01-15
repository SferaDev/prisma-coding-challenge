import { ActionFunction, json, LoaderFunction } from "remix";
import { BlogActions } from "~/models/Blog";
import { getQueryParam } from "~/utils/url.server";

export const loader: LoaderFunction = async ({ request }) => {
    const includePostsParam = getQueryParam(request, "includePosts") ?? "false";
    const includePosts = includePostsParam !== "false";

    const data = await BlogActions.list({ includePosts });
    return json(data);
};

export const action: ActionFunction = async ({ request }) => {
    switch (request.method) {
        case "POST": {
            const blogs = await request.json();
            return BlogActions.create(blogs);
        }
        default: {
            throw new Error("Method not allowed");
        }
    }
};
