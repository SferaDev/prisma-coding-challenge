import { LoaderFunction } from "remix";

export const loader: LoaderFunction = async () => {
    throw new Error("API Route not found");
};
