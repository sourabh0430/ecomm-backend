export interface CategoryRecord {
    id: number,
    name: string,
    slug: string,
    parent_id: number | null,
    description: string | null
}