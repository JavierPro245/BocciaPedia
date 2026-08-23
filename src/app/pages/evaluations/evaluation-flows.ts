import { EvaluationType } from "src/app/models/evaluation.model";

export type EvaluationFlowType =
  | 'continuous'
  | 'independent';

export interface EvaluationFlow {

  type: EvaluationFlowType;

  placeJackEveryAttempt: boolean;

  resetCourtEveryAttempt: boolean;

}

export const EvaluationFlows: Record<EvaluationType, EvaluationFlow> = {

  'First Ball': {

    type: 'independent',

    placeJackEveryAttempt: true,

    resetCourtEveryAttempt: true

  },

  'Placement': {

    type: 'continuous',

    placeJackEveryAttempt: false,

    resetCourtEveryAttempt: false

  },

  'Push On': {

    type: 'continuous',

    placeJackEveryAttempt: false,

    resetCourtEveryAttempt: false

  },

  'Push Off': {

    type: 'continuous',

    placeJackEveryAttempt: false,

    resetCourtEveryAttempt: false

  },

  'Ricochet': {

    type: 'continuous',

    placeJackEveryAttempt: false,

    resetCourtEveryAttempt: false

  },

  'Smash': {

    type: 'continuous',

    placeJackEveryAttempt: false,

    resetCourtEveryAttempt: false

  },

  'Bochada': {

    type: 'continuous',

    placeJackEveryAttempt: false,

    resetCourtEveryAttempt: false

  },

  // El entrenador arma la escena con las bochas rivales que quiera
  // (cualquier cantidad, cualquier color, posición libre) y evalúa a
  // mano — sin física automática, igual que Placement.
  'Custom': {

    type: 'continuous',

    placeJackEveryAttempt: false,

    resetCourtEveryAttempt: false

  }

};