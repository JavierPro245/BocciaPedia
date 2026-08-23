import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evaluation } from 'src/app/models/evaluation.model';
import { SessionService } from 'src/app/services/session.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-evaluations-list',
  templateUrl: './evaluations-list.page.html',
  styleUrls: ['./evaluations-list.page.scss'],
  standalone: false
})
export class EvaluationsListPage implements OnInit {

  search = '';

  userRole = '';

  currentUserId = '';

  evaluations: Evaluation[] = [];

  constructor(

  private router: Router,

  private evaluationService: EvaluationService,

  private sessionService: SessionService,

  private alertController: AlertController,

  private toastController: ToastController

){}
  
  ngOnInit(): void {

  const user = this.sessionService.getUser();

  if (!user) {
    return;
  }

  this.currentUserId = user.uid;

  if (user.roles.includes('trainer')) {

  this.userRole = 'trainer';

} else if (user.roles.includes('athlete')) {

  this.userRole = 'athlete';

}

  const callback = (evaluations: Evaluation[]) => {

    this.evaluations = evaluations.sort((a, b) => {

      const dateA = a.updatedAt
        ? new Date(a.updatedAt).getTime()
        : new Date(a.date).getTime();

      const dateB = b.updatedAt
        ? new Date(b.updatedAt).getTime()
        : new Date(b.date).getTime();

      return dateB - dateA;

    });

  };

  if (user.roles.includes('trainer')) {

  this.evaluationService.listenEvaluationsByTrainer(
    user.uid,
    callback
  );

}
else if (user.roles.includes('athlete')) {

  if (!user.athleteId) {
    return;
  }

  this.evaluationService.listenEvaluationsByAthlete(
    user.athleteId,
    callback
  );

}

}

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

    // Sin esto, si quedaba una evaluación guardada en el servicio
    // (de una sesión anterior de crear/ver/editar), la pantalla de
    // creación la detectaba como "edición" y precargaba sus datos.
    this.evaluationService.clearEvaluation();

    this.router.navigate([
      '/main/evaluations/evaluations-create'
    ]);

  }

  openEvaluation(evaluation: Evaluation) {

  this.evaluationService.setEvaluation(evaluation);

  this.evaluationService.setDetailViewMode('preview');

  this.router.navigate([
    '/main/evaluations/evaluations-detail'
  ]);

}

//====================================
// Editar
//====================================

editEvaluation(evaluation: Evaluation) {

  this.evaluationService.setEvaluation(evaluation);

  this.router.navigate([
    '/main/evaluations/evaluations-create'
  ]);

}

//====================================
// Confirmar eliminación
//====================================

async confirmDelete(
  evaluation: Evaluation
) {

  const alert = await this.alertController.create({

    header: 'Eliminar evaluación',

    message:
      '¿Está seguro de eliminar esta evaluación?',

    buttons: [

      {
        text: 'Cancelar',
        role: 'cancel'
      },

      {

        text: 'Eliminar',

        role: 'destructive',

        handler: async () => {

          await this.deleteEvaluation(
            evaluation
          );

        }

      }

    ]

  });

  await alert.present();

}

//====================================
// Eliminar
//====================================

async deleteEvaluation(
  evaluation: Evaluation
) {

  if (!evaluation.id) {
    return;
  }

  await this.evaluationService.deleteEvaluation(
    evaluation.id
  );

  const toast =
    await this.toastController.create({

      message:
        'Evaluación eliminada.',

      duration: 2000,

      color: 'success',

      position: 'bottom'

    });

  await toast.present();

}

}
