import { Injectable } from '@angular/core';

const STORAGE_KEY = 'bocciapp_notification_sound';

export interface NotificationSoundOption {

  id: string;

  label: string;

  // Secuencia de tonos que arma el sonido: frecuencia (Hz), duración
  // (ms) y una breve pausa después de cada uno.
  notes: { freq: number; duration: number; gap?: number }[];

  wave: OscillatorType;

}

// No hay archivos de audio en el proyecto y no corresponde inventar
// binarios con derechos de autor ajenos: en vez de eso, cada sonido se
// sintetiza en el momento con la Web Audio API (funciona igual en el
// navegador y en el WebView de la app nativa). Así el usuario puede
// elegir el que más le guste, como el selector de tonos de WhatsApp.
const SOUND_OPTIONS: NotificationSoundOption[] = [

  {
    id: 'classic',
    label: 'Clásico',
    wave: 'sine',
    notes: [
      { freq: 880, duration: 110, gap: 40 },
      { freq: 1320, duration: 140 }
    ]
  },

  {
    id: 'bell',
    label: 'Campana',
    wave: 'triangle',
    notes: [
      { freq: 988, duration: 420 }
    ]
  },

  {
    id: 'soft',
    label: 'Suave',
    wave: 'sine',
    notes: [
      { freq: 523, duration: 220 }
    ]
  },

  {
    id: 'double',
    label: 'Doble tono',
    wave: 'square',
    notes: [
      { freq: 784, duration: 90, gap: 70 },
      { freq: 784, duration: 90 }
    ]
  },

  {
    id: 'alert',
    label: 'Alerta',
    wave: 'sawtooth',
    notes: [
      { freq: 660, duration: 80, gap: 60 },
      { freq: 660, duration: 80, gap: 60 },
      { freq: 880, duration: 160 }
    ]
  },

  {
    id: 'none',
    label: 'Ninguno (silencioso)',
    wave: 'sine',
    notes: []
  }

];

@Injectable({
  providedIn: 'root'
})
export class NotificationSoundService {

  readonly sounds = SOUND_OPTIONS;

  private audioContext?: AudioContext;

  getSelected(): string {

    return localStorage.getItem(STORAGE_KEY) ?? SOUND_OPTIONS[0].id;

  }

  setSelected(id: string): void {

    localStorage.setItem(STORAGE_KEY, id);

  }

  // Reproduce el sonido elegido ahora mismo (se usa al llegar una
  // notificación en primer plano).
  playSelected(): void {

    this.play(this.getSelected());

  }

  // Reproduce un sonido puntual, sin cambiar la selección guardada
  // (se usa para la vista previa al tocar cada opción de la lista).
  play(id: string): void {

    const option = this.sounds.find(s => s.id === id);

    if (!option || !option.notes.length) {
      return;
    }

    try {

      const ctx = this.getContext();

      let when = ctx.currentTime;

      for (const note of option.notes) {

        this.playTone(ctx, option.wave, note.freq, note.duration / 1000, when);

        when += note.duration / 1000 + (note.gap ?? 0) / 1000;

      }

    } catch (error) {

      console.warn('No se pudo reproducir el sonido de notificación:', error);

    }

  }

  private getContext(): AudioContext {

    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    // Los navegadores suspenden el audio hasta el primer gesto del
    // usuario; al elegir un sonido en la lista ya hubo un toque, así
    // que esto lo reactiva si hiciera falta.
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    return this.audioContext;

  }

  private playTone(
    ctx: AudioContext,
    wave: OscillatorType,
    freq: number,
    durationSeconds: number,
    startAt: number
  ): void {

    const oscillator = ctx.createOscillator();

    const gain = ctx.createGain();

    oscillator.type = wave;

    oscillator.frequency.setValueAtTime(freq, startAt);

    // Fade-out corto al final de cada nota para que no "corte" seco.
    gain.gain.setValueAtTime(.22, startAt);

    gain.gain.exponentialRampToValueAtTime(.0001, startAt + durationSeconds);

    oscillator.connect(gain);

    gain.connect(ctx.destination);

    oscillator.start(startAt);

    oscillator.stop(startAt + durationSeconds + .02);

  }

}
