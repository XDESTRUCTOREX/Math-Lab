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
        if (campo.type === "radio") {
            let optionsHTML = "";
            campo.opciones.forEach(opt => {
                const checked = opt.value === campo.default ? "checked" : "";
                optionsHTML += `
                    <label class="radio-option" style="display: inline-flex; align-items: center; gap: 8px; margin-right: 15px; cursor: pointer;">
                        <input type="radio" name="${campo.id}" value="${opt.value}" ${checked}>
                        <span>${opt.label}</span>
                    </label>
                `;
            });
            formulario.innerHTML += `
                <div class="campo" id="contenedor-${campo.id}">
                    <label>${campo.label}</label>
                    <div style="display: flex; gap: 10px; margin-top: 5px;">
                        ${optionsHTML}
                    </div>
                </div>
            `;
        } else {
            formulario.innerHTML += `
                <div class="campo" id="contenedor-${campo.id}">
                    <label>
                        ${campo.label}
                    </label>
                    <input
                        type="${campo.type}"
                        id="${campo.id}"
                    >
                </div>
            `;
        }
    });

    // =========================================
    // CONTENEDOR DINAMICO
    // =========================================

    formulario.innerHTML += `
        <div id="campo-dinamico"></div>
    `;

    actualizarCampoDinamico();

    // =========================================
    // EVENTOS
    // =========================================

    document.getElementById("tipo-calculo").addEventListener("change", () => {
        actualizarCampoDinamico();
        limpiarResultados();
    });

    const radiosModoK = formulario.querySelectorAll('input[name="modo_k"]');
    radiosModoK.forEach(radio => {
        radio.addEventListener("change", () => {
            actualizarCampoDinamico();
            limpiarResultados();
        });
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
                        Cantidad/Concentración objetivo
                    </label>
                    <div style="display: flex; gap: 15px;">
                        <div style="flex: 1;">
                            <label style="font-size: 0.85rem; color: #94A3B8;">Cantidad objetivo</label>
                            <input type="number" id="cantidad_objetivo" style="width: 100%;">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 0.85rem; color: #94A3B8;">o Concentración objetivo</label>
                            <input type="number" id="concentracion_objetivo" style="width: 100%;">
                        </div>
                    </div>
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
    // CRECIMIENTO / DECAIMIENTO
    // =========================================

    else if (modeloActual === "crecimiento" || modeloActual === "decaimiento") {
        // Manejar visibilidad de constante_crecimiento / constante_decaimiento, t1, p1, n1
        const modoKInput = document.querySelector('input[name="modo_k"]:checked');
        const modoK = modoKInput ? modoKInput.value : "directo";
        const divK = document.getElementById(modeloActual === "crecimiento" ? "contenedor-constante_crecimiento" : "contenedor-constante_decaimiento");
        const divT1 = document.getElementById("contenedor-t1");
        const divP1N1 = document.getElementById(modeloActual === "crecimiento" ? "contenedor-p1" : "contenedor-n1");
        
        if (modoK === "dos_puntos") {
            if (divK) divK.style.display = "none";
            if (divT1) divT1.style.display = "flex";
            if (divP1N1) divP1N1.style.display = "flex";
        } else {
            if (divK) divK.style.display = "flex";
            if (divT1) divT1.style.display = "none";
            if (divP1N1) divP1N1.style.display = "none";
        }

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

        else if (tipo === "vida_media") {
            contenedor.innerHTML = `
                <div class="placeholder">
                    <p>Se calculará la vida media</p>
                </div>
            `;
        }
    }

    // =========================================
    // LINEALES / EXACTAS
    // =========================================

    else if (modeloActual === "lineales" || modeloActual === "exactas") {
        if (tipo === "particular") {
            contenedor.innerHTML = `
                <div class="campo">
                    <label>Condición inicial x₀</label>
                    <input type="text" id="x0" placeholder="ej. 0">
                </div>
                <div class="campo">
                    <label>Condición inicial y₀</label>
                    <input type="text" id="y0" placeholder="ej. 1">
                </div>
            `;
        } else {
            contenedor.innerHTML = "";
        }
    }
}