import { json } from "remix";

// Validate will throw an API error if the condition is false.
export function validate(condition: any, error: string, status = 500): asserts condition {
    if (!condition) throw json({ status, error }, { status });
}
