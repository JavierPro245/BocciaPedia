import { Injectable } from '@angular/core';

import { EvaluationConfig } from '../pages/evaluations/models/evaluation-config.model';
import { Throw } from '../pages/evaluations/models/throw.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationSessionService {

  //------------------------------------------------
  // CONFIGURACIÓN
  //------------------------------------------------

  private config?: EvaluationConfig;

  //------------------------------------------------
  // DATOS DE LA EVALUACIÓN
  //------------------------------------------------

  private selectedBox?: number;

  private selectedQuadrant?: string;

  private jack?: {

    x:number;

    y:number;

  };

  private throws: Throw[] = [];

  //------------------------------------------------
  // CONFIG
  //------------------------------------------------

  setConfig(config: EvaluationConfig): void {

    this.config = config;

  }

  getConfig(): EvaluationConfig | undefined {

    return this.config;

  }

  //------------------------------------------------
  // BOX
  //------------------------------------------------

  setSelectedBox(box:number){

    this.selectedBox = box;

  }

  getSelectedBox(){

    return this.selectedBox;

  }

  //------------------------------------------------
  // CUADRANTE
  //------------------------------------------------

  setSelectedQuadrant(quadrant:string){

    this.selectedQuadrant = quadrant;

  }

  getSelectedQuadrant(){

    return this.selectedQuadrant;

  }

  //------------------------------------------------
  // JACK
  //------------------------------------------------

  setJack(x:number,y:number){

    this.jack={

      x,

      y

    };

  }

  getJack(){

    return this.jack;

  }

  //------------------------------------------------
  // LANZAMIENTOS
  //------------------------------------------------

  setThrows(throws:Throw[]){

    this.throws=[...throws];

  }

  getThrows(){

    return this.throws;

  }

  //------------------------------------------------
  // LIMPIAR
  //------------------------------------------------

  clear(){

    this.config=undefined;

    this.selectedBox=undefined;

    this.selectedQuadrant=undefined;

    this.jack=undefined;

    this.throws=[];

  }

}