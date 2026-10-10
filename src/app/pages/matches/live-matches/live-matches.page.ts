import { Component, OnDestroy, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';

import { Match } from '../models/match.model';
import { MatchRepositoryService } from 'src/app/services/match-repository.service';

// Sección para que cualquier usuario (deportistas incluidos) pueda ver
// qué partidos están en curso ahora mismo y abrir su transmisión,
// sin tener que conocer de antemano el enlace del broadcast.
@Component({
  selector: 'app-live-matches',
  templateUrl: './live-matches.page.html',
  styleUrls: ['./live-matches.page.scss'],
  standalone: false
})
export class LiveMatchesPage implements OnInit, OnDestroy {

  matches: Match[] = [];

  loading = true;

  private unsubscribe?: () => void;

  // Dominio público donde vive la SPA (Firebase Hosting). Se usa en vez
  // de window.location.origin cuando corre nativo, porque ahí el
  // origin es local (capacitor://localhost), no el sitio real.
  private readonly publicBaseUrl = 'https://bocciapedia-c730f.web.app';

  constructor(
    private matchRepository: MatchRepositoryService
  ) {}

  ngOnInit(): void {

    this.unsubscribe = this.matchRepository.listenLiveMatches(matches => {

      // Más recientes primero (se ordena acá, no en la consulta, para
      // no necesitar un índice compuesto en Firestore).
      this.matches = matches.sort((a, b) => b.currentEnd - a.currentEnd);

      this.loading = false;

    });

  }

  ngOnDestroy(): void {

    this.unsubscribe?.();

  }

  genderLabel(match: Match): string {

    switch (match.gender) {

      case 'male': return 'Masculino';

      case 'female': return 'Femenino';

      default: return 'Mixto';

    }

  }

  openBroadcast(match: Match): void {

    const url = Capacitor.isNativePlatform()
      ? `${this.publicBaseUrl}/public/broadcast/${match.id}`
      : `${window.location.origin}/public/broadcast/${match.id}`;

    window.open(
      url,
      Capacitor.isNativePlatform() ? '_system' : '_blank'
    );

  }

}
