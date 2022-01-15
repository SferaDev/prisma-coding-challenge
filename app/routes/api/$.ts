import { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import { isValidApiKey } from "~/services/guard.server";

export const loader: LoaderFunction = async ({request}) => {
    invariant(await isValidApiKey(request), "Invalid API token");

    throw new Error("API Route not found");
};
