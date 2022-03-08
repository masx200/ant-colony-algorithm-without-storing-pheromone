import EventEmitterTargetClass from "@masx200/event-emitter-target";
import { SparseMatrixSymmetry } from "../matrixtools/SparseMatrixSymmetry";
import { asserttrue } from "../test/asserttrue";
import { adaptiveTabooSingleIterateTSPSearchSolve } from "./adaptiveTabooSingleIterateTSPSearchSolve";
import { createpathTabooList } from "../pathTabooList/createPathTabooList";
import { createPheromonestore } from "./createPheromonestore";
import { DataOfFinishAllIteration } from "./DataOfFinishAllIteration";
import { DataOfFinishOneIteration } from "./DataOfFinishOneIteration";
import { DataOfFinishOneRoute } from "./DataOfFinishOneRoute";
import { Greedyalgorithmtosolvetspwithallstartbest } from "./Greedyalgorithmtosolvetspwithallstartbest";
import { Nodecoordinates } from "./Nodecoordinates";
import { PathTabooList } from "../pathTabooList/PathTabooList";
const finishalliterationsflag = Symbol();
const finishonerouteflag = Symbol();
const finishoneiterationflag = Symbol();
export interface TSPRunner {
    gettotaltimems: () => number;
    onfinishalliterations: (
        callback: (data: DataOfFinishAllIteration) => void
    ) => void;
    runiterations: (iterations: number) => void;
    onfinishoneiteration: (
        callback: (data: DataOfFinishOneIteration) => void
    ) => void;
    onfinishoneroute: (callback: (data: DataOfFinishOneRoute) => void) => void;
    getlengthofstagnant: () => number;
    getnumberofiterations: () => number;
    getnumberofstagnant: () => number;
    getglobalbestlength: () => number;
    getglobalbestroute: () => number[];
    getcurrentsearchcount: () => number;
    pheromonestore: SparseMatrixSymmetry<number>;
    betazero: number;
    maxnumberofstagnant: number;
    nodecoordinates: Nodecoordinates;
    alphazero: number;
    searchloopcountratio: number;
    numberofants: number;
    maxnumberofiterations: number;
    pathTabooList: PathTabooList<number>;
    [Symbol.toStringTag]: string;
}

