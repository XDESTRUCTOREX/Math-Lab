function generarFormulario(nombreModelo) {

    const formulario = document.getElementById("formulario-dinamico");
    formulario.innerHTML = "";

    const modelo = modelos[nombreModelo];

    // =========================================
    // TITULO
    // =========================================

    document.getElementById("titulo-modelo").textContent = modelo.titulo;

    // =========================================
    // SELECT
    // =========================================
    let opciones = "";
    modelo.tipos.forEach(tipo => {
        opciones += `
            <option value="${tipo.value}">
                ${tipo.texto}
            </option>
        `;
    });

    formulario.innerHTML += `
        <div class="campo">
            <label>
                Tipo de cálculo
            </label>
            <select id="tipo-calculo">
                ${opciones}
            </select>

        </div>
    `;

    // =========================================
    // CAMPOS BASE
    // =========================================

    modelo.campos.forEach(campo => {
        formulario.innerHTML += `
            <div class="campo">
                <label>
                    ${campo.label}

                </label>
                <input
                    type="${campo.type}"
                    id="${campo.id}"
                >
            </div>
        `;
    });

    // =========================================
    // CONTENEDOR DINAMICO
    // =========================================

    formulario.innerHTML += `
        <div id="campo-dinamico"></div>
    `;

    actualizarCampoDinamico();

    // =========================================
    // EVENTO
    // =========================================

    document.getElementById("tipo-calculo").addEventListener("change", () => {
        actualizarCampoDinamico();
        limpiarResultados();
    });
}


// =========================================
// CAMPOS DINAMICOS
// =========================================

function actualizarCampoDinamico() {
    const contenedor = document.getElementById("campo-dinamico");
    const tipo = document.getElementById("tipo-calculo").value;

    // =========================================
    // ENFRIAMIENTO
    // =========================================
    if (modeloActual === "enfriamiento") {
        if (tipo === "temperatura") {
            contenedor.innerHTML = `
                <div class="campo">
                    <label>
                        Tiempo a calcular
                    </label>
                    <input
                        type="number"
                        id="tiempo_buscar"
                    >
                </div>
            `;
        }

        else if (tipo === "tiempo") {
            contenedor.innerHTML = `
                <div class="campo">
                    <label>
                        Temperatura objetivo
                    </label>
                    <input
                        type="number"
                        id="temperatura_objetivo"
                    >
                </div>
            `;
        }

        else {

            contenedor.innerHTML = `
                <div class="placeholder">
                    <p>
                        Se calculará el límite cuando
                        t → ∞
                    </p>
                </div>
            `;
        }
    }

    // =========================================
    // MEZCLAS
    // =========================================

    else if (modeloActual === "mezclas") {
        if (tipo === "cantidad") {
            contenedor.innerHTML = `
                <div class="campo">
                    <label>
                        Tiempo
                    </label>

                    <input
                        type="number"
                        id="tiempo_buscar"
                    >
                </div>
            `;
        }

        else if (tipo === "tiempo") {
            contenedor.innerHTML = `
                <div class="campo">
                    <label>
                        Cantidad objetivo
                    </label>

                    <input
                        type="number"
                        id="cantidad_objetivo"
                    >
                </div>
            `;
        }
        else {
            contenedor.innerHTML = `
                <div class="placeholder">
                    <p>
                        Se calculará el límite
                        cuando t → ∞
                    </p>
                </div>
            `;
        }
    }

    // =========================================
    // CRECIMIENTO
    // =========================================

    else if (modeloActual === "crecimiento") {
        if (tipo === "cantidad") {
            contenedor.innerHTML = `
                <div class="campo">
                    <label>Tiempo</label>
                    <input type="number" id="tiempo">
                </div>
            `;
        }

        else if (tipo === "tiempo") {
            contenedor.innerHTML = `
                <div class="campo">
                    <label>Cantidad objetivo</label>
                    <input type="number" id="cantidad_objetivo">
                </div>
            `;
        }

        else if (tipo === "duplicacion") {
            contenedor.innerHTML = `
                <div class="placeholder">
                    <p>Se calculará el tiempo de duplicación</p>
                </div>
            `;
        }
    }

    // =========================================
    // DECAIMIENTO
    // =========================================

    else if (modeloActual === "decaimiento") {
        if (tipo === "cantidad") {
            contenedor.innerHTML = `
                <div class="campo">
                    <label>Tiempo</label>
                    <input type="number" id="tiempo">
                </div>
            `;
        }

        else if (tipo === "tiempo") {
            contenedor.innerHTML = `
                <div class="campo">
                    <label>Cantidad objetivo</label>
                    <input type="number" id="cantidad_objetivo">
                </div>
            `;
        }

        else if (tipo === "vida_media") {
            contenedor.innerHTML = `
                <div class="placeholder">
                    <p>Se calculará la vida media</p>
                </div>
            `;
        }
    }
}