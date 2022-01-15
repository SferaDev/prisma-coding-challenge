import { ActionFunction, LoaderFunction } from "remix";

export async function callEndpoint(options: {
    endpoint: LoaderFunction | ActionFunction;
    method: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
    route: string;
    params?: { [key: string]: string };
    body?: any;
}) {
    const { endpoint, method, route, body, params = {} } = options;
    const request = new Request(`${process.env.BASE_URL}/api/${route}`, { method, body: JSON.stringify(body) });
    const response = await endpoint({ request, params, context: {} });

    return response.json ? response.json() : response;
}
