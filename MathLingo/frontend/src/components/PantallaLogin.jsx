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
            onSuccess={ async (credentialResponse) => {
              const decoded = jwtDecode(credentialResponse.credential);  //Decodeamos el webToken lo convierte a JS normal
              try {
                //con fetch la pagina se comunica con el servidor node fetch('URL')
                const respuesta = await fetch('http://localhost:5000/auth/google', {
                  method: 'POST', //Indico que mandare informacion
                  //Headers son las caracteristicas de lo que estoy mandando, Clave-Valor, son obligatorios al usar fetch
                  //'Content-Type': application/json: Envías objetos de JavaScript convertidos a texto, text/plain: Texto simple, sin formato, multipart/form-data: archivos reales
                  //Authorization: Bearer <token_de_google>: Sirve para verificacion constante
                  //Accept: Es lo contrario al content-type tu pides que te mandne en cierto valor
                  headers: {      
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ token: decoded }) 
                });
                const datosUsuario = await respuesta.json();
                console.log("Usuario en DB:", datosUsuario);    
              } catch (error) {
                console.error("Error al conectar con el backend:", error);
                }
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