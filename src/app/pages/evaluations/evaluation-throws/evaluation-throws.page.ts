import { Component, OnInit } from '@angular/core';
import { Throw } from '../models/throw.model';
import { EvaluationSessionService } from 'src/app/services/evaluation-session';

@Component({
  selector: 'app-evaluation-throws',
  templateUrl: './evaluation-throws.page.html',
  styleUrls: ['./evaluation-throws.page.scss'],
  standalone:false
})
export class EvaluationThrowsPage implements OnInit {

  throws: Throw[] = [];

  constructor(
    private sessionService: EvaluationSessionService
  ){}

  ngOnInit(): void {

    this.throws =
      this.sessionService.getThrows();

  }

}