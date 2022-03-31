import { assert_true } from "../test/assert_true";
import { GetDistanceBySerialNumber } from "./GetDistanceBySerialNumber";
import { GetPheromone } from "./GetPheromone";

export function calc_state_transition_probabilities({
    getpheromone,
    nextnode,
    currentnode,
    alpha,
    getdistancebyserialnumber,
    beta,
}: {
    getpheromone: GetPheromone;
    nextnode: number;
    currentnode: number;
    alpha: number;
    getdistancebyserialnumber: GetDistanceBySerialNumber;
    beta: number;
}) {
    const phermone = getpheromone(nextnode, currentnode);
    //console.log("phermone", phermone);
    assert_true(phermone > 0);
    const weight =
        Math.pow(phermone, alpha) /
        Math.pow(getdistancebyserialnumber(nextnode, currentnode), beta);
    //console.log("weight", weight);
    //   if (weight < 0) {
    //       debugger;
    //   }
    assert_true(weight > 0);
    return weight;
}
