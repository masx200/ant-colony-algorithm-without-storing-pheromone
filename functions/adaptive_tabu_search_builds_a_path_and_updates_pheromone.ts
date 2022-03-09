import { SparseMatrixSymmetry } from "../matrixtools/SparseMatrixSymmetry";
import { closedtotalpathlength } from "./closed-total-path-length";
import { creategetdistancebyindex } from "./creategetdistancebyindex";
import { cycleroutetosegments } from "./cycleroutetosegments";
import { Nodecoordinates } from "./Nodecoordinates";
import { PathTabooList } from "../pathTabooList/PathTabooList";
import { taboo_backtracking_path_construction } from "./Taboo-backtracking-path-construction";
import { the_pheromone_update_rule_after_each_ant_builds_the_path } from "./the_pheromone_update_rule_after_each_ant_builds_the_path";
import { DataOfFinishOneRoute } from "./DataOfFinishOneRoute";
/**自适应禁忌搜索构建一条路径并更新信息素 */
export function adaptive_tabu_search_builds_a_path_and_updates_pheromone({
    emit_finish_one_route,
    searchloopcountratio,
    pheromoneintensityQ,
    pheromonevolatilitycoefficientR1,
    nodecoordinates,
    alphazero,

    betazero,
    randomselectionprobability,
    getbestlength,
    pathTabooList,
    pheromonestore,
    setbestlength,
    setbestroute,
    getbestroute,
}: {
    emit_finish_one_route: (
        data: Omit<DataOfFinishOneRoute, "current_search_count">
    ) => void;
    searchloopcountratio: number;
    pheromoneintensityQ: number;
    pheromonevolatilitycoefficientR1: number;
    nodecoordinates: Nodecoordinates;
    alphazero: number;

    betazero: number;
    randomselectionprobability: number;
    getbestlength: () => number;
    pathTabooList: PathTabooList;
    pheromonestore: SparseMatrixSymmetry;
    setbestlength: (a: number) => void;
    setbestroute: (route: number[]) => void;
    getbestroute: () => number[];
}): {
    route: number[];
    totallength: number;
} {
    const countofnodes = nodecoordinates.length;
    // const inputindexs = Array(nodecoordinates.length)
    //     .fill(0)
    //     .map((_v, i) => i);
    // const startnode = getnumberfromarrayofnmber(pickRandom(inputindexs));
    const starttime = Number(new Date());
    const { route, countofloops } = taboo_backtracking_path_construction({
        searchloopcountratio,
        alphazero,

        betazero,
        randomselectionprobability,
        getbestlength,
        nodecoordinates,
        pathTabooList,
        pheromonestore,
        // startnode,
    });
    const endtime = Number(new Date());
    const timems = endtime - starttime;
    const totallength = closedtotalpathlength({
        // countofnodes: route.length,
        path: route,
        getdistancebyindex: creategetdistancebyindex(nodecoordinates),
    });
    emit_finish_one_route({ totallength, route, countofloops, timems });
    const bestlength = getbestlength();
    if (bestlength && bestlength >= totallength) {
        setbestlength(totallength);
        setbestroute(route);
    }

    //
    const globalbestroute = getbestroute();
    const globalbestlength = getbestlength();
    const globalbestroutesegments = cycleroutetosegments(globalbestroute);
    the_pheromone_update_rule_after_each_ant_builds_the_path({
        countofnodes,
        globalbestroutesegments,
        globalbestlength,
        pheromoneintensityQ,
        pheromonestore,
        pheromonevolatilitycoefficientR1,
    });

    return { route, totallength };
}
