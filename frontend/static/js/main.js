let modeloActual = "enfriamiento";

// =====================================
// FORMULARIO INICIAL
// =====================================

generarFormulario(modeloActual);


// =====================================
// BOTONES MODELOS
// =====================================

const botones = document.querySelectorAll(".modelo-btn");

botones.forEach(btn => {
    btn.addEventListener("click", () => {
        botones.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        modeloActual = btn.dataset.modelo;
        generarFormulario(modeloActual);
        limpiarResultados();
    });
});

// =====================================
// LIMPIAR RESULTADOS
// =====================================

function limpiarResultados() {
    const contenedor = document.getElementById("resultado-contenedor");
    contenedor.innerHTML = `

        <div class="placeholder">

            <h2>
                Esperando resolución...
            </h2>

            <p>
                Completa los datos del nuevo cálculo.
            </p>

        </div>
    `;
}

// =====================================
// BOTÓN RESOLVER
// =====================================

document.getElementById("resolver-btn").addEventListener("click", resolverModelo);


// =====================================
// RESOLVER MODELO
// =====================================

async function resolverModelo() {
    try {

        let datos = {};
        let url = "";

        // =====================================
        // LEER TIPO
        // =====================================

        const tipoCalculo = document.getElementById("tipo-calculo").value;

        // =====================================
        // ENFRIAMIENTO
        // =====================================

        if (modeloActual === "enfriamiento") {
            datos = {

                tipo_calculo: tipoCalculo,
                ambiente: document.getElementById("ambiente").value,
                inicial: document.getElementById("inicial").value,
                medida: document.getElementById("medida").value,
                tiempo_medida: document.getElementById("tiempo_medida").value
            };

            // =====================================
            // CALCULAR TEMPERATURA
            // =====================================
            if (tipoCalculo === "temperatura") {
                datos.tiempo_buscar = document.getElementById("tiempo_buscar").value;
            }


            // =====================================
            // CALCULAR TIEMPO
            // =====================================

            else if (tipoCalculo === "tiempo") {
                datos.temperatura_objetivo = document.getElementById("temperatura_objetivo").value;
            }
            url = "/resolver/enfriamiento";
        }

        // =====================================
        // MEZCLAS
        // =====================================

        else if (modeloActual === "mezclas") {

            datos = {

                tipo_calculo: tipoCalculo,
                volumen: document.getElementById("volumen").value,
                cantidad_inicial: document.getElementById("cantidad_inicial").value,
                concentracion_inicial: document.getElementById("concentracion_inicial").value,
                caudal_entrada: document.getElementById("caudal_entrada").value,
                concentracion_entrada: document.getElementById("concentracion_entrada").value,
                caudal_salida: document.getElementById("caudal_salida").value
            };

            // =====================================
            // CALCULAR CANTIDAD
            // =====================================

            if (tipoCalculo === "cantidad") {
                datos.tiempo_buscar = document.getElementById("tiempo_buscar").value;
            }

            // =====================================
            // CALCULAR TIEMPO
            // =====================================

            else if (tipoCalculo === "tiempo") {
                datos.cantidad_objetivo = document.getElementById("cantidad_objetivo").value;
            }

            url = "/resolver/mezclas";
        }

        // =====================================
        // CRECIMIENTO
        // =====================================

        else if (modeloActual === "crecimiento") {

            datos = {
                tipo_calculo: tipoCalculo,
                cantidad_inicial: document.getElementById("cantidad_inicial").value,
                constante_crecimiento: document.getElementById("constante_crecimiento").value
            };

            if (tipoCalculo === "cantidad") {
                datos.tiempo = document.getElementById("tiempo").value;
            }

            else if (tipoCalculo === "tiempo") {
                datos.cantidad_objetivo = document.getElementById("cantidad_objetivo").value;
            }

            url = "/resolver/crecimiento";
        }

        // =====================================
        // DECAIMIENTO
        // =====================================

        else if (modeloActual === "decaimiento") {

            datos = {
                tipo_calculo: tipoCalculo,
                cantidad_inicial: document.getElementById("cantidad_inicial").value,
                constante_decaimiento: document.getElementById("constante_decaimiento").value
            };

            if (tipoCalculo === "cantidad") {
                datos.tiempo = document.getElementById("tiempo").value;
            }

            else if (tipoCalculo === "tiempo") {
                datos.cantidad_objetivo = document.getElementById("cantidad_objetivo").value;
            }

            url = "/resolver/decaimiento";
        }


        // =====================================
        // LIMPIAR
        // =====================================

        limpiarResultados();

        // =====================================
        // FETCH
        // =====================================

        const respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify(datos)
        });

        // =====================================
        // JSON
        // =====================================

        const resultado = await respuesta.json();

        // =====================================
        // MOSTRAR
        // =====================================
        mostrarResultado(resultado);
    }

    catch (error) {
        console.error(error);
        alert("Error conectando con backend");
    }
}


// =====================================
// MOSTRAR RESULTADOS
// =====================================

function mostrarResultado(resultado) {
    const contenedor = document.getElementById("resultado-contenedor");
    contenedor.innerHTML = "";
    // =====================================
    // PASOS
    // =====================================
    resultado.pasos.forEach((paso, index) => {

        contenedor.innerHTML += `
            <div class="paso">
                <h3>
                    ${index + 1}.
                    ${paso.titulo}

                </h3>
                <p>
                    ${paso.descripcion}
                </p>

                <div class="formula">
                    \\\[
                        ${paso.latex}
                    \\\]
                </div>
            </div>
        `;
    });

    // =====================================
    // RESULTADO FINAL
    // =====================================
    contenedor.innerHTML += `

        <div class="resultado-final">
            <h2>
                Resultado Final
            </h2>
            <h1>
                ${resultado.resultado}
            </h1>
        </div>
    `;

    // =====================================
    // RENDER LATEX
    // =====================================
    MathJax.typeset();
}