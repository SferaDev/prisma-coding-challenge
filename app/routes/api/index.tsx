import { useEffect, useRef } from "react";
import SwaggerUI from "swagger-ui";
import swaggerStyles from "swagger-ui/dist/swagger-ui.css";

export const links = () => {
    return [{ rel: "stylesheet", href: swaggerStyles }];
};

export default function Index() {
    const swaggerRef = useRef(null);

    useEffect(() => {
        SwaggerUI({ domNode: swaggerRef.current, url: "/api/swagger.json" });
    }, []);

    return <div ref={swaggerRef} />;
}
