import { useEffect, useRef } from "react";
import { LoaderFunction, useLoaderData } from "remix";
import SwaggerUI from "swagger-ui";
import swaggerStyles from "swagger-ui/dist/swagger-ui.css";
import { authenticator } from "~/services/auth.server";

export const links = () => {
    return [{ rel: "stylesheet", href: swaggerStyles }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);
    return { apiKey: user?.apiToken };
};

export default function Index() {
    const data = useLoaderData();
    const swaggerRef = useRef(null);

    useEffect(() => {
        const ui = SwaggerUI({
            domNode: swaggerRef.current,
            url: "/api/swagger.json",
            onComplete: () => {
                if (data.apiKey) ui.preauthorizeApiKey("headerKey", data.apiKey);
            },
        });
    }, []);

    return <div ref={swaggerRef} />;
}
