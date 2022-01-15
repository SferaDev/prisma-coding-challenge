import { UserActions } from "~/models/User";
import { getQueryParam } from "~/utils/url.server";

export async function isValidApiKey(request: Request) {
    const headerToken = request.headers.get("x-api-key");
    const qsToken = getQueryParam(request, "token");
    const apiToken = headerToken ?? qsToken;

    console.log(apiToken);
    if (!apiToken) return false;

    return UserActions.validateToken(apiToken);
}
