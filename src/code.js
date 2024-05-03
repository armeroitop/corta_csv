
let boton_cortar = document.getElementById('formulari');

boton_cortar.addEventListener('submit', event => {
    event.preventDefault();

    console.log('pulsado boton');
    dividirCSV();
});

function dividirCSV() {
    const archivoInput = document.getElementById('archivoInput');
    const cantidad = document.getElementById('cantidad').value;
    const archivo = archivoInput.files[0];

    if (!archivo) {
        console.error('No se seleccionó ningún archivo.');
        return;
    }

    const lector = new FileReader();

    lector.onload = function (evento) {
        const contenido = evento.target.result;
        const lineas = contenido.split('\n');

        // Me guardo la cabecera y la elimino
        const cabecera = lineas[0];
        lineas.splice(0, 1);

        let posiciones = [];
        let bloque_recorte = Math.ceil(lineas.length / cantidad);
        let indice_actual = 0;
        let indice_final = 0;

        for (let i = 0; i < cantidad; i++) {

            if (indice_actual + bloque_recorte <= lineas.length) {
                indice_final += bloque_recorte;
            } else {
                indice_final = lineas.length;
            }

            let datos = lineas.slice(indice_actual, indice_final);
            datos.unshift(cabecera);
            datos.join('\n');
            indice_actual = indice_final;
            descargarArchivo(`salida${i}.csv`, datos);
        }

        /* const datos1 = lineas.slice(0, Math.ceil(lineas.length / 2)).join('\n');
        const datos2 = lineas.slice(Math.ceil(lineas.length / 2)).join('\n');

        descargarArchivo('salida1.csv', datos1);
        descargarArchivo('salida2.csv', datos2);

        console.log('Archivos CSV generados exitosamente.'); */
    };

    lector.readAsText(archivo);
}


function descargarArchivo(nombreArchivo, contenido) {
    const contenido_r = contenido.join('').replace(/(^,)|(,$)/gm, '');
    
    const blob = new Blob([contenido_r], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;

    document.body.appendChild(link);
    link.click();

    // Limpiar después de la descarga
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
}


