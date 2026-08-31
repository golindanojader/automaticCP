const fs = require("fs");
const cron = require("node-cron");
const { exec } = require("child_process");

const filePath = "request.txt";

cron.schedule("* * * * *", () => {
  const token = generarToken();
  const timestamp = new Date().toISOString();
  
  fs.writeFile(filePath, timestamp + token, (err) => {
    if (err) console.error(`Error escribiendo archivo: ${err.message}`);
  });

  console.log("Fecha de hoy:", timestamp.split("T")[0]);
  console.log("Ejecutando git add y commit...");

  // Primero: add y commit
  exec(
    `cd C:/laragon/www/script && git add . && git commit -m "Commit automático: ${timestamp}"`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Error en commit: ${err.message}`);
        return;
      }
      if (stdout) console.log(`Commit: ${stdout}`);
      if (stderr) console.error(`stderr commit: ${stderr}`);

      // Segundo: pull para sincronizar
      console.log("Sincronizando con remoto...");
      exec(
        "cd C:/laragon/www/script && git pull origin main --rebase",
        (pullErr, pullStdout, pullStderr) => {
          if (pullErr) {
            console.error(`Error en pull: ${pullErr.message}`);
            // Intentar push forzado si falla el pull
            console.log("Intentando push forzado...");
            ejecutarPushForzado();
          } else {
            if (pullStdout) console.log(`Pull: ${pullStdout}`);
            // Tercero: push normal
            console.log("Ejecutando git push...");
            ejecutarPushNormal();
          }
        }
      );
    }
  );
});

function ejecutarPushForzado() {
  exec(
    "cd C:/laragon/www/script && git push -f origin main",
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Error en push forzado: ${err.message}`);
        // Verificar si la rama existe
        verificarRama();
      } else {
        console.log(`Push forzado exitoso: ${stdout}`);
      }
    }
  );
}

function ejecutarPushNormal() {
  exec(
    "cd C:/laragon/www/script && git push origin main",
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Error en push: ${err.message}`);
        console.log("Intentando push forzado...");
        ejecutarPushForzado();
      } else {
        console.log(`Push exitoso: ${stdout}`);
      }
    }
  );
}

function verificarRama() {
  exec(
    "cd C:/laragon/www/script && git branch -a",
    (err, stdout, stderr) => {
      if (err) console.error(`Error verificando ramas: ${err.message}`);
      else {
        console.log("Ramas disponibles:");
        console.log(stdout);
        console.log("\nVerifica que 'main' exista local y remotamente");
        console.log("Si no, crea la rama con: git branch -M main");
      }
    }
  );
}

function generarToken(longitud = 10000) {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()?-_=+[]{};:,.<>?あい";
  let token = "";

  for (let i = 0; i < longitud; i++) {
    const index = Math.floor(Math.random() * caracteres.length);
    token += caracteres.charAt(index);
  }

  return token;
}