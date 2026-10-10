import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AthleteService } from 'src/app/services/athlete.service';
import { AuthService } from 'src/app/services/auth.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { SessionService } from 'src/app/services/session.service';
import { Athlete } from 'src/app/models/athlete.model';
import { UserRole } from 'src/app/models/user.model';

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

  private sessionService: SessionService,

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

  // Nombre de pila para el saludo (si no hay nombre cargado, saluda
  // genérico en vez de mostrar "undefined" o un correo largo).
  get userFirstName(): string {

    const name = this.sessionService.getUser()?.displayName;

    return name ? name.trim().split(' ')[0] : '';

  }

  get userRoles(): UserRole[] {

    return this.sessionService.getUser()?.roles ?? [];

  }

  // "Buenos días" / "Buenas tardes" / "Buenas noches" según la hora
  // del dispositivo.
  get greeting(): string {

    const hour = new Date().getHours();

    if (hour < 12) return 'Buenos días';

    if (hour < 20) return 'Buenas tardes';

    return 'Buenas noches';

  }

  goToNewEvaluation(): void {

    // Sin esto, si quedaba una evaluación guardada en el servicio
    // (de una sesión anterior de crear/ver/editar), la pantalla de
    // creación la detectaba como "edición" y precargaba sus datos.
    this.evaluationService.clearEvaluation();

    this.router.navigate(['/evaluations-create']);

  }

}
