
const fs = require('fs');
const cron = require('node-cron');
const { exec } = require('child_process');


const filePath = 'request.txt';

cron.schedule('* * * * *', () => {

    console.log('Ejecutando git commit...');

    
    //genero un commit con la fecha y hora actual
    exec('cd C:/laragon/www/script && git add . && git commit -m "Commit automático: ' + new Date().toISOString() + '"', (err, stdout, stderr) => {
        if (err) console.error(`Error: ${err.message}`); });

    console.log('Ejecutando git push...');
    
    exec('cd C:/laragon/www/script && git push origin main', (err, stdout, stderr) => {
        if (err) console.error(`Error: ${err.message}`);
        if (stdout) console.log(`Salida: ${stdout}`);
        if (stderr) console.error(`Error estándar: ${stderr}`);
    
    });

   
      
       
        fs.writeFile(filePath, new Date().toISOString(), function (err){})
	   // fs.appendFile(filePath, count, function (err) {if (err) throw err;});
	   


});

console.log('Tarea programada para ejecutarse cada minuto');
