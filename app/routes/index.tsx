import { LoaderFunction, Outlet, redirect } from "remix";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);
    if (!user) return redirect("/auth/login");

    return {};
};

export default function Index() {
    return <Outlet />;
}