export function createTSPrunner({
    pheromonevolatilitycoefficientR2 = 0.1,
    pheromoneintensityQ = 1,
    nodecoordinates,
    alphazero = 1,
    betazero = 5,
    searchloopcountratio = 100,
    numberofants = 10,
    maxnumberofiterations = 1000,
    maxnumberofstagnant = 30,
}: {
    pheromonevolatilitycoefficientR2: number;
    pheromoneintensityQ: number;
    nodecoordinates: Nodecoordinates;
    alphazero: number;
    betazero: number;
    searchloopcountratio: number;
    numberofants: number;
    maxnumberofiterations: number;
    maxnumberofstagnant: number;
}): TSPRunner {
    const pheromonevolatilitycoefficientR1 =
        1 - Math.pow(1 - pheromonevolatilitycoefficientR2, 1 / numberofants);

    console.log({
        numberofants,
        pheromonevolatilitycoefficientR1,
        pheromonevolatilitycoefficientR2,
        pheromoneintensityQ,
    });
    let lastrandomselectionprobability = 0;
    let totaltimems = 0;
    const gettotaltimems = () => {
        return totaltimems;
    };

    const countofnodes = nodecoordinates.length;
    const pathTabooList = createpathTabooList(countofnodes);
    const pheromonestore = createPheromonestore(countofnodes);
    let currentsearchcount = 0;
    const getcurrentsearchcount = () => {
        return currentsearchcount;
    };
    const setbestlength = (bestlength: number) => {
        globalbestlength = bestlength;
    };
    const setbestroute = (route: number[]) => {
        globalbestroute = route;
    };
    let globalbestroute: number[] = [];
    const getglobalbestroute = () => {
        return globalbestroute;
    };
    let globalbestlength: number = Infinity;
    const getglobalbestlength = () => {
        return globalbestlength;
    };
    let numberofstagnant = 0;
    const getnumberofstagnant = () => {
        return numberofstagnant;
    };
    let numberofiterations = 0;
    const getnumberofiterations = () => {
        return numberofiterations;
    };
    let lengthofstagnant = Infinity;
    const getlengthofstagnant = () => {
        return lengthofstagnant;
    };
    const emitter = EventEmitterTargetClass();

    const onfinishoneroute = (
        callback: (data: DataOfFinishOneRoute) => void
    ) => {
        emitter.on(finishonerouteflag, callback);
    };
    const emitfinishoneroute = (data: DataOfFinishOneRoute) => {
        emitter.emit(finishonerouteflag, data);
    };
    const onfinishoneiteration = (
        callback: (data: DataOfFinishOneIteration) => void
    ) => {
        emitter.on(finishoneiterationflag, callback);
    };
    const emitfinishoneiteration = (data: DataOfFinishOneIteration) => {
        emitter.emit(finishoneiterationflag, data);
    };
    let stagnantlength = Infinity;
    const runoneiteration = () => {
        if (currentsearchcount === 0) {
            const starttime = Number(new Date());
            const { route, totallength } =
                Greedyalgorithmtosolvetspwithallstartbest(nodecoordinates);
            const endtime = Number(new Date());
            const countofloops = countofnodes * countofnodes;
            const timems = endtime - starttime;
            totaltimems += timems;
            emitfinishoneroute({
                route,
                totallength,
                timems,
                countofloops,
            });
            currentsearchcount++;
            stagnantlength = totallength;
            globalbestlength = totallength;
            globalbestroute = route;
        }
        if (
            maxnumberofiterations > numberofiterations &&
            maxnumberofstagnant / numberofants > numberofstagnant
        ) {
            const starttime = Number(new Date());

            const {
                nextrandomselectionprobability,
                routesandlengths,
                pheromoneDiffusionProbability,
                populationrelativeinformationentropy,
                ispheromoneDiffusion,
                optimallengthofthisround,
                optimalrouteofthisround,
            } = adaptiveTabooSingleIterateTSPSearchSolve({
                emitfinishoneroute,
                setbestroute,
                setbestlength,
                getbestlength: getglobalbestlength,
                getbestroute: getglobalbestroute,
                pathTabooList,
                pheromonestore,
                nodecoordinates,
                numberofants,
                alphazero,
                betazero,
                lastrandomselectionprobability,
                searchloopcountratio,
                pheromonevolatilitycoefficientR2,
                pheromonevolatilitycoefficientR1,
                pheromoneintensityQ,
            });

            const endtime = Number(new Date());

            if (
                routesandlengths.every(
                    ({ totallength }) => totallength === stagnantlength
                )
            ) {
                numberofstagnant++;
            } else {
                numberofstagnant = 0;
            }
            stagnantlength = routesandlengths[0].totallength;
            lastrandomselectionprobability = nextrandomselectionprobability;
            // console.log({ routesandlengths });
            const timems = endtime - starttime;
            totaltimems += timems;
            currentsearchcount += numberofants;
            numberofiterations++;
            emitfinishoneiteration({
                pheromoneDiffusionProbability,
                optimallengthofthisround,
                optimalrouteofthisround,
                populationrelativeinformationentropy,
                ispheromoneDiffusion,
                randomselectionprobability: nextrandomselectionprobability,
                timems,
            });
        } else {
            const timems = totaltimems;
            emitfinishalliterations({
                timems,
                globalbestlength,
                globalbestroute,
            });
        }
    };
    const runiterations = (iterations: number) => {
        asserttrue(iterations > 0);

        for (let i = 0; i < iterations; i++) {
            if (
                maxnumberofiterations > numberofiterations &&
                maxnumberofstagnant / numberofants > numberofstagnant
            ) {
                runoneiteration();
            } else {
                break;
            }
        }
    };

    const onfinishalliterations = (
        callback: (data: DataOfFinishAllIteration) => void
    ) => {
        emitter.on(finishalliterationsflag, callback);
    };
    const emitfinishalliterations = (data: DataOfFinishAllIteration) => {
        emitter.emit(finishalliterationsflag, data);
    };
    const result: TSPRunner = {
        gettotaltimems,
        onfinishalliterations,
        runiterations,
        onfinishoneiteration,
        onfinishoneroute,
        getlengthofstagnant,
        getnumberofiterations,
        getnumberofstagnant,
        getglobalbestlength,
        getglobalbestroute,
        getcurrentsearchcount,
        pheromonestore,
        betazero,
        maxnumberofstagnant,
        nodecoordinates,
        alphazero,
        searchloopcountratio,
        numberofants,
        maxnumberofiterations,
        pathTabooList,
        [Symbol.toStringTag]: "TSPRunner",
    };
    return result;
}
