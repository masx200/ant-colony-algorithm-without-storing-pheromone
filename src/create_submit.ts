import { EChartsType } from "echarts";
import { Ref, ShallowRef } from "vue";
import { showanddrawrandomgreedyoftsp } from "./showanddrawrandomgreedyoftsp";
import { TSP_cities_map } from "./TSP_cities_map";

export function create_submit({
    selecteleref,
    chart_store_latest,
    chart_store_best,
}: {
    selecteleref: Ref<HTMLSelectElement | undefined>;
    chart_store_latest: ShallowRef<EChartsType | undefined>;
    chart_store_best: ShallowRef<EChartsType | undefined>;
}) {
    return () => {
        const element = selecteleref.value;
        console.log(element);
        console.log(element?.value);
        const nodecoordinates = TSP_cities_map.get(element?.value || "");
        if (nodecoordinates) {
            console.log(nodecoordinates);
            setTimeout(() => {
                const latestchart = chart_store_latest.value;
                if (latestchart) {
                    showanddrawrandomgreedyoftsp({
                        // resize: latestchart.resize,
                        nodecoordinates,
                        chart: latestchart,
                    });
                }
            });
            setTimeout(() => {
                const bestchart = chart_store_best.value;
                if (bestchart) {
                    showanddrawrandomgreedyoftsp({
                        // resize: bestchart.resize,
                        nodecoordinates,
                        chart: bestchart,
                    });
                }
            });
        }
    };
}
