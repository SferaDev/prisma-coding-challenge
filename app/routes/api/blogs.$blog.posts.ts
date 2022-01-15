import { ActionFunction, json, LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import { PostActions } from "~/models/Post";
import { isValidApiKey } from "~/services/guard.server";

export const loader: LoaderFunction = async ({ params, request }) => {
    invariant(await isValidApiKey(request), "Invalid API token");
    invariant(params.blog, "Please provide a blog slug");

    const data = await PostActions.list(params.blog);
    return json(data);
};

export const action: ActionFunction = async ({ params, request }) => {
    invariant(params.blog, "Please provide a blog slug");

    switch (request.method) {
        case "POST": {
            const posts = await request.json();
            return PostActions.create(params.blog, posts);
        }
        default: {
            throw new Error("Method not allowed");
        }
    }
};
