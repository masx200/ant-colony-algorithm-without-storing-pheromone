import { combinations } from "combinatorial-generators";
import { geteuclideandistancebyindex } from "./geteuclideandistancebyindex";
import { Nodecoordinates } from "./Nodecoordinates";

/* 获得节点的所有组合之间的距离数组,无固定顺序 */
export function getalldistancesofnodes(
    nodecoordinates: Nodecoordinates
): number[] {
    // let { length } = nodecoordinates;
    let inputarray = Array(nodecoordinates.length)
        .fill(0)
        .map((_v, i) => i);
    return [...combinations(inputarray, 2)].map(([left, right]) =>
        geteuclideandistancebyindex(left, right, nodecoordinates)
    );
}
