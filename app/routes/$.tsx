import { MetaFunction, Outlet } from "remix";

export const meta: MetaFunction = () => {
    return { title: "Prisma coding challenge" };
};

export default function Index() {
    return <Outlet />;
}
