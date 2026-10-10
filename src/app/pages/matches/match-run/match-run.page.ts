import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatchService } from '../services/match.service';
import { MatchVoiceService } from '../services/match-voice.service';
import { Match, Penalty } from '../models/match.model';
import { MatchRepositoryService } from 'src/app/services/match-repository.service';
import { Capacitor } from '@capacitor/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BocciaCast } from 'bocciapedia-cast';
import { MatchSettingsModalComponent } from './match-settings-modal/match-settings-modal.component';

@Component({
  selector: 'app-match-run',
  templateUrl: './match-run.page.html',
  styleUrls: ['./match-run.page.scss'],
  standalone: false
})
export class MatchRunPage implements OnInit, OnDestroy {

  match!: Match;

  showPenalty = false;

penaltySeconds = 60;

penaltyInterval: any;

  // Id de la falta de la lista que se está mostrando/ejecutando ahora.
  currentPenaltyId: string | null = null;

  showRest = false;

  restSeconds = 60;

  private interval?: any;

  private gameTimer?: any;

  // Umbrales (en segundos restantes) en los que se anuncia el tiempo
  // por voz, en inglés, mientras corre el reloj de cada equipo.
  private readonly announceThresholds = [60, 30, 10, 0];

  // Qué umbrales ya se anunciaron en el parcial actual, por equipo
  // (para no repetir el aviso en cada tick mientras el segundo no cambia
  // de valor, y para poder reiniciarlos al pasar de END).
  private announcedRed = new Set<number>();
  private announcedBlue = new Set<number>();

  constructor(

    private matchService: MatchService,

    private matchVoice: MatchVoiceService,

    private matchRepository: MatchRepositoryService,

    private alertController: AlertController,

    private modalController: ModalController,

    private router: Router,



  ){}

  // Faltas de la lista todavía no ejecutadas.
  get pendingPenalties(): Penalty[] {

    return this.match?.penalties?.filter(
      p => p.active && !p.executed
    ) ?? [];

  }

  // La falta que se está mostrando/ejecutando en este momento.
  get currentPenalty(): Penalty | undefined {

    return this.match?.penalties?.find(
      p => p.id === this.currentPenaltyId
    );

  }

  ngOnDestroy(): void {

    clearInterval(this.gameTimer);
    clearInterval(this.interval);
    clearInterval(this.penaltyInterval);

  }

  ngOnInit(): void {

    const match = this.matchService.getMatch();

    if(!match){

      this.router.navigate(['/main/matches/match-create']);

      return;

    }

    this.match = match;

    this.startGameClock();

    if (Capacitor.getPlatform() === 'android') {

      BocciaCast.addListener('sessionStarted', () => this.sendMatchToCast());

      BocciaCast.addListener('sessionResumed', () => this.sendMatchToCast());

      BocciaCast.addListener('webosPairingPrompt', () => {
        console.log('webOS: esperando aceptación en pantalla de la TV');
      });

    }

  }

  private readonly castNamespace = 'urn:x-cast:cl.bocciapedia.match';

  private async sendMatchToCast(): Promise<void> {

    if (!this.match?.id) {
      return;
    }

    try {

      await BocciaCast.registerNamespace({
        namespace: this.castNamespace
      });

      await BocciaCast.sendMessage({
        namespace: this.castNamespace,
        message: JSON.stringify({ matchId: this.match.id })
      });

    } catch (e) {

      console.error('Error enviando matchId al receptor Cast:', e);

    }

  }

 finishEnd(): void {

  if (this.showRest || this.showPenalty) {
    return;
  }

  // Si quedan faltas pendientes de ejecutar en este parcial, mostrar
  // la siguiente antes de poder cerrar el END. Pueden ser varias: al
  // resolver cada una, finishPenalty() vuelve a llamar acá mismo.
  if (this.pendingPenalties.length > 0) {

    this.showNextPenalty();

    return;

  }

  this.matchService.confirmEnd();

  this.match = this.matchService.getMatch()!;

  // ¿Terminó el partido?
  if (this.match.currentEnd >= this.match.totalEnds) {

    if (this.match.redScore === this.match.blueScore) {

      this.match.isTieBreak = true;

      this.match.currentEnd++;

      this.match.redBallsPlayed = 0;
      this.match.blueBallsPlayed = 0;

      this.match.redTime = this.match.secondsPerPlayer;
      this.match.blueTime = this.match.secondsPerPlayer;

      this.match.currentEndRedScore = 0;
      this.match.currentEndBlueScore = 0;

      this.resetTimeAnnouncements();

      this.matchService.updateMatch(this.match);

      this.syncMatch();

      return;

    }

    this.match.state = 'finished';

    this.matchService.updateMatch(this.match);
    this.syncMatch();
    return;

  }

  this.startRestCountdown();

}

// Muestra la ejecución (bocha de penalización) de la primera falta
// pendiente de la lista.
private showNextPenalty(): void {

  const penalty = this.pendingPenalties[0];

  if (!penalty) return;

  this.currentPenaltyId = penalty.id;

  this.showPenalty = true;

  this.penaltySeconds = 60;

  this.match.showPenalty = true;

  this.match.penaltySeconds = 60;

  this.syncMatch();

  this.penaltyInterval = setInterval(() => {

    this.penaltySeconds--;

    this.match.penaltySeconds = this.penaltySeconds;

    this.syncMatch();

    if (this.penaltySeconds <= 0) {

      clearInterval(this.penaltyInterval);

    }

  }, 1000);

}
  async addRedPoint(): Promise<void> {

  if (this.match.isTieBreak) {
    return;
  }

  this.matchService.addPoint('red');

  this.match = this.matchService.getMatch()!;

  await this.syncMatch();

}

async addBluePoint(): Promise<void> {

  if (this.match.isTieBreak) {
    return;
  }

  this.matchService.addPoint('blue');

  this.match = this.matchService.getMatch()!;

  await this.syncMatch();

}

removeRedPoint(): void {

  this.matchService.removePoint('red');

  this.match = this.matchService.getMatch()!;

}

removeBluePoint(): void {

  this.matchService.removePoint('blue');

  this.match = this.matchService.getMatch()!;

}

