import { ActionFunction, json, LoaderFunction } from "remix";
import { BlogActions } from "~/models/Blog";
import { isValidApiKey } from "~/services/guard.server";
import { validate } from "~/utils/errors.server";
import { getQueryParam } from "~/utils/url.server";

export const loader: LoaderFunction = async ({ params, request }) => {
    validate(await isValidApiKey(request), "Invalid API token", 401);
    validate(params.blog, "Please provide a blog slug", 400);

    const includePostsParam = getQueryParam(request, "includePosts") ?? "false";
    const includePosts = includePostsParam !== "false";

    const data = await BlogActions.get(params.blog, { includePosts });
    return json(data);
};

export const action: ActionFunction = async ({ params, request }) => {
    validate(params.blog, "Please provide a blog slug", 400);

    switch (request.method) {
        case "DELETE": {
            return BlogActions.delete(params.blog);
        }
        default: {
            throw new Error("Method not allowed");
        }
    }
};
