export type Never<T> = {
    [P in keyof T]: never;
};
