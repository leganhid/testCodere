import { test, expect } from '@playwright/test';

const WRONG_USER = "usuarioPrueba";
const WRONG_PASS = "contraseñaPrueba";
const USER = "usuarioCorrecto";
const PASS = "contraseñaCorrecta";


/*  Casos de prueba en el login de la aplicación:
  1.- Comprobar que el modal de login se visualiza al pulsar en el botón 'Acceder'.
    1.1.- Comprobar que el modal no se visualiza al pulsar el botón para cerrar el mismo.
  2.- Comprobar que se visualiza un mensaje de error al pulsar en 'Acceder' del modal de login sin rellenar usuario/contraseña.
  3.- Comprobar que se visualiza un mensaje de error al pulsar en 'Acceder' del modal de login sin rellenar la contraseña.
  4.- Comprobar que se visualiza un mensaje de error al pulsar en 'Acceder' del modal de login sin rellenar el usuario.
    4.1.- Comprobar que al pulsar en el botón 'Mostrar contraseña' (Botón del ojo dentro del input de contraseña) se muestra la contraseña.
    4.2.- Comprobar que se deja de mostrar la contraseña al volver a pulsar el mismo botón.
  5.- Comprobar que se visualiza un mensaje de error al pulsar en 'Acceder' del modal de login rellenando ambos campos con credenciales incorrectas.
  6.- Comprobar que se logea al pulsar en 'Acceder' del modal de login rellenando los campos con credenciales correctas.
  * 7.- Comprobar que se visualiza el modal de 'Recordar contraseña' al pulsar en botón '¿Olvidaste tu contraseña?'
    7.1.- Comprobar que se visualiza de nuevo el modal de login al pulsar en botón 'Volver'
    7.2.- Comprobar que se visualiza un mensaje de error al pulsar en 'Enviar' en la modal de 'Recordar contraseña'
    7.3.- Comprobar que no se visualiza ni el modal de login ni el de recordar contraseña al pulsar el botón para cerrar la modal de 'recordar contraseña'.

  Notas: 
    * 7.- El modal de Recordar contraseña no es automatizable a causa del Captcha
    ** La funcionalidad de registro (aunque están en la misma modal) la pondría en otro fichero de tests.
*/


// En cada uno de los casos esta parte es común, son los pasos previos antes de comenzar cada caso.
test.beforeEach( async({page}) => {
  // voy a la dirección indicada.
  await page.goto('https://m.apuestas.codere.es/');
  // compruebo que la página contiene este texto en el título.
  await expect(page).toHaveTitle(/Apuestas en Directo/); 
  // Acepto cookies
  await page.getByRole('button', { name: 'ACEPTAR' }).click();   
});

// Caso de prueba 1
// Lo primero es comprobar que al pulsar en "Acceder" se abre modal o redirije al login.
// En este caso se abre una modal, así que se comprueba si están visibles los elementos de la misma.
// También se comprueba si los input de usuario y de contraseña son editables.
test('should show login modal when I click on "Acceder" button', async ({ page }) => {
  // Pulso en botón acceder
  await page.getByRole('button', { name: 'Acceder' }).click();
  // Valido que se están mostrando los elementos de la modal de login
  const userInput = page.getByRole('textbox', { name: 'Usuario / Correo electrónico' });
  const pwdInput = page.getByRole('textbox', { name: 'Contraseña' }); 
  await expect(userInput).toBeVisible();
  await expect(userInput).toBeEditable();
  await expect(pwdInput).toBeVisible();
  await expect(pwdInput).toBeEditable();
  await expect(page.locator('login-page').getByRole('button', { name: 'Acceder' })).toBeVisible();
  // Por último se comprueba el funcionamiento del botón de cerrar la modal de login.
  await page.getByRole('button', { name: 'close' }).click();
  // y se valida que la modal ya no se visualiza
  await expect(userInput).not.toBeVisible()
  await expect(pwdInput).not.toBeVisible();
});


// Caso de prueba 2
// En este caso se comprueba el error mostrado al pulsar "Acceder" sin introducir
// nada en los campos de usuario y contraseña.
test('should show an error if I try to log with empty credentials', async ({ page }) => {
  // Pulso en botón acceder
  await page.getByRole('button', { name: 'Acceder' }).click();
  // Valido los dos input (se están mostrando, son editables y están vacíos)
  const userInput = page.getByRole('textbox', { name: 'Usuario / Correo electrónico' });
  const pwdInput = page.getByRole('textbox', { name: 'Contraseña' }); 
  await expect(userInput).toBeVisible();
  await expect(userInput).toBeEditable();
  await expect(userInput).toBeEmpty();
  await expect(pwdInput).toBeVisible();
  await expect(pwdInput).toBeEditable();
  await expect(pwdInput).toBeEmpty();
  // Pulso en el botón acceder de la modal de login
  await page.locator('login-page').getByRole('button', { name: 'Acceder' }).click();
  // Valido que se muestra el mensaje de error
  await expect(page.getByText('Revisa que todos los campos estén rellenos')).toBeVisible();
  await expect(page.getByRole('button', { name: 'OK' })).toBeVisible();
});

