import { Link } from "remix";

export const ItemList: React.FC<ItemListProps> = ({ items }) => {
    return (
        <>
            {items?.map((item, index) => (
                <Link className="w-full" to={item.link}>
                    <div className="w-full p-5 hover:bg-gray-200 rounded-lg">
                        <div className="flex flex-col justify-between md:flex-row">
                            <div className="text-gray-300 text-left my-auto">{index + 1}</div>
                            <h4 className="w-full text-lg font-medium text-gray-900 md:text-xl mx-4">{item.title}</h4>
                            {item.label !== undefined && (
                                <p className="w-32 text-left text-gray-500 md:text-right">{item.label}</p>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </>
    );
};

export interface ItemListProps {
    items: ItemListItem[];
}

export interface ItemListItem {
    title: string;
    link: string;
    label?: string;
}
