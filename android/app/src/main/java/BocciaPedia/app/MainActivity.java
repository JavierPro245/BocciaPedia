package BocciaPedia.app;

import android.os.Bundle;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        hideNavigationBar();

    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {

        super.onWindowFocusChanged(hasFocus);

        // La barra de navegación puede reaparecer tras cosas como
        // cerrar el teclado o una notificación; se vuelve a ocultar
        // cada vez que la app recupera el foco.
        if (hasFocus) {

            hideNavigationBar();

        }

    }

    private void hideNavigationBar() {

        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(

                getWindow(),

                getWindow().getDecorView()

        );

        if (controller == null) {

            return;

        }

        // Solo se oculta la barra de navegación (atrás/inicio/recientes).
        // La barra de estado (hora, batería, wifi) se deja como está.
        controller.hide(WindowInsetsCompat.Type.navigationBars());

        // BEHAVIOR_DEFAULT hace que, al deslizar desde el borde, la
        // barra quede fija visible hasta que la app vuelva a tener
        // foco (lo que no pasa si el usuario se queda en la misma
        // pantalla) — por eso a veces quedaba pegada. Con
        // BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE aparece como overlay
        // translúcido y se oculta sola sin depender de un cambio de
        // foco.
        controller.setSystemBarsBehavior(
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );

    }

}
