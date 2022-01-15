import React from "react";
import {
    Form,
    Links,
    LiveReload,
    LoaderFunction,
    Meta,
    MetaFunction,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "remix";
import { GitHubLogin } from "./components/github-login/GitHubLogin";
import { authenticator } from "./services/auth.server";
import styles from "./tailwind.css";

export const meta: MetaFunction = () => {
    return { title: "Prisma coding challenge" };
};

export default function Root() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <App />
                <ScrollRestoration />
                <Scripts />
                {process.env.NODE_ENV === "development" && <LiveReload />}
            </body>
        </html>
    );
}

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);
    return { isLoggedIn: !!user };
};

const App: React.FC = () => {
    const data = useLoaderData();

    if (!data.isLoggedIn) {
        return <GitHubLogin />;
    }

    return <Outlet />;
};
