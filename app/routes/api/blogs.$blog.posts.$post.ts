import { ActionFunction, json, LoaderFunction } from "remix";
import { PostActions } from "~/models/Post";
import { isValidApiKey } from "~/services/guard.server";
import { validate } from "~/utils/errors.server";

export const loader: LoaderFunction = async ({ params, request }) => {
    validate(await isValidApiKey(request), "Invalid API token", 401);
    validate(params.blog, "Please provide a blog slug", 400);
    validate(params.post, "Please provide a post slug", 400);

    const data = await PostActions.get(params.blog, params.post);
    return json(data);
};

export const action: ActionFunction = async ({ params, request }) => {
    validate(params.blog, "Please provide a blog slug", 400);
    validate(params.post, "Please provide a post slug", 400);

    switch (request.method) {
        case "DELETE": {
            return PostActions.delete(params.blog, params.post);
        }
        default: {
            throw new Error("Method not allowed");
        }
    }
};
