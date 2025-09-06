export type Result = {
    datas: Item[]
}

export type Item = {
    id: string,
    title: string,
    url: string,
    description: string,
    engine: string,
    publishedDate?: Date | null,
    extractedDate?: Date | null
}
