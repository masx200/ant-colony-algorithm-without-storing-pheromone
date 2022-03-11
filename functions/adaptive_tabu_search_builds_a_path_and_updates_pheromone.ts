import { SparseMatrixSymmetry } from "../matrixtools/SparseMatrixSymmetry";
import { closedtotalpathlength } from "./closed-total-path-length";
import { creategetdistancebyindex } from "./creategetdistancebyindex";
import { cycleroutetosegments } from "./cycleroutetosegments";
import { Nodecoordinates } from "./Nodecoordinates";
import { PathTabooList } from "../pathTabooList/PathTabooList";
import { taboo_backtracking_path_construction } from "./Taboo-backtracking-path-construction";
import { the_pheromone_update_rule_after_each_ant_builds_the_path } from "./the_pheromone_update_rule_after_each_ant_builds_the_path";
// import { DataOfFinishOneRoute } from "./DataOfFinishOneRoute";
import { intersection_filter_with_cycle_route } from "./intersection_filter_with_cycle_route";
import { Emit_Finish_One_Route } from "./createTSPrunner";
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
    emit_finish_one_route: Emit_Finish_One_Route;
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
    if (
        intersection_filter_with_cycle_route({
            cycleroute: route,
            nodecoordinates,
        })
    ) {
        pathTabooList.add(route);
    }
    const bestlength = getbestlength();
    if (bestlength && bestlength >= totallength) {
        //找到更优解,赋值最优解
        setbestlength(totallength);
        setbestroute(route);
    } else {
        pathTabooList.add(route);
    }

    //
    const globalbestroute = getbestroute();
    const globalbestlength = getbestlength();
    const globalbestroutesegments = cycleroutetosegments(globalbestroute);

    //  如果路径长度比最优解得到的结果更差,禁忌此路径
    //  如果路径中存在交叉点,禁忌此路径
    //TODO  尝试3-opt优化,如果得到更优的解,禁忌旧路径,赋值新路径
    //如果此次搜索到的路径长度大于最优解长度,将此路径视为最差路径.
    the_pheromone_update_rule_after_each_ant_builds_the_path({
        current_length: totallength,
        current_route: route,
        nodecoordinates,
        globalbestroute,
        countofnodes,
        globalbestroutesegments,
        globalbestlength,
        pheromoneintensityQ,
        pheromonestore,
        pheromonevolatilitycoefficientR1,
    });

    return { route, totallength };
}
