import { NodeCoordinates } from "./NodeCoordinates";
import { generateUniqueStringOfCircularPath } from "./generateUniqueStringOfCircularPath";
import { getOrCreateMapOfMapFun } from "./getOrCreateMapOfMapFun";
import { node_coordinates_to_intersect_routes_unique } from "./node_coordinates_to_intersect_routes_unique";
import { intersection_filter_with_cycle_route_find_one_old } from "./intersection_filter_with_cycle_route_find_one_old";

export function cacheble_intersection_filter_with_cycle_route_find_one({
    cycle_route,
    node_coordinates,
}: {
    cycle_route: number[];

    node_coordinates: NodeCoordinates;
}): [[number, number], [number, number]] | false {
    // const getOrCreateSetOfMap = getOrCreateSetOfMapFun(
    //     node_coordinates_to_intersect_routes_unique
    // );
    const map = getOrCreateMapOfMapFun(
        node_coordinates_to_intersect_routes_unique,
        node_coordinates
    );
    const unique_string = generateUniqueStringOfCircularPath(cycle_route);
    if (map.has(unique_string)) {
        const cached = map.get(unique_string);
        if (!cached) {
            return false;
        }
    }
    const result = intersection_filter_with_cycle_route_find_one_old({
        cycle_route,
        node_coordinates,
    });
    // if (result) {
    //     return result;
    // } else {
    map.set(unique_string, Boolean(result));

    return result;
    // }
}
