import { defineComponent, onMounted, readonly, ref, watch } from "vue";
import { NodeCoordinates } from "../functions/NodeCoordinates";
import { assertnumber } from "../test/assertnumber";
import { asserttrue } from "../test/asserttrue";
import Datatable from "./Datatable-com.vue";
import {
    defaultnumber_of_ants,
    defaultsearchrounds,
    default_pheromone_volatility_coefficient_R1,
    default_search_time_seconds,
} from "./defaultnumber_of_ants";
import { draw_best_route_debounced } from "./draw_best_route_debounced";
import { draw_iteration_rounds_and_information_entropy_chart_debounced } from "./draw_iteration_rounds_and_information_entropy_chart_debounced";
import { draw_latest_route_debounced } from "./draw_latest_route_debounced";
import { draw_path_number_and_current_path_length_chart_debounced } from "./draw_path_number_and_current_path_length_chart_debounced";
import { draw_path_number_and_optimal_path_length_chart_debounced } from "./draw_path_number_and_optimal_path_length_chart_debounced";
import Progresselement from "./Progress-element.vue";
import { RunWay } from "./RunWay";
import { StopTSPWorker } from "./StopTSPWorker";
// import { draw_path_number_and_optimal_path_length_chart } from "./draw_path_number_and_optimal_path_length_chart";
import { TSP_cities_data } from "./TSP_cities_data";
import { TSP_Reset } from "./TSP_Reset";
import TSPWorker from "./TSP_Runner.Worker?worker";
import { TSP_workerRef } from "./TSP_workerRef";
import { use_data_of_one_iteration } from "./use_data_of_one_iteration";
import { use_data_of_one_route } from "./use_data_of_one_route";
import { use_data_of_summary } from "./use_data_of_summary";
import { use_escharts_container_pair } from "./use_escharts_container_pair"; // import { TSPRunner } from "../functions/createTSPrunner";
import { use_history_of_best } from "./use_history_of_best";
import { use_initialize_tsp_runner } from "./use_initialize_tsp_runner";
import { use_run_tsp_by_search_rounds } from "./use_run_tsp-by-search-rounds";
import { use_run_tsp_by_time } from "./use_run_tsp_by_time";
import { use_submit } from "./use_submit";
import { use_tsp_before_start } from "./use_tsp_before_start";
export default defineComponent({
    components: { Datatable, Progresselement: Progresselement },
    setup() {
        /* 进度从0到100 */
        const percentage = ref(0);
        const {
            oneiterationtableheads,
            onreceivedataofoneIteration,
            clearDataOfOneIteration,
            dataofoneiteration,
            oneiterationtablebody,
        } = use_data_of_one_iteration();

        //
        const {
            dataofoneroute,
            oneroutetablebody,
            onreceivedataofoneroute,
            clearDataOfOneRoute,
            oneroutetableheads,
        } = use_data_of_one_route();
        //
        // console.log(dataofoneroute, oneroutetablebody);

        const {
            dataofresult,
            onreceiveDataOfGlobalBest,
            clearDataOfResult,
            resultTableHeads,
            resultTableBody,
            globalBestRouteBody,
            globalBestRouteHeads,
        } = use_data_of_summary();
        // console.log(dataofresult, resultTableBody);
        const {
            clearData: clearDataOfHistoryOfBest,
            TableHeads: TableHeadsOfHistoryOfBest,
            TableBody: TableBodyOfHistoryOfBest,
        } = use_history_of_best(readonly(dataofresult));

        const initializeTSP_runner = use_initialize_tsp_runner({
            onreceiveDataOfGlobalBest,
            onreceivedataofoneroute,
            onreceivedataofoneIteration,
        });
        const TSP_before_Start = use_tsp_before_start(initializeTSP_runner);

        // console.log(dataofoneiteration, oneiterationtableheads);

        const is_running = ref(false);
        const local_pheromone_volatilization_rate = ref(
            default_pheromone_volatility_coefficient_R1
        );
        const disablemapswitching = ref(false);
        const searchrounds = ref(defaultsearchrounds);
        const numberofeachround = ref(defaultnumber_of_ants);
        const selecteleref = ref<HTMLSelectElement>();
        const { container: container_of_best_chart, chart: chart_store_best } =
            use_escharts_container_pair();
        const {
            container: container_of_latest_chart,
            chart: chart_store_latest,
        } = use_escharts_container_pair();
        // const container_of_best_chart = ref<HTMLDivElement>();
        // const container_of_latest_chart = ref<HTMLDivElement>();
        // const {
        //     container:
        //         container_of_iteration_rounds_and_relative_deviation_from_optimal,
        //     chart: iteration_rounds_and_relative_deviation_from_optimal_chart,
        // } = use_escharts_container_pair();
        const {
            container:
                container_of_iteration_rounds_and_information_entropy_chart,
            chart: iteration_rounds_and_information_entropy_chart,
        } = use_escharts_container_pair();
        const {
            container: container_of_path_number_and_current_path_length_chart,
            chart: path_number_and_current_path_length_chart,
        } = use_escharts_container_pair();
        const {
            container: container_of_path_number_and_optimal_path_length_chart,
            chart: path_number_and_optimal_path_length_chart,
        } = use_escharts_container_pair();

        const submit = use_submit({
            selecteleref,
            chart_store_latest,
            chart_store_best,
        });
        const indeterminate = ref(false);
        async function submit_select_node_coordinates() {
            //debounce
            if (indeterminate.value === true) {
                return;
            }
            onprogress(100 * Math.random());
            indeterminate.value = true;
            await submit();
            onprogress(0);
            indeterminate.value = false;
        }
        onMounted(async () => {
            reset();
            // console.log(selecteleref);
            const element = selecteleref.value;
            element && (element.selectedIndex = 0);

            // console.log(containertoechart);
            // console.log(container_of_best_chart);
            // console.log(container_of_latest_chart);

            data_change_listener();
            finish_one_iteration_listener();
            finish_one_route_listener();
            await submit_select_node_coordinates();
            // });
            // });
        });
        const onLatestRouteChange = (
            route: number[],
            node_coordinates: NodeCoordinates
        ) => {
            const latestchart = chart_store_latest.value;
            if (latestchart) {
                draw_latest_route_debounced(
                    route,
                    node_coordinates,
                    latestchart
                );
            }
        };

        const onGlobalBestRouteChange = (
            route: number[],
            node_coordinates: NodeCoordinates
        ) => {
            asserttrue(route.length > 0);
            asserttrue(route.length === node_coordinates.length);
            const chart = chart_store_best.value;
            if (chart) {
                draw_best_route_debounced(route, node_coordinates, chart);
            }
        };
        onMounted(() => {
            //先初始化worker
            // const endpoint = new TSPWorker();

            if (process.env.NODE_ENV === "development") {
                TSP_workerRef.value ||= new TSPWorker();
            }
            // watch(dataOfAllResults, () => {
            //     data_change_listener();
            // });
            watch(dataofoneiteration, () => {
                finish_one_iteration_listener();
            });
            watch(dataofoneroute, () => {
                finish_one_route_listener();
                data_change_listener();
            });
        });
        const data_change_listener = () => {
            draw_path_number_and_optimal_path_length_chart_debounced(
                path_number_and_optimal_path_length_chart,
                dataofoneroute
            );
        };
        const finish_one_iteration_listener = () => {
            draw_iteration_rounds_and_information_entropy_chart_debounced(
                iteration_rounds_and_information_entropy_chart,
                dataofoneiteration
            );
            // draw_iteration_rounds_and_relative_deviation_from_optimal_chart(
            //     iteration_rounds_and_relative_deviation_from_optimal_chart,
            //     dataofoneiteration
            // );
        };

        const finish_one_route_listener = () => {
            draw_path_number_and_current_path_length_chart_debounced(
                path_number_and_current_path_length_chart,
                dataofoneroute
            );
        };
        const onprogress = (p: number) => {
            assertnumber(p)
            percentage.value = Math.min(100, Math.max(0, p));
        };
        const runtsp_by_search_rounds = use_run_tsp_by_search_rounds({
            onprogress,
            TSP_before_Start,
            searchrounds,
            numberofeachround,
            selecteleref,
            local_pheromone_volatilization_rate,
            disablemapswitching,
            is_running,
            onGlobalBestRouteChange,
            onLatestRouteChange,
            finish_one_route_listener,
            finish_one_iteration_listener,
        });
        const TSP_terminate = () => {
            clearDataOfHistoryOfBest();
            TSP_Reset([
                clearDataOfOneRoute,
                clearDataOfOneIteration,
                clearDataOfResult,
            ]);
        };

        const resetold = () => {
            TSP_terminate();
            disablemapswitching.value = false;
            is_running.value = false;
        };
        const reset = (/* first: boolean = false */) => {
            percentage.value = 0;
            resetold();
            disable_stop.value = false;
            // first || location.reload();
        };
        const disable_stop = ref(false);
        const stop_handler = () => {
            StopTSPWorker();
            disable_stop.value = true;
        };
        const resethandler = () => {
            reset();
            location.reload();
        };
        const search_time_seconds = ref(default_search_time_seconds);
        const run_tsp_by_time = use_run_tsp_by_time({
            search_time_seconds,
            numberofeachround,
            selecteleref,
            local_pheromone_volatilization_rate,
            disablemapswitching,
            is_running,
            TSP_before_Start,
            onGlobalBestRouteChange,
            onLatestRouteChange,
            finish_one_route_listener,
            finish_one_iteration_listener,
            onprogress,
        });

        const radio_run_way = ref(RunWay.round);
        const run_way_time = RunWay.time;
        const run_way_round = RunWay.round;
        return {
            run_way_round,
            run_way_time,
            radio_run_way,
            run_tsp_by_time,
            search_time_seconds,
            indeterminate,
            TableHeadsOfHistoryOfBest,
            TableBodyOfHistoryOfBest,
            disable_stop,
            stop_handler,
            globalBestRouteBody,
            globalBestRouteHeads,
            // container_of_iteration_rounds_and_relative_deviation_from_optimal,
            container_of_iteration_rounds_and_information_entropy_chart,
            is_running,
            local_pheromone_volatilization_rate,
            resethandler: resethandler,
            resultTableHeads,
            resultTableBody,
            oneroutetableheads,
            oneroutetablebody,
            oneiterationtableheads,
            oneiterationtablebody,
            numberofeachround,
            container_of_path_number_and_current_path_length_chart,
            disablemapswitching,
            container_of_path_number_and_optimal_path_length_chart,
            runtsp_by_search_rounds,
            searchrounds,
            TSP_cities_data,
            submit_select_node_coordinates,
            selecteleref,
            container_of_best_chart,
            container_of_latest_chart,
            percentage,
        };
    },
});
