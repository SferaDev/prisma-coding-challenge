export function getQueryParam(request: Request, param: string) {
    const url = new URL(request.url);
    return url.searchParams.get(param);
}
