import { Nodecoordinates } from "../functions/Nodecoordinates";

export function TSP_Start(nodecoordinates: Nodecoordinates) {
    console.log("TSP_Start", nodecoordinates);
}
export const TSP_worker: { value?: Worker | undefined } = {};