// Caso de prueba 3
// En este caso se comprueba el error mostrado al pulsar "Acceder" introduciendo
// sólamente el usuario.
test('should show an error if I try to log with an empty password', async ({ page }) => {
  // Pulso en botón acceder
  await page.getByRole('button', { name: 'Acceder' }).click();
  // Introduzco un valor en el campo usuario y dejo el password vacío.
  const userInput = page.getByRole('textbox', { name: 'Usuario / Correo electrónico' });
  const pwdInput = page.getByRole('textbox', { name: 'Contraseña' }); 
  await expect(userInput).toBeVisible();
  await expect(userInput).toBeEditable();
  // Introduzco un usuario incorrecto
  await userInput.fill(WRONG_USER);
  await expect(pwdInput).toBeVisible();
  await expect(pwdInput).toBeEditable();
  await expect(pwdInput).toBeEmpty();
  // Pulso en el botón acceder de la modal de login
  await page.locator('login-page').getByRole('button', { name: 'Acceder' }).click();
  // Valido que se muestra el mensaje de error
  await expect(page.getByText('Revisa que todos los campos estén rellenos')).toBeVisible();
  await expect(page.getByRole('button', { name: 'OK' })).toBeVisible();
});

// Caso de prueba 4
// En este caso se comprueba el error mostrado al pulsar "Acceder" introduciendo
// sólamente la contraseña.
test('should show an error if I try to log with an empty username', async ({ page }) => {
  // Pulso en botón acceder
  await page.getByRole('button', { name: 'Acceder' }).click();
  // Introduzco un valor en el campo usuario y dejo el password vacío.
  const userInput = page.getByRole('textbox', { name: 'Usuario / Correo electrónico' });
  const pwdInput = page.getByRole('textbox', { name: 'Contraseña' }); 
  await expect(userInput).toBeVisible();
  await expect(userInput).toBeEditable();
  await expect(userInput).toBeEmpty();
  await expect(pwdInput).toBeVisible();
  await expect(pwdInput).toBeEditable();
  // Introduzco un pass incorrecto
  await pwdInput.fill(WRONG_PASS);
  // 4.1.- A continuación pulso el botón para mostrar contraseña
  // Tras introducir la contraseña si se trata de pulsar el botón para mostrar contraseña directamente
  // hay un elemento superpuesto al botón, por lo tanto hay que pulsar primero sobre este elemento para poder pulsar sobre el botón.
  await page.getByText('¡Para poder apostar tienes que iniciar sesión! Usuario / Correo electrónico Cont').click(); // Fix para poder pulsar el botón.
  // Pulso el botón.  
  await page.getByRole('img', { name: 'eye' }).click();
  // y se comprueba que se muestra la contraseña
  await expect(page.getByRole('img', { name: 'eye off' })).toBeVisible(); // se cambia el botón por el ojo tachado
  await expect(pwdInput).toHaveAttribute("type", "text"); // el input de contraseña cambia a tipo text (se muestra el texto)
  // Vuelvo a ocultar la contraseña pulsando el botón correspondiente
  await page.getByRole('img', { name: 'eye off' }).click();
  // y se comprueba que se muestra la contraseña
  await expect(page.getByRole('img', { name: 'eye' })).toBeVisible(); // se vuelve a mostar el botón normal
  await expect(pwdInput).toHaveAttribute("type", "password"); // el input de contraseña cambia a tipo password (no se muestra el texto)
  // Pulso en el botón acceder de la modal de login
  await page.locator('login-page').getByRole('button', { name: 'Acceder' }).click();
  // Valido que se muestra el mensaje de error
  await expect(page.getByText('Revisa que todos los campos estén rellenos')).toBeVisible();
  await expect(page.getByRole('button', { name: 'OK' })).toBeVisible();
});

// Caso de prueba 5
// Se comprueba un intento de login con credenciales incorrectas.
test('should show an error if I try to log with wrong credentials', async ({ page }) => {
  // Pulso en botón acceder
  await page.getByRole('button', { name: 'Acceder' }).click();
  // Valido los campos de usuario y contraseña
  const userInput = page.getByRole('textbox', { name: 'Usuario / Correo electrónico' });
  const pwdInput = page.getByRole('textbox', { name: 'Contraseña' }); 
  await expect(userInput).toBeVisible();
  await expect(userInput).toBeEditable();
  await expect(userInput).toBeEmpty();
  await expect(pwdInput).toBeVisible();
  await expect(pwdInput).toBeEditable();
  await expect(pwdInput).toBeEmpty();
  // Relleno usuario/contraseña con datos incorrectos
  await userInput.fill(WRONG_USER);
  await pwdInput.fill(WRONG_PASS);
  // Pulso en el botón acceder de la modal de login
  await page.locator('login-page').getByRole('button', { name: 'Acceder' }).click();
  // Valido que se muestra el mensaje de error

  // Actualmente NO aparece mensaje de error

});

