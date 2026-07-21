import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evaluation } from 'src/app/models/evaluation.model';

@Component({
  selector: 'app-evaluations-list',
  templateUrl: './evaluations-list.page.html',
  styleUrls: ['./evaluations-list.page.scss'],
  standalone: false
})
export class EvaluationsListPage {

  search = '';

  evaluations: Evaluation[] = [

    {
      id:'1',
      athleteId:'1',
      athleteName:'Javier Bastias',
      category:'BC3',
      evaluationType:'First Ball',
      throws:12,
      currentThrow:12,
      distance:3,
      date:new Date(),
      status:'finished'
    },

    {
      id:'2',
      athleteId:'2',
      athleteName:'Carlos Pérez',
      category:'BC2',
      evaluationType:'Placement',
      throws:18,
      currentThrow:18,
      distance:5,
      date:new Date(),
      status:'finished'
    },

    {
      id:'3',
      athleteId:'3',
      athleteName:'Felipe Soto',
      category:'BC4',
      evaluationType:'Push On',
      throws:15,
      currentThrow:15,
      distance:7,
      date:new Date(),
      status:'finished'
    }

  ];

  constructor(
    private router:Router
  ){}

  get filteredEvaluations(){

    return this.evaluations.filter(x=>{

      return x.athleteName
      .toLowerCase()
      .includes(this.search.toLowerCase())

      ||

      x.evaluationType
      .toLowerCase()
      .includes(this.search.toLowerCase());

    });

  }

  newEvaluation(){

    this.router.navigate([
      '/main/evaluations/evaluations-create'
    ]);

  }

  openEvaluation(evaluation:Evaluation){

    this.router.navigate([
      '/main/evaluations/evaluations-detail'
    ]);

  }

}
