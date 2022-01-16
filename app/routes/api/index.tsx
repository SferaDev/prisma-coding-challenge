import { useEffect, useRef } from "react";
import { json, LoaderFunction, useLoaderData } from "remix";
import SwaggerUI from "swagger-ui";
import swaggerStyles from "swagger-ui/dist/swagger-ui.css";
import { authenticator } from "~/services/auth.server";

export const links = () => {
    return [{ rel: "stylesheet", href: swaggerStyles }];
};

interface LoaderData {
    apiToken?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);
    return json<LoaderData>({ apiToken: user?.apiToken });
};

export default function Index() {
    const { apiToken } = useLoaderData<LoaderData>();
    const swaggerRef = useRef(null);

    useEffect(() => {
        const ui = SwaggerUI({
            domNode: swaggerRef.current,
            url: "/api/swagger.json",
            onComplete: () => {
                if (apiToken) ui.preauthorizeApiKey("headerKey", apiToken);
            },
        });
    }, []);

    return (
        <>
            {apiToken ? <p>API Token: {apiToken}</p> : null}
            <div className="w-full" ref={swaggerRef} />
        </>
    );
}
