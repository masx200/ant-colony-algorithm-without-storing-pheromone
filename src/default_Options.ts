import { TSPRunnerOptions } from "./TSPRunnerOptions";

export const default_count_of_ants = 12;
export const default_search_rounds = 170;
export const default_search_time_seconds = 900;
export const default_pheromone_volatility_coefficient_R1 = 0.03;

//由局部信息素挥发率决定全局信息素挥发率

export const default_alpha = 1;
export const default_beta = 5;
export const default_pheromone_intensity_Q = 1;
export const default_max_results_of_k_opt = 20;
export const default_max_results_of_2_opt = 10;

export const default_max_coefficient_of_pheromone_diffusion = 20;

export const default_min_coefficient_of_pheromone_diffusion = 10;
export const default_Pheromone_Increase_Coefficient_of_Non_Optimal_Paths = 0.7;
export const default_Cross_Point_Coefficient_of_Non_Optimal_Paths = 0.7;
const DefaultOptions: Omit<Required<TSPRunnerOptions>, "node_coordinates"> = {
    cross_Point_Coefficient_of_Non_Optimal_Paths:
        default_Cross_Point_Coefficient_of_Non_Optimal_Paths,
    max_results_of_2_opt: default_max_results_of_2_opt,
    coefficient_of_pheromone_Increase_Non_Optimal_Paths:
        default_Pheromone_Increase_Coefficient_of_Non_Optimal_Paths,
    min_coefficient_of_pheromone_diffusion:
        default_min_coefficient_of_pheromone_diffusion,
    max_coefficient_of_pheromone_diffusion:
        default_max_coefficient_of_pheromone_diffusion,

    max_results_of_k_opt: default_max_results_of_k_opt,
    pheromone_volatility_coefficient_R1:
        default_pheromone_volatility_coefficient_R1,
    //   pheromone_volatility_coefficient_R2       ,
    pheromone_intensity_Q: default_pheromone_intensity_Q,
    // node_coordinates,
    alpha_zero: default_alpha,
    beta_zero: default_beta,
    count_of_ants: default_count_of_ants,
};
export { DefaultOptions };
