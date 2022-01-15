import React from "react";
import { Links, LiveReload, Meta, MetaFunction, Outlet, Scripts, ScrollRestoration } from "remix";

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

const App: React.FC = () => {
    return <Outlet />;
};