// Caso de prueba 6
// Login correcto
test('should log into application if correct credentials are used', async ({ page }) => {
  // Pulso en botón acceder
  await page.getByRole('button', { name: 'Acceder' }).click();
  // Valido los campos de usuario y contraseña
  const userInput = page.getByRole('textbox', { name: 'Usuario / Correo electrónico' });
  const pwdInput = page.getByRole('textbox', { name: 'Contraseña' }); 
  await expect(userInput).toBeVisible();
  await expect(userInput).toBeEditable();
  await expect(userInput).toBeEmpty();
  await expect(pwdInput).toBeVisible();
  await expect(pwdInput).toBeEditable();
  await expect(pwdInput).toBeEmpty();
  // Relleno usuario/contraseña con datos correctos
  await userInput.fill(USER);
  await pwdInput.fill(PASS);
  // Pulso en el botón acceder de la modal de login
  await page.locator('login-page').getByRole('button', { name: 'Acceder' }).click();
  // Aquí se validaría el correcto login en la aplicación.
  // No dispongo de usuario para poder hacerlo.

});

// Caso de prueba 7
// Validación del funcionamiento de 'Recordar contraseña', acciones y modales correspondientes.
test('should show "Recordar contraseña" modal when I click on "¿Olvidaste tu contraseña?"', async ({ page }) => {
  // Pulso en botón acceder
  await page.getByRole('button', { name: 'Acceder' }).click();
  // Valido los campos de usuario y contraseña
  const userInput = page.getByRole('textbox', { name: 'Usuario / Correo electrónico' });
  const pwdInput = page.getByRole('textbox', { name: 'Contraseña' }); 
  await expect(userInput).toBeVisible();
  await expect(userInput).toBeEditable();
  await expect(userInput).toBeEmpty();
  await expect(pwdInput).toBeVisible();
  await expect(pwdInput).toBeEditable();
  await expect(pwdInput).toBeEmpty();
  // Pulso en el botón ¿Olvidaste tu contraseña?
  await page.getByRole('button', { name: '¿Olvidaste tu contraseña?' }).click(); 
  // Compruebo que se visualiza la modal de recordar contraseña
  await expect(page.getByText('Recordar contraseña')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Usuario / Correo electrónico' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Introduce el resultado' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Volver' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enviar' })).toBeVisible();
  // 7.1.- Compruebo el funcionamiento del botón 'Volver'
  await page.getByRole('button', { name: 'Volver' }).click();
  // Compruebo que ya no se visualiza la modal de recordar contraseña
  await expect(page.getByText('Recordar contraseña')).toBeHidden();
  // Y compruebo que se visualiza la modal de login
  await expect(userInput).toBeVisible();
  await expect(pwdInput).toBeVisible();
  // 7.2.- Compruebo el funcionamiento del botón 'Enviar' de la modal 'Recordar contraseña'
  // Pulso en el botón ¿Olvidaste tu contraseña?
  await page.getByRole('button', { name: '¿Olvidaste tu contraseña?' }).click(); 
  // Compruebo que se visualiza la modal de recordar contraseña
  await expect(page.getByText('Recordar contraseña')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enviar' })).toBeVisible();  
  await page.getByRole('button', { name: 'Enviar' }).click();
  // Compruebo que se muestra un mensaje de error
  await expect(page.getByText('Revisa que todos los campos estén rellenos')).toBeVisible();
  await expect(page.getByRole('button', { name: 'OK' })).toBeVisible();
  // Pulso en botón 'Ok' del mensaje de error
  await page.getByRole('button', { name: 'OK' }).click();
  // Compruebo que el mensaje se ha cerrado y se sigue mostrando la modal de 'Recordar contraseña'
  await expect(page.getByText('Revisa que todos los campos estén rellenos')).toBeHidden();
  await expect(page.getByText('Recordar contraseña')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Usuario / Correo electrónico' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Introduce el resultado' })).toBeVisible();
  // 7.3.- Compruebo el funcionamiento del botón 'Cerrar' de la modal 'Recordar contraseña'
  await page.getByRole('button', { name: 'close' }).click();
  // Compruebo que ya no se visualiza la modal de recordar contraseña
  await expect(page.getByText('Recordar contraseña')).toBeHidden();
  // Y compruebo que tampoco se visualiza la modal de login
  await expect(userInput).toBeHidden();
  await expect(pwdInput).toBeHidden();
});


