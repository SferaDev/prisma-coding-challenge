import { LoaderFunction } from "remix";
import { isValidApiKey } from "~/services/guard.server";
import { validate } from "~/utils/errors.server";

export const loader: LoaderFunction = async ({ request }) => {
    validate(await isValidApiKey(request), "Invalid API token", 401);

    throw new Error("API Route not found");
};
