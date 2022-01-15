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
import { authenticator } from "./services/auth.server";

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

export const loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);
    return { user };
};

const App: React.FC = () => {
    const data = useLoaderData();

    if (!data.user) {
        return (
            <Form action="/auth/github" method="post">
                <button>Login with GitHub</button>
            </Form>
        );
    }

    return <Outlet />;
};
