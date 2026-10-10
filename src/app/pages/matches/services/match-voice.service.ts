import { Injectable } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

// Clave en localStorage para recordar si el usuario apagó los avisos
// de voz del reloj. Si nunca la tocó, queda activada por defecto.
const STORAGE_KEY = 'bocciapp_match_time_voice_enabled';

// Avisos de voz del reloj del partido (1 min / 30s / 10s / tiempo).
//
// Se usa el plugin nativo @capacitor-community/text-to-speech en vez
// de window.speechSynthesis directo: el WebView de Android (donde
// corre esta app empaquetada) no soporta de forma confiable la Web
// Speech API — en muchos dispositivos `speechSynthesis.speak()` no
// hace nada y no tira ningún error. El plugin usa el motor de texto a
// voz nativo del sistema (Android TextToSpeech / iOS AVSpeechSynthesizer)
// y en el navegador cae de vuelta a la Web Speech API automáticamente.
@Injectable({
  providedIn: 'root'
})
export class MatchVoiceService {

  isEnabled(): boolean {

    const stored = localStorage.getItem(STORAGE_KEY);

    // null = el usuario nunca la tocó -> activada por defecto.
    return stored === null ? true : stored === '1';

  }

  setEnabled(enabled: boolean): void {

    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');

  }

  // `force` ignora el interruptor de activado/desactivado: se usa para
  // el botón "Probar voz" del menú de ajustes, que debe sonar aunque
  // el aviso automático esté apagado (o antes de decidir si dejarlo
  // activado).
  async speak(text: string, force = false): Promise<void> {

    if (!force && !this.isEnabled()) {
      return;
    }

    try {

      await TextToSpeech.speak({
        text,
        lang: 'en-US',
        rate: 1,
        pitch: 1,
        volume: 1,
        category: 'ambient'
      });

    } catch (error) {

      console.warn('No se pudo reproducir el aviso de voz del tiempo:', error);

    }

  }

}
