import { Throw } from "../../models/throw.model";

import { Evaluation } from
"src/app/models/evaluation.model";

export interface EvaluationContext {

    evaluation: Evaluation;

    throws: Throw[];

    currentThrow: number;

    selectedBox?: number;

    selectedQuadrant?: string;

}