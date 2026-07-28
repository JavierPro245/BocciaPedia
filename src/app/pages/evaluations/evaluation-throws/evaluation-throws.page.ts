import { Component, OnInit } from '@angular/core';
import { Throw } from '../models/throw.model';
import { EvaluationService } from 'src/app/services/evaluation.service';

@Component({
  selector: 'app-evaluation-throws',
  templateUrl: './evaluation-throws.page.html',
  styleUrls: ['./evaluation-throws.page.scss'],
  standalone:false
})
export class EvaluationThrowsPage implements OnInit {

  throws: Throw[] = [];

  constructor(
  private evaluationService: EvaluationService
){}

  ngOnInit(): void {

  const evaluation = this.evaluationService.getEvaluation();

  if (evaluation) {

    this.throws = evaluation.throwList ?? [];

  }

}

}