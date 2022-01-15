import { ActionFunction, json, LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import { BlogActions } from "~/models/Blog";
import { isValidApiKey } from "~/services/guard.server";
import { getQueryParam } from "~/utils/url.server";

export const loader: LoaderFunction = async ({ params, request }) => {
    invariant(await isValidApiKey(request), "Invalid API token");
    invariant(params.blog, "Please provide a blog slug");

    const includePostsParam = getQueryParam(request, "includePosts") ?? "false";
    const includePosts = includePostsParam !== "false";

    const data = await BlogActions.get(params.blog, { includePosts });
    return json(data);
};

export const action: ActionFunction = async ({ params, request }) => {
    invariant(params.blog, "Please provide a blog slug");

    switch (request.method) {
        case "DELETE": {
            return BlogActions.delete(params.blog);
        }
        default: {
            throw new Error("Method not allowed");
        }
    }
};
