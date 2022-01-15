import { ActionFunction, json, LoaderFunction } from "remix";
import { PostActions } from "~/models/Post";
import { isValidApiKey } from "~/services/guard.server";
import { validate } from "~/utils/errors.server";

export const loader: LoaderFunction = async ({ params, request }) => {
    validate(await isValidApiKey(request), "Invalid API token", 401);
    validate(params.blog, "Please provide a blog slug", 400);

    const data = await PostActions.list(params.blog);
    return json(data);
};

export const action: ActionFunction = async ({ params, request }) => {
    validate(params.blog, "Please provide a blog slug", 400);

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
