import { EvaluationType } from "src/app/models/evaluation.model";

import { Exercise } from "./exercise.interface";

export class ExerciseFactory {

  static create(

    type: EvaluationType

  ): Exercise {

    throw new Error(

      "Exercise no implementado: " + type

    );

  }

}