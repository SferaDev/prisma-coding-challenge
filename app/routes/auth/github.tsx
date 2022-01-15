import { ActionFunction, LoaderFunction, redirect } from "remix";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = () => redirect("/");

export const action: ActionFunction = ({ request }) => {
    return authenticator.authenticate("github", request);
};
