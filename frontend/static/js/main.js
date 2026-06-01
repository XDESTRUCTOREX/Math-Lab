/* ============================================
   MATHLAB - MAIN APPLICATION
   Premium UI Controller + Progressive Step Reveal
   ============================================ */

let modeloActual = "enfriamiento";
let seccionActual = "resolver";

// =====================================
// INIT FORM
// =====================================

generarFormulario(modeloActual);

// =====================================
// SIDEBAR MODEL BUTTONS
// =====================================

const botones = document.querySelectorAll(".modelo-btn");
botones.forEach(btn => {
    btn.addEventListener("click", () => {
        botones.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
        modeloActual = btn.dataset.modelo;

        document.getElementById("seccion-resolver").style.display = "block";
        document.getElementById("seccion-teoria").style.display = "none";
        seccionActual = "resolver";

        // Remove active from logo teoria link
        var teoriaLink = document.getElementById('logo-teoria-link');
        if (teoriaLink) teoriaLink.classList.remove('active-link');

        generarFormulario(modeloActual);
        limpiarResultados();
    });
});

// =====================================
// CLEAR RESULTS
// =====================================

function limpiarResultados() {
    const contenedor = document.getElementById("resultado-contenedor");
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="placeholder">
                <div class="placeholder-icon">∫</div>
                <h2>Esperando resolución...</h2>
                <p>Completa los datos y presiona Resolver.</p>
            </div>
        `;
    }
}

// =====================================
// CALCULATING ANIMATION - Epic math loading
// =====================================

function showCalculatingOverlay() {
    var overlay = document.getElementById("calculating-overlay");
    if (!overlay) return;
    overlay.classList.add("active");

    // Cycle through formulas
    var formulas = [
        "dy/dx = f(x, y)",
        "∫ f(x) dx = F(x) + C",
        "dT/dt = -k(T - Tₐ)",
        "μ(x) = e^(∫P(x)dx)",
        "dP/dt = kP",
        "∂M/∂y = ∂N/∂x",
        "y' + P(x)y = Q(x)",
        "Q(t) = rₑcₑ - rₛQ/V",
    ];
    var idx = 0;
    var formulaEl = overlay.querySelector(".calc-formula");
    if (formulaEl) {
        overlay._formulaInterval = setInterval(function() {
            formulaEl.style.opacity = '0';
            setTimeout(function() {
                idx = (idx + 1) % formulas.length;
                formulaEl.textContent = formulas[idx];
                formulaEl.style.opacity = '1';
            }, 200);
        }, 1000);
    }

    // Animate progress dots
    var dots = overlay.querySelectorAll(".calc-dot");
    dots.forEach(function(dot, i) {
        dot.style.animationDelay = (i * 0.15) + 's';
    });
}

function hideCalculatingOverlay() {
    var overlay = document.getElementById("calculating-overlay");
    if (!overlay) return;
    if (overlay._formulaInterval) {
        clearInterval(overlay._formulaInterval);
        overlay._formulaInterval = null;
    }
    overlay.classList.remove("active");
}

// =====================================
// RESOLVE BUTTON
// =====================================

const resolverBtn = document.getElementById("resolver-btn");
if (resolverBtn) {
    resolverBtn.addEventListener("click", resolverModelo);
}

// =====================================
// RESOLVE MODEL
// =====================================

async function resolverModelo() {
    const btn = document.getElementById("resolver-btn");
    btn.classList.add("loading");
    showCalculatingOverlay();

    try {
        let datos = {};
        let url = "";

        const tipoCalculo = document.getElementById("tipo-calculo").value;
        datos.tipo_calculo = tipoCalculo;

        // ENFRIAMIENTO
        if (modeloActual === "enfriamiento") {
            datos.ambiente = document.getElementById("ambiente").value;
            datos.inicial = document.getElementById("inicial").value;
            datos.medida = document.getElementById("medida").value;
            datos.tiempo_medida = document.getElementById("tiempo_medida").value;
            datos.unidad_tiempo = document.getElementById("unidad_tiempo_enfriamiento").value;

            if (tipoCalculo === "temperatura") {
                datos.tiempo_buscar = document.getElementById("tiempo_buscar").value;
            } else if (tipoCalculo === "tiempo") {
                datos.temperatura_objetivo = document.getElementById("temperatura_objetivo").value;
            }
            url = "/resolver/enfriamiento";
        }

        // MEZCLAS
        else if (modeloActual === "mezclas") {
            datos.volumen = document.getElementById("volumen").value;
            datos.cantidad_inicial = document.getElementById("cantidad_inicial").value;
            datos.concentracion_inicial = document.getElementById("concentracion_inicial").value;
            datos.caudal_entrada = document.getElementById("caudal_entrada").value;
            datos.concentracion_entrada = document.getElementById("concentracion_entrada").value;
            datos.caudal_salida = document.getElementById("caudal_salida").value;
            datos.unidad_tiempo = document.getElementById("unidad_tiempo_mezclas").value;

            if (tipoCalculo === "cantidad") {
                datos.tiempo_buscar = document.getElementById("tiempo_buscar").value;
            } else if (tipoCalculo === "tiempo") {
                datos.cantidad_objetivo = document.getElementById("cantidad_objetivo").value;
                datos.concentracion_objetivo = document.getElementById("concentracion_objetivo").value;
            }
            url = "/resolver/mezclas";
        }

        // CRECIMIENTO
        else if (modeloActual === "crecimiento") {
            datos.cantidad_inicial = document.getElementById("cantidad_inicial").value;
            datos.unidad_tiempo = document.getElementById("unidad_tiempo_crecimiento").value;

            const modoKInput = document.querySelector('input[name="modo_k"]:checked');
            const modoDosPuntos = modoKInput && modoKInput.value === "dos_puntos";
            datos.modo_dos_puntos = modoDosPuntos;

            if (modoDosPuntos) {
                datos.t1 = document.getElementById("t1").value;
                datos.p1 = document.getElementById("p1").value;
            } else {
                datos.constante_crecimiento = document.getElementById("constante_crecimiento").value;
            }

            if (tipoCalculo === "cantidad") {
                datos.tiempo = document.getElementById("tiempo").value;
            } else if (tipoCalculo === "tiempo") {
                datos.cantidad_objetivo = document.getElementById("cantidad_objetivo").value;
            }
            url = "/resolver/crecimiento";
        }

        // DECAIMIENTO
        else if (modeloActual === "decaimiento") {
            datos.cantidad_inicial = document.getElementById("cantidad_inicial").value;
            datos.unidad_tiempo = document.getElementById("unidad_tiempo_decaimiento").value;

            const modoKInput = document.querySelector('input[name="modo_k"]:checked');
            const modoDosPuntos = modoKInput && modoKInput.value === "dos_puntos";
            datos.modo_dos_puntos = modoDosPuntos;

            if (modoDosPuntos) {
                datos.t1 = document.getElementById("t1").value;
                datos.n1 = document.getElementById("n1").value;
            } else {
                datos.constante_decaimiento = document.getElementById("constante_decaimiento").value;
            }

            if (tipoCalculo === "cantidad") {
                datos.tiempo = document.getElementById("tiempo").value;
            } else if (tipoCalculo === "tiempo") {
                datos.cantidad_objetivo = document.getElementById("cantidad_objetivo").value;
            }
            url = "/resolver/decaimiento";
        }

        // LINEALES
        else if (modeloActual === "lineales") {
            datos.p_expr = document.getElementById("p_expr").value;
            datos.q_expr = document.getElementById("q_expr").value;

            if (tipoCalculo === "particular") {
                datos.x0 = document.getElementById("x0").value;
                datos.y0 = document.getElementById("y0").value;
            }
            url = "/resolver/lineales";
        }

        // EXACTAS
        else if (modeloActual === "exactas") {
            datos.m_expr = document.getElementById("m_expr").value;
            datos.n_expr = document.getElementById("n_expr").value;

            if (tipoCalculo === "particular") {
                datos.x0 = document.getElementById("x0").value;
                datos.y0 = document.getElementById("y0").value;
            }
            url = "/resolver/exactas";
        }

        limpiarResultados();

        const respuesta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();
        mostrarResultado(resultado, modeloActual);

    } catch (error) {
        console.error(error);
        mostrarResultado({
            error: true,
            mensaje: error.message || "Error al conectar con el servidor"
        });
    } finally {
        btn.classList.remove("loading");
        hideCalculatingOverlay();
    }
}

// =====================================
// DISPLAY RESULTS - Progressive Reveal
// =====================================

function mostrarResultado(resultado, modeloNombre) {
    const contenedor = document.getElementById("resultado-contenedor");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    // Error
    if (resultado.error) {
        contenedor.innerHTML = `
            <div class="error-panel">
                <h3>Error al resolver</h3>
                <p>${escapeHTML(resultado.mensaje)}</p>
            </div>
        `;
        return;
    }

    // Steps with staggered animation - PROGRESSIVE REVEAL
    if (resultado.pasos && resultado.pasos.length > 0) {
        resultado.pasos.forEach((paso, index) => {
            const pasoDiv = document.createElement("div");
            pasoDiv.className = "paso paso-hidden";
            pasoDiv.setAttribute("data-step-index", index);
            pasoDiv.innerHTML = `
                <h4>
                    <span class="step-number">${index + 1}</span>
                    ${escapeHTML(paso.titulo)}
                </h4>
                <p class="descripcion">${escapeHTML(paso.descripcion)}</p>
                <div class="formula">
                    \\[${paso.latex}\\]
                </div>
            `;
            contenedor.appendChild(pasoDiv);
        });

        // Progressive reveal: show steps one by one with delay
        var stepElements = contenedor.querySelectorAll('.paso-hidden');
        var revealDelay = 180; // ms between each step

        stepElements.forEach(function(el, i) {
            setTimeout(function() {
                el.classList.remove('paso-hidden');
                el.classList.add('paso-visible');

                // Render LaTeX for this step when it becomes visible
                if (window.MathJax && window.MathJax.typeset) {
                    MathJax.typeset();
                }

                // Scroll to the new step smoothly
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300 + (i * revealDelay));
        });
    }

    // Final result - appears after all steps
    var totalStepsDelay = resultado.pasos ? (resultado.pasos.length * 180 + 600) : 300;

    setTimeout(function() {
        const resultDiv = document.createElement("div");
        resultDiv.className = "resultado-final resultado-hidden";
        resultDiv.innerHTML = `
            <div class="result-label">Resultado Final</div>
            <h1>${escapeHTML(String(resultado.resultado))}</h1>
            <button class="copy-btn" onclick="copiarResultado(this, '${escapeForAttr(String(resultado.resultado))}')">
                Copiar
            </button>
        `;
        contenedor.appendChild(resultDiv);

        // Trigger reveal animation
        setTimeout(function() {
            resultDiv.classList.remove('resultado-hidden');
            resultDiv.classList.add('resultado-visible');
        }, 50);

        // Graph if available
        if (resultado.grafica) {
            setTimeout(function() {
                const graphDiv = document.createElement("div");
                graphDiv.className = "graph-container graph-hidden";
                graphDiv.innerHTML = `
                    <div class="graph-header">
                        <h4><span class="graph-icon">Grafica</span> Grafica de la solucion</h4>
                        <button class="copy-btn" onclick="descargarGrafica()">Descargar</button>
                    </div>
                    <div class="graph-body">
                        <img src="data:image/png;base64,${resultado.grafica}" alt="Grafica de la solucion">
                    </div>
                `;
                contenedor.appendChild(graphDiv);

                setTimeout(function() {
                    graphDiv.classList.remove('graph-hidden');
                    graphDiv.classList.add('graph-visible');
                }, 50);
            }, 400);
        }

        // Final MathJax render
        if (window.MathJax && window.MathJax.typeset) {
            MathJax.typeset();
        }
    }, totalStepsDelay);
}

// =====================================
// COPY / DOWNLOAD HELPERS
// =====================================

function copiarResultado(btn, texto) {
    navigator.clipboard.writeText(texto).then(() => {
        btn.classList.add("copied");
        btn.textContent = "Copiado";
        setTimeout(() => {
            btn.classList.remove("copied");
            btn.textContent = "Copiar";
        }, 2000);
    });
}

function descargarGrafica() {
    const img = document.querySelector(".graph-body img");
    if (!img) return;
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "mathlab_grafica.png";
    a.click();
}

function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function escapeForAttr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// =====================================
// THEORY MODULE
// =====================================

const teoria = {
    enfriamiento: {
        titulo: "Ley de Enfriamiento de Newton",
        descripcion: `
            <p>La Ley de Enfriamiento de Newton establece que la tasa de perdida de calor de un cuerpo es directamente proporcional a la diferencia de temperatura entre el cuerpo y su entorno.</p>
            <h3>Ecuacion Diferencial</h3>
            <p>Se modela mediante la siguiente ecuacion diferencial de primer orden:</p>
            <div class="formula">\\[\\frac{dT}{dt} = -k(T - T_a)\\]</div>
            <p>Donde:</p>
            <ul>
                <li><strong>T(t):</strong> Temperatura del cuerpo en el instante t.</li>
                <li><strong>T<sub>a</sub>:</strong> Temperatura del ambiente.</li>
                <li><strong>k:</strong> Constante de proporcionalidad positiva.</li>
            </ul>
            <h3>Solucion General</h3>
            <div class="formula">\\[T(t) = T_a + C e^{-kt}\\]</div>
            <h3>Ejemplo</h3>
            <p>Una taza de cafe a 95 grados C en una sala a 20 grados C. Despues de 10 min se enfria a 70 grados C. Se usa T(0) para hallar C y T(10) para despejar k.</p>
        `
    },
    mezclas: {
        titulo: "Modelo de Mezclas",
        descripcion: `
            <p>El problema de mezclas analiza la cantidad de sustancia soluble en un tanque donde entra y sale solucion a flujos constantes.</p>
            <h3>Ecuacion Diferencial</h3>
            <div class="formula">\\[\\frac{dQ}{dt} = r_e c_e - r_s \\frac{Q(t)}{V}\\]</div>
            <h3>Solucion</h3>
            <p>Se resuelve con factor integrante. El estado de equilibrio es:</p>
            <div class="formula">\\[\\lim_{t \\to \\infty} Q(t) = V \\cdot c_e\\]</div>
        `
    },
    crecimiento: {
        titulo: "Crecimiento Exponencial",
        descripcion: `
            <p>Modela sistemas donde la tasa de aumento es proporcional al valor actual (poblaciones sin restricciones).</p>
            <h3>Ecuacion Diferencial</h3>
            <div class="formula">\\[\\frac{dP}{dt} = kP \\quad (k > 0)\\]</div>
            <h3>Solucion General</h3>
            <div class="formula">\\[P(t) = P_0 e^{kt}\\]</div>
            <h3>Tiempo de Duplicacion</h3>
            <div class="formula">\\[t_d = \\frac{\\ln(2)}{k}\\]</div>
        `
    },
    decaimiento: {
        titulo: "Decaimiento Exponencial",
        descripcion: `
            <p>Describe procesos donde una sustancia disminuye proporcionalmente a su cantidad actual (desintegracion radiactiva).</p>
            <h3>Ecuacion Diferencial</h3>
            <div class="formula">\\[\\frac{dN}{dt} = -kN \\quad (k > 0)\\]</div>
            <h3>Solucion General</h3>
            <div class="formula">\\[N(t) = N_0 e^{-kt}\\]</div>
            <h3>Vida Media</h3>
            <div class="formula">\\[t_{1/2} = \\frac{\\ln(2)}{k}\\]</div>
            <p>Aplicacion: datacion por <strong>Carbono-14</strong>.</p>
        `
    },
    lineales: {
        titulo: "Ecuaciones Lineales de Primer Orden",
        descripcion: `
            <p>Una ecuacion es lineal si se escribe en la forma estandar:</p>
            <div class="formula">\\[y' + P(x)y = Q(x)\\]</div>
            <h3>Metodo del Factor Integrante</h3>
            <ol>
                <li>Calcular el factor integrante</li>
                <li>Multiplicar ambos lados por el factor</li>
                <li>Integrar ambos lados respecto a x</li>
                <li>Despejar y(x)</li>
            </ol>
        `
    },
    exactas: {
        titulo: "Ecuaciones Exactas",
        descripcion: `
            <p>Una ecuacion M(x,y)dx + N(x,y)dy = 0 es <strong>exacta</strong> si:</p>
            <div class="formula">\\[\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}\\]</div>
            <h3>Resolucion</h3>
            <p>Se integra M respecto a x, se determina g(y), y la solucion es F(x,y) = C.</p>
            <h3>Factores Integrantes</h3>
            <p>Si no es exacta, se busca un factor integrante tal que la ecuacion multiplicada se vuelva exacta.</p>
        `
    }
};

function inicializarTeoria() {
    const contenedor = document.getElementById("seccion-teoria");
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="teoria-layout">
            <div class="teoria-sidebar">
                <button class="teoria-tema-btn active" data-tema="enfriamiento"><span class="tema-number">1</span> Enfriamiento</button>
                <button class="teoria-tema-btn" data-tema="mezclas"><span class="tema-number">2</span> Mezclas</button>
                <button class="teoria-tema-btn" data-tema="crecimiento"><span class="tema-number">3</span> Crecimiento</button>
                <button class="teoria-tema-btn" data-tema="decaimiento"><span class="tema-number">4</span> Decaimiento</button>
                <button class="teoria-tema-btn" data-tema="lineales"><span class="tema-number">5</span> Lineales</button>
                <button class="teoria-tema-btn" data-tema="exactas"><span class="tema-number">6</span> Exactas</button>
            </div>
            <div class="teoria-contenido" id="teoria-contenido-panel"></div>
        </div>
    `;

    const temaBtns = contenedor.querySelectorAll(".teoria-tema-btn");
    temaBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            temaBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            mostrarTeoria(btn.dataset.tema);
        });
    });

    mostrarTeoria("enfriamiento");
}

function mostrarTeoria(temaKey) {
    const panel = document.getElementById("teoria-contenido-panel");
    if (!panel || !teoria[temaKey]) return;

    const data = teoria[temaKey];
    panel.innerHTML = `
        <div class="teoria-badge">Modelo ${temaKey.charAt(0).toUpperCase() + temaKey.slice(1)}</div>
        <h2>${data.titulo}</h2>
        <p class="teoria-subtitle">Fundamentos teoricos y formulas principales</p>
        <div class="teoria-section">
            <div class="teoria-section-title"><span class="section-icon">D</span> Definicion</div>
            ${data.descripcion}
        </div>
    `;

    if (window.MathJax && window.MathJax.typeset) {
        MathJax.typeset();
    }
}