import type { LoaderFunction } from "remix";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
    return authenticator.authenticate("github", request, {
        successRedirect: "/",
        failureRedirect: "/login",
    });
};
