// import { WayOfConstruct } from "./WayOfConstruct";

// import { DataOfGlobalBest } from "./DataOfGlobalBest";

export type DataOfFinishOneRoute = {
    weight_of_opt_best: number;
    weight_of_opt_current: number;
    // way_of_construct: WayOfConstruct;
    globalbestlength: number;
    total_time_ms: number;
    current_search_count: number;
    time_ms_of_one_route: number;
    route: number[];
    totallength: number;
    // countofloops: number;
};
//& DataOfGlobalBest;
