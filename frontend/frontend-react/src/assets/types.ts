export interface roomType{
    id: string,
    name: string,
    type: "meeting" | "office" | "relaxation",
    capacity: number,
    facilities: string[],
    isAvailable: boolean,
}