  formatTime(seconds: number): string {

  const minutes = Math.floor(seconds / 60);

  const secs = seconds % 60;

  return (
    minutes.toString().padStart(2, '0') +
    ':' +
    secs.toString().padStart(2, '0')
  );

}

startRedTimer(): void {

  // Si ya se le acabó el tiempo, no se puede reanudar ni marcar otra
  // bocha: no le alcanzaría el tiempo para tirarla.
  if (this.match.redTime <= 0) return;

  this.matchService.useTurn('red');

  this.matchService.startRedTimer();

  this.match = this.matchService.getMatch()!;

}

startBlueTimer(): void {

  if (this.match.blueTime <= 0) return;

  this.matchService.useTurn('blue');

  this.matchService.startBlueTimer();

  this.match = this.matchService.getMatch()!;

}

pauseTimers(): void {

  this.matchService.pauseTimers();

  this.match = this.matchService.getMatch()!;

}

private startGameClock(): void {

  this.gameTimer = setInterval(() => {

    if (!this.match.timerRunning) {
      return;
    }

    let changed = false;

    if (
      this.match.turn === 'red' &&
      this.match.redTime > 0
    ) {

      this.match.redTime--;

      changed = true;

      this.announceTime('red', this.match.redTime);

    }

    if (
      this.match.turn === 'blue' &&
      this.match.blueTime > 0
    ) {

      this.match.blueTime--;

      changed = true;

      this.announceTime('blue', this.match.blueTime);

    }

    if (changed) {

      this.matchService.updateMatch(this.match);

      this.syncMatch();

    }

  },1000);

}

// Avisa por voz, en inglés, cuando al equipo que está corriendo el
// reloj le quedan 60, 30 o 10 segundos, y cuando se le acaba el tiempo.
private announceTime(team: 'red' | 'blue', secondsLeft: number): void {

  if (!this.announceThresholds.includes(secondsLeft)) {
    return;
  }

  const announced = team === 'red' ? this.announcedRed : this.announcedBlue;

  if (announced.has(secondsLeft)) {
    return;
  }

  announced.add(secondsLeft);

  const phrase =
    secondsLeft === 60 ? 'One minute' :
    secondsLeft === 30 ? 'Thirty seconds' :
    secondsLeft === 10 ? 'Ten seconds' :
    'Time';

  this.matchVoice.speak(phrase);

}

// Permite que los mismos avisos (1 min, 30s, 10s, tiempo) vuelvan a
// sonar en el siguiente parcial, o para un solo equipo si se indica.
private resetTimeAnnouncements(team?: 'red' | 'blue'): void {

  if (!team || team === 'red') {
    this.announcedRed.clear();
  }

  if (!team || team === 'blue') {
    this.announcedBlue.clear();
  }

}

get genderLabel(): string {

  switch (this.match?.gender) {

    case 'male': return 'MASCULINO';

    case 'female': return 'FEMENINO';

    default: return 'MIXTO';

  }

}

get winner(): 'red' | 'blue' | 'tie' {

  // Si terminó un Tie Break,
  // ese define el ganador.

  if (this.match.isTieBreak && this.match.tieBreakWinner) {

    return this.match.tieBreakWinner;

  }

  if (this.match.redScore > this.match.blueScore) {

    return 'red';

  }

  if (this.match.blueScore > this.match.redScore) {

    return 'blue';

  }

  return 'tie';

}

async finishTieBreak(winner:'red'|'blue'): Promise<void> {

  this.match.tieBreakWinner = winner;

  this.match.state = 'finished';

  this.match.timerRunning = false;

  this.match.turn = null;

  this.matchService.updateMatch(this.match);

  await this.syncMatch()

  // Recargar el partido para refrescar la vista
  this.match = this.matchService.getMatch()!;

}

// Menú de ajustes del partido: corregir tiempo, bochas jugadas y
// faltas/penalizaciones (por errores del árbitro, etc).
async openMatchSettings(): Promise<void> {

  const modal = await this.modalController.create({
    component: MatchSettingsModalComponent,
    componentProps: { match: this.match }
  });

  await modal.present();

  await modal.onDidDismiss();

  this.match = this.matchService.getMatch()!;

  // Por si se corrigió el tiempo manualmente, que los avisos de voz
  // puedan volver a sonar en los umbrales ya pasados.
  this.resetTimeAnnouncements();

  await this.syncMatch();

}

assignPenalty(team: 'red' | 'blue') {

  console.log('Botón presionado:', team);

  this.matchService.startPenalty(team);

  this.match = this.matchService.getMatch()!;

  console.log(this.match);

}

finishPenalty(success: boolean) {

    clearInterval(this.penaltyInterval);

    if (this.currentPenaltyId) {

      this.matchService.resolvePenalty(this.currentPenaltyId, success);

      this.match = this.matchService.getMatch()!;

    }

    this.currentPenaltyId = null;

    this.showPenalty = false;

    this.match.showPenalty = false;

    this.match.penaltySeconds = 0;

    this.syncMatch();

    // Si quedan más faltas pendientes, finishEnd() mostrará la
    // siguiente; si no, continúa cerrando el END.
    this.finishEnd();

}

// Elimina una falta pendiente marcada por error, sin ejecutarla.
removePenalty(id: string): void {

  this.matchService.removePenalty(id);

  this.match = this.matchService.getMatch()!;

}
async startRestCountdown() {

  this.showRest = true;

  this.restSeconds = 60;

  this.match.showRest = true;
  this.match.restSeconds = 60;

  await this.syncMatch();

  this.interval = setInterval(() => {

    this.restSeconds--;

    this.match.restSeconds = this.restSeconds;

    this.syncMatch();

    if (this.restSeconds <= 0) {

      clearInterval(this.interval);

      // Ocultar descanso
      this.showRest = false;

      this.match.showRest = false;
      this.match.restSeconds = 0;

      // Pasar al siguiente END
      this.matchService.nextEnd();

      this.match = this.matchService.getMatch()!;

      // Los relojes vuelven a secondsPerPlayer: los avisos de voz
      // deben poder sonar de nuevo en este nuevo parcial.
      this.resetTimeAnnouncements();

      // Asegurar que el Broadcast reciba el cambio
      this.syncMatch();

    }

  }, 1000);

}

viewSummary(){

    this.router.navigate(['/main/matches/match-summary']);

}

newMatch(){

    this.matchService.clear();

    this.router.navigate(['/main/matches/match-create']);

}

goHome(){

    this.matchService.clear();

    this.router.navigate(['/main/home']);

}

// Dominio público donde vive la SPA (Firebase Hosting). Se usa en vez de
// window.location.origin cuando corre nativo, porque ahí el origin es
// local (capacitor://localhost), no el sitio real.
private readonly publicBaseUrl = 'https://bocciapedia-c730f.web.app';

private async showWebosPairingHintIfFirstTime(): Promise<void> {

  const key = 'webosCastPairingHintShown';

  if (localStorage.getItem(key)) {
    return;
  }

  localStorage.setItem(key, '1');

  const hint = await this.alertController.create({

    header: 'Conectando con la TV',

    message: 'La primera vez, revisa la TV: debe aparecer un aviso para aceptar la conexión.',

    buttons: ['OK']

  });

  await hint.present();

}

async openBroadcast() {

  try {

    const url = Capacitor.isNativePlatform()
      ? `${this.publicBaseUrl}/public/broadcast/${this.match.id}`
      : `${window.location.origin}/public/broadcast/${this.match.id}`;

    // Muchas TVs con Chromecast integrado por licencia (no un Chromecast
    // físico) no soportan apps receptoras personalizadas de Google Cast.
    // Por eso primero intentamos el protocolo propio de LG (SSAP) para
    // abrir el navegador de la TV directo en esta URL, con un toque.
    if (Capacitor.getPlatform() === 'android') {

      try {

        this.showWebosPairingHintIfFirstTime();

        await BocciaCast.webosCastUrl({ url });

        return;

      } catch (webosError) {

        console.warn(

          'No se pudo transmitir por SSAP (webOS), abriendo en el navegador como respaldo:',

          webosError

        );

      }

    }

    // Respaldo: abrir el broadcast en el navegador (Android sin webOS
    // disponible, o web/PC).
    window.open(

      url,

      Capacitor.isNativePlatform() ? '_system' : '_blank'

    );

  } catch (e: any) {

    const error = await this.alertController.create({

      header: 'ERROR',

      message: JSON.stringify(e),

      buttons: ['OK']

    });

    await error.present();

  }

}

private async syncMatch() {

  if (!this.match.id) {
    return;
  }

  try {

    await this.matchRepository.updateMatch(
      this.match.id,
      this.match
    );

  } catch (error) {

    console.error(
      'Error sincronizando partido:',
      error
    );

  }

}


}