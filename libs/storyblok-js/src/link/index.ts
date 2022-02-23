export type Link = {
    id: number,
    uuid: string,
    slug: string,
    name: string,
    is_folder: boolean,
    parent_id: number,
    published: boolean,
    position: number,
    is_startpage: boolean
}

export type Links = Record<string, Link | undefined>