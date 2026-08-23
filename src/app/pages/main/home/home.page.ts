import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AthleteService } from 'src/app/services/athlete.service';
import { AuthService } from 'src/app/services/auth.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { Athlete } from 'src/app/models/athlete.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  athleteCount = 0;

  constructor(

  private athleteService: AthleteService,

  private authService: AuthService,

  private evaluationService: EvaluationService,

  private router: Router

) {}

  ngOnInit() {

  this.authService.listenAuthState(user => {

    if (!user) {

      this.athleteCount = 0;

      return;

    }

    this.athleteService.listenAthletesByTrainer(

      user.uid,

      (athletes: Athlete[]) => {

        this.athleteCount = athletes.length;

      }

    );

  });

}

  goToNewEvaluation(): void {

    // Sin esto, si quedaba una evaluación guardada en el servicio
    // (de una sesión anterior de crear/ver/editar), la pantalla de
    // creación la detectaba como "edición" y precargaba sus datos.
    this.evaluationService.clearEvaluation();

    this.router.navigate(['/evaluations-create']);

  }

}
