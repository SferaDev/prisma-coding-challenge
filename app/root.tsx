import React from "react";
import {
    json,
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
import { Header } from "./components/header/Header";
import { User } from "./models/User";
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
            <body className="min-h-screen bg-gray-50">
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

interface LoaderData {
    user?: User;
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = (await authenticator.isAuthenticated(request)) ?? undefined;

    return json<LoaderData>({ user });
};

const App: React.FC = () => {
    const { user } = useLoaderData<LoaderData>();

    return (
        <>
            <Header user={user} />
            <div className="flex flex-col justify-center items-start max-w-6xl border-gray-200 mx-auto pb-16">
                <Outlet />
            </div>
        </>
    );
};
