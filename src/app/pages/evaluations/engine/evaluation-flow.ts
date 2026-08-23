import { EvaluationType } from "src/app/models/evaluation.model";

export type FlowState =

  | "BOX"

  | "JACK"

  | "OPPONENT"

  | "PLAYER"

  | "ANIMATION"

  | "EVALUATION"

  | "RESET"

  | "FINISHED";

export class EvaluationFlow {

  private state: FlowState = "BOX";

  constructor(

    private type: EvaluationType

  ) {}

  get currentState(): FlowState {

    return this.state;

  }

  next(): void {

    switch (this.type) {

      case "First Ball":

        this.nextFirstBall();

        break;

      case "Placement":
      case "Custom":

        this.nextPlacement();

        break;

      case "Smash":
      case "Push On":
      case "Push Off":
      case "Ricochet":
      case "Bochada":

        this.nextWithOpponentStep();

        break;

      default:

        this.nextPlacement();

    }

  }

  //------------------------------------------------

  // FIRST BALL

  //------------------------------------------------

  private nextFirstBall(): void {

    switch (this.state) {

      case "BOX":

        this.state = "JACK";

        break;

      case "JACK":

        this.state = "PLAYER";

        break;

      case "PLAYER":

        this.state = "EVALUATION";

        break;

      case "EVALUATION":

        this.state = "RESET";

        break;

      case "RESET":

        this.state = "JACK";

        break;

    }

  }

  //------------------------------------------------

  // PLACEMENT

  //------------------------------------------------

  private nextPlacement(): void {

    switch (this.state) {

      case "BOX":

        this.state = "JACK";

        break;

      case "JACK":

        this.state = "PLAYER";

        break;

      case "PLAYER":

        this.state = "EVALUATION";

        break;

      case "EVALUATION":

        this.state = "PLAYER";

        break;

    }

  }

  //------------------------------------------------

  // SMASH, PUSH ON, PUSH OFF, RICOCHET, BOCHADA
  // (todas necesitan colocar bocha(s) rival(es) antes del tiro)

  //------------------------------------------------

  private nextWithOpponentStep(): void {

    switch (this.state) {

      case "BOX":

        this.state = "JACK";

        break;

      case "JACK":

        this.state = "OPPONENT";

        break;

      case "OPPONENT":

        this.state = "PLAYER";

        break;

      case "PLAYER":

        this.state = "ANIMATION";

        break;

      case "ANIMATION":

        this.state = "EVALUATION";

        break;

      case "EVALUATION":

        this.state = "RESET";

        break;

      case "RESET":

        this.state = "JACK";

        break;

    }

  }

  getInstruction(): string {

  switch (this.state) {

    case "BOX":
      return "Seleccione el Box.";

    case "JACK":
      return "Coloque el Jack.";

    case "OPPONENT":
      return "Coloque la bocha rival.";

    case "PLAYER":
      return "Realice el lanzamiento.";

    case "ANIMATION":
      return "Reproduciendo movimiento...";

    case "EVALUATION":
      return "Evalúe el lanzamiento.";

    case "RESET":
      return "Prepare el siguiente intento.";

    case "FINISHED":
      return "Evaluación finalizada.";

    default:
      return "";

  }

}

}