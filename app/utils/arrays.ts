export function compact<T>(array: T[]): T[] {
    return array.filter(Boolean);
}

export function uniq<T>(array: T[]): T[] {
    return [...new Set(array)];
}

export function mapValues<Key extends string, Input, Output>(
    object: Record<Key, Input>,
    callback: (value: Input, key: Key) => Output
): Record<Key, Output> {
    return Object.entries(object).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: callback(value as Input, key as Key) }),
        {} as Record<Key, Output>
    );
}
