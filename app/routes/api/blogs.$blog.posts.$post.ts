import { ActionFunction, json, LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import { PostActions } from "~/models/Post";
import { isValidApiKey } from "~/services/guard.server";

export const loader: LoaderFunction = async ({ params, request }) => {
    invariant(await isValidApiKey(request), "Invalid API token");
    invariant(params.blog, "Please provide a blog slug");
    invariant(params.post, "Please provide a post slug");

    const data = await PostActions.get(params.blog, params.post);
    return json(data);
};

export const action: ActionFunction = async ({ params, request }) => {
    invariant(params.blog, "Please provide a blog slug");
    invariant(params.post, "Please provide a post slug");

    switch (request.method) {
        case "DELETE": {
            return PostActions.delete(params.blog, params.post);
        }
        default: {
            throw new Error("Method not allowed");
        }
    }
};
