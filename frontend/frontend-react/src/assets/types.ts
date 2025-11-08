export interface roomType{
    id: string,
    name: string,
    type: "meeting" | "office" | "phone-booth",
    capacity: number,
    facilities: string[],
    isAvailable: boolean,
}