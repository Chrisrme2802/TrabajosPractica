//Imports de Google
import { GoogleLogin } from '@react-oauth/google';  //Las opciones para el logIn
import { jwtDecode } from "jwt-decode";     //Para poder entender webTokens

{/* Pantalla de LogIn*/}
export function PantallaLogin({ 
    onLoginSuccess
 }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <h1 className="logo-text">Math<span>Lingo</span></h1>
          <p>Aprende matemáticas jugando</p>
        </div>

        <div className="login-action">
          <p className="login-hint">Inicia sesión para guardar tu progreso</p>
          
          {/* El botón oficial de Google */}
          <GoogleLogin
            onSuccess={credentialResponse => {
              const decoded = jwtDecode(credentialResponse.credential);  //Decodeamos el webToken lo convierte a JS normal
              onLoginSuccess(decoded);
            }}
            onError={() => {            //Cualquier error general
              alert("Hubo un problema al conectar con Google. Inténtalo de nuevo.");
            }}
            useOneTap    // Esto muestra un saludito de Google arriba a la derecha
            theme="outline" // "filled_black" o "outline" son alternativas
            shape="pill" // "rectangular" y "circle" son alternativas
            //size: "large" (por defecto), "medium" o "small" alternativas
            //text (Lo que dice el botón) "signin_with": "Iniciar sesión con Google" (por defecto). "signup_with": "Registrarse con Google". "continue_with": "Continuar con Google".
          />
        </div>

        <footer className="login-footer">
          <p>Al iniciar sesión, aceptas nuestras condiciones de uso.</p>
        </footer>
      </div>
    </div>
  );
}