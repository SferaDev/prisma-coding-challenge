import { ActionFunction, LoaderFunction, redirect } from "remix";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = () => redirect("/");

export const action: ActionFunction = async ({ request }) => {
    return await authenticator.authenticate("github", request, {
        successRedirect: "/",
        failureRedirect: "/auth/login",
    });
};
