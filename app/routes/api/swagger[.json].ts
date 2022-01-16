import { json, LoaderFunction } from "remix";
import { Spec as SwaggerSpec } from "swagger-schema-official";

const spec: SwaggerSpec = {
    swagger: "2.0",
    info: {
        version: "0.0.1",
        title: "Prisma Coding Challenge API",
    },
    host: process.env.BASE_URL?.split("//")[1],
    basePath: "/api",
    tags: [{ name: "blogs" }, { name: "posts" }],
    schemes: [process.env.NODE_ENV === "development" ? "http" : "https"],
    paths: {
        "/blogs": {
            get: {
                security: [{ headerKey: [] }, { queryKey: [] }],
                tags: ["blogs"],
                summary: "Get all blogs",
                parameters: [
                    {
                        name: "includePosts",
                        in: "query",
                        description: "Include posts",
                        required: false,
                        schema: {
                            type: "boolean",
                        },
                    },
                ],
                responses: {
                    default: {
                        description: "All blogs",
                    },
                },
            },
            post: {
                security: [{ headerKey: [] }, { queryKey: [] }],
                tags: ["blogs"],
                summary: "Create new blogs",
                description: "",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [
                    {
                        in: "body",
                        name: "body",
                        required: true,
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/definitions/Blog",
                            },
                        },
                    },
                ],
                responses: {
                    default: {
                        description: "Created blogs",
                    },
                },
            },
        },
        "/blogs/{blog}": {
            get: {
                security: [{ headerKey: [] }, { queryKey: [] }],
                tags: ["blogs"],
                summary: "Get blog by slug",
                parameters: [
                    {
                        name: "blog",
                        in: "path",
                        description: "The blog slug",
                        required: true,
                        type: "string",
                    },
                    {
                        name: "includePosts",
                        in: "query",
                        description: "Include posts",
                        required: false,
                        schema: {
                            type: "boolean",
                        },
                    },
                ],
                responses: {
                    default: {
                        description: "The requested blog",
                    },
                },
            },
            delete: {
                security: [{ headerKey: [] }, { queryKey: [] }],
                tags: ["blogs"],
                summary: "Delete blog",
                parameters: [
                    {
                        name: "blog",
                        in: "path",
                        description: "The blog slug",
                        required: true,
                        type: "string",
                    },
                ],
                responses: {
                    default: {
                        description: "Nothing",
                    },
                },
            },
        },
        "/blogs/{blog}/posts": {
            get: {
                security: [{ headerKey: [] }, { queryKey: [] }],
                tags: ["posts"],
                summary: "Get all blog posts",
                responses: {
                    default: {
                        description: "All blog posts",
                    },
                },
            },
            post: {
                security: [{ headerKey: [] }, { queryKey: [] }],
                tags: ["posts"],
                summary: "Create posts in a blog",
                parameters: [
                    {
                        name: "blog",
                        in: "path",
                        description: "The blog slug",
                        required: true,
                        type: "string",
                    },
                    {
                        in: "body",
                        name: "body",
                        required: true,
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/definitions/Post",
                            },
                        },
                    },
                ],
                responses: {
                    default: {
                        description: "The blog with posts",
                    },
                },
            },
        },
        "/blogs/{blog}/posts/{post}": {
            get: {
                security: [{ headerKey: [] }, { queryKey: [] }],
                tags: ["posts"],
                summary: "Get post by slug",
                parameters: [
                    {
                        name: "blog",
                        in: "path",
                        description: "The blog slug",
                        required: true,
                        type: "string",
                    },
                    {
                        name: "post",
                        in: "path",
                        description: "The post slug",
                        required: true,
                        type: "string",
                    },
                ],
                responses: {
                    default: {
                        description: "The blog post",
                    },
                },
            },
            delete: {
                security: [{ headerKey: [] }, { queryKey: [] }],
                tags: ["posts"],
                summary: "Delete post",
                parameters: [
                    {
                        name: "blog",
                        in: "path",
                        description: "The blog slug",
                        required: true,
                        type: "string",
                    },
                    {
                        name: "post",
                        in: "path",
                        description: "The post slug",
                        required: true,
                        type: "string",
                    },
                ],
                responses: {
                    default: {
                        description: "Nothing",
                    },
                },
            },
        },
    },
    securityDefinitions: {
        headerKey: {
            type: "apiKey",
            name: "x-api-key",
            in: "header",
        },
        queryKey: {
            type: "apiKey",
            name: "token",
            in: "query",
        },
    },
    definitions: {
        Blog: {
            type: "object",
            required: ["name", "slug"],
            properties: {
                name: {
                    type: "string",
                    example: "Example blog",
                },
                slug: {
                    type: "string",
                    example: "example-blog",
                },
                posts: {
                    type: "array",
                    items: {
                        $ref: "#/definitions/Post",
                    },
                },
            },
        },
        Post: {
            type: "object",
            required: ["slug", "content"],
            properties: {
                title: {
                    type: "string",
                    example: "Example Post",
                },
                slug: {
                    type: "string",
                    example: "example-post",
                },
                content: {
                    type: "string",
                    example: "Post content",
                },
            },
        },
    },
};

export const loader: LoaderFunction = async () => {
    return json(spec);
};
