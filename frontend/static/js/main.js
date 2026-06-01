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
// NUEVA ANIMACIÓN INLINE
// =====================================

function showInlineMathLoading() {
    const contenedor = document.getElementById("resultado-contenedor");
    if (!contenedor) return;
    
    contenedor.innerHTML = `
        <div class="math-loading-container">
            <div class="math-loading-symbols">
                <span>∫</span>
                <span>∂</span>
                <span>∑</span>
                <span>∞</span>
            </div>
            <div class="math-loading-text">Resolviendo ecuación...</div>
            <div class="math-loading-bar"></div>
        </div>
    `;
}

function hideInlineMathLoading() {
    // No necesitamos hacer nada aquí, porque mostrarResultado() 
    // sobreescribirá el HTML del contenedor automáticamente.
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
    
    // Usamos la nueva animación en lugar del overlay
    showInlineMathLoading(); 

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

        // =====================================================================
        // MAGIA DE LA ANIMACIÓN: Promise.all
        // Esperamos un MÍNIMO de 1.2 segundos para que se aprecie la animación.
        // Si el servidor tarda más, esperamos lo que tarde el servidor.
        // =====================================================================
        const [respuesta] = await Promise.all([
            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            }),
            new Promise(resolve => setTimeout(resolve, 1200)) // 1200 ms = 1.2 segundos mínimo
        ]);

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
        //hideCalculatingOverlay();
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

                // Render LaTeX for this step when it becomes visible (render only this step)
                try { renderMath(el); } catch (e) { console.error('renderMath error', e); }

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

        // Detectar si el resultado tiene LaTeX (contiene backslashes o llaves)
        const rawResult = String(resultado.resultado || "");
        const looksLikeLatex = rawResult.includes('\\') || rawResult.includes('{') || rawResult.match(/\\frac|\\sqrt|\\boxed|\^/);

        if (looksLikeLatex) {
            resultDiv.innerHTML = `
                <div class="result-label">Resultado Final</div>
                <div class="formula">\\[${rawResult}\\]</div>
                <button class="copy-btn" onclick="copiarResultado(this, '${escapeForAttr(rawResult)}')">Copiar</button>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="result-label">Resultado Final</div>
                <h1>${escapeHTML(rawResult)}</h1>
                <button class="copy-btn" onclick="copiarResultado(this, '${escapeForAttr(rawResult)}')">Copiar</button>
            `;
        }
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

        // Final MathJax render: typeset only the result container
        try { renderMath(contenedor); } catch (e) { console.error('renderMath error', e); }
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

// Robust MathJax renderer: use typesetPromise when available,
// otherwise fallback to typeset or wait until MathJax loads.
function renderMath(element) {
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([element]).catch(e => console.error('MathJax:', e && e.message));
    } else if (window.MathJax && window.MathJax.typeset) {
        try { MathJax.typeset(); } catch (e) { console.error('MathJax typeset error', e); }
    } else {
        var _mjWait = setInterval(function() {
            if (window.MathJax && window.MathJax.typesetPromise) {
                clearInterval(_mjWait);
                MathJax.typesetPromise([element]).catch(e => console.error('MathJax:', e && e.message));
            } else if (window.MathJax && window.MathJax.typeset) {
                clearInterval(_mjWait);
                try { MathJax.typeset(); } catch (e) { console.error('MathJax typeset error', e); }
            }
        }, 200);
    }
}

// =====================================
// THEORY MODULE
// =====================================

const teoria = {
    enfriamiento: {
        titulo: "Ley de Enfriamiento de Newton",
        descripcion: `
            <p>La Ley de Enfriamiento de Newton establece que la tasa de pérdida de calor es proporcional a la diferencia entre la temperatura del cuerpo y la del ambiente.</p>
            <h3>Ecuación</h3>
            <div class="formula">\\[\\dfrac{dT}{dt} = -k\\bigl(T - T_a\\bigr)\\]</div>
            <h3>Pasos ampliados</h3>
            <ol>
                <li><strong>Separar variables:</strong> \\[\\dfrac{dT}{T - T_a} = -k\\,dt\\].</li>
                <li><strong>Integrar:</strong> \\[\\int\\dfrac{dT}{T - T_a} = -\\int k\\,dt \\Rightarrow \\ln\\bigl|T - T_a\\bigr| = -kt + C\\].</li>
                <li><strong>Exponenciar:</strong> \\[T(t)=T_a + C e^{-kt}\\], donde \\(C = T(0)-T_a\\).</li>
                <li><strong>Determinar \\(k\\):</strong> si se conoce \\(T(t_1)\\), calcular \\(k = -\\dfrac{1}{t_1}\\ln\\left(\\dfrac{T(t_1)-T_a}{T(0)-T_a}\\right)\\).</li>
                <li><strong>Validación:</strong> comprobar que \\(k>0\\) y que la solución tiende a \\(T_a\\) cuando \\(t\\to\\infty\\).</li>
            </ol>
            <h3>Ejemplo</h3>
            <p>Si \\(T(0)=95\\), \\(T_a=20\\) y \\(T(10)=70\\), entonces \\(C=75\\) y \\(k = -\\dfrac{1}{10}\\ln\\left(\\dfrac{50}{75}\\right)\\).</p>
        `
    },
    mezclas: {
        titulo: "Modelo de Mezclas",
        descripcion: `
            <p>Describe cómo cambia la cantidad Q(t) en un tanque con entrada y salida de solución.</p>
            <h3>Ecuación</h3>
            <div class="formula">\\[\\frac{dQ}{dt} = r_e c_e - r_s \\frac{Q}{V}\\]</div>
            <h3>Pasos ampliados</h3>
            <ol>
                <li>Definir E = r_e c_e y k = r_s / V.</li>
                <li>Reescribir como \\(Q' + kQ = E\\).</li>
                <li>Calcular \\(\\mu = e^{\\int k \\, dt} = e^{kt}\\).</li>
                <li>Multiplicar por \\(\\mu\\): \\(\\frac{d}{dt}(\\mu Q) = \\mu E\\).</li>
                <li>Integrar y despejar \\(Q(t) = Q_{eq} + A e^{-kt}\\) con \\(Q_{eq}=E/k\\).</li>
                <li>Usar \\(Q(0)\\) para hallar A y obtener la solución particular.</li>
            </ol>
            <h3>Ejemplo</h3>
            <p>Con V = 100, r_e = 5, c_e = 2, r_s = 5, se obtiene k = 0.05, E = 10 y Q_{eq} = 200.</p>
        `
    },
    crecimiento: {
        titulo: "Crecimiento Exponencial",
        descripcion: `
            <p>Modela procesos donde la tasa de variación es proporcional al valor actual.</p>
            <h3>Ecuación</h3>
            <div class="formula">\\[\\frac{dP}{dt} = kP\\]</div>
            <h3>Pasos ampliados</h3>
            <ol>
                <li>Separar variables: \\[\\frac{dP}{P} = k \\, dt\\].</li>
                <li>Integrar: \\[\\ln|P| = kt + C\\].</li>
                <li>Exponenciar y fijar la condición inicial \\(P(0)=P_0\\) para obtener \\(P(t)=P_0 e^{kt}\\).</li>
                <li>Usar la solución para determinar tiempos, tasas de crecimiento o valores futuros.</li>
            </ol>
            <h3>Ejemplo</h3>
            <p>Si \\(P_0=100\\) y \\(k=0.05\\), entonces \\(P(10)=100 e^{0.5}\\approx164.87\\.</p>
        `
    },
    decaimiento: {
        titulo: "Decaimiento Exponencial",
        descripcion: `
            <p>Describe procesos donde el valor decrece en proporción a su magnitud.</p>
            <h3>Ecuación</h3>
            <div class="formula">\\[\\frac{dN}{dt} = -kN\\]</div>
            <h3>Pasos ampliados</h3>
            <ol>
                <li>Separar variables: \\[\\frac{dN}{N} = -k \\, dt\\].</li>
                <li>Integrar y exponenciar para obtener \\(N(t)=N_0 e^{-kt}\\).</li>
                <li>Calcular la vida media \\(t_{1/2}=\\ln(2)/k\\).</li>
            </ol>
            <h3>Ejemplo</h3>
            <p>Si \\(N_0=1000\\) y \\(k=0.1\\), entonces \\(t_{1/2}\\approx6.93\\.</p>
        `
    },
    lineales: {
        titulo: "Ecuaciones Lineales de Primer Orden",
        descripcion: `
            <p>Resolver una ecuación en la forma \\[y' + P(x)y = Q(x)\\] mediante factor integrante.</p>
            <h3>Pasos ampliados</h3>
            <ol>
                <li>Convertir la ecuación a la forma estándar.</li>
                <li>Calcular \\(\\mu(x)=e^{\\int P(x)\\,dx}\\).</li>
                <li>Multiplicar por \\(\\mu\\) y reconocer que la izquierda es \\(\\frac{d}{dx}(\\mu y)\\).</li>
                <li>Integrar: \\(\\mu y = \\int \\mu Q\\,dx + C\\).</li>
                <li>Despejar \\(y\\): \\(y = \\frac{1}{\\mu} \\left( \\int \\mu Q\\,dx + C \\right)\\).</li>
                <li>Si hay condición inicial, sustituir para hallar \\(C\\).</li>
            </ol>
            <h3>Ejemplo</h3>
            <p>Para \\(y' + \\frac{1}{x} y = \\frac{\\sin x}{x}\\), el factor integrante es \\(\\mu = x\\) y la solución usa \\(\\int \\sin x\\,dx = -\\cos x\\).</p>
        `
    },
    exactas: {
        titulo: "Ecuaciones Exactas",
        descripcion: `
            <p>Resolver \\(M(x,y)\\,dx + N(x,y)\\,dy = 0\\) verificando exactitud y construyendo una función potencial \\(F(x,y)\\).</p>
            <h3>Concepto clave</h3>
            <p>Una ecuación es exacta si existe \\(F(x,y)\\) tal que \\(dF = M(x,y)\\,dx + N(x,y)\\,dy\\). Esto implica que las derivadas cruzadas coinciden.</p>
            <h3>Condición de exactitud</h3>
            <div class="formula">\\[\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}\\]</div>
            <h3>Pasos ampliados</h3>
            <ol>
                <li><strong>Verificar exactitud:</strong> calcular \\(\\frac{\\partial M}{\\partial y}\\) y \\(\\frac{\\partial N}{\\partial x}\\).</li>
                <li><strong>Integrar \\(M\\) respecto a \\(x\\):</strong> obtener \\(F(x,y) = \\int M(x,y)\\,dx + g(y)\\), donde \\(g(y)\\) es una función de \\(y\\).</li>
                <li><strong>Determinar \\(g(y)\\):</strong> derivar \\(F(x,y)\\) respecto a \\(y\\): \\(F_y(x,y) = \\frac{\\partial F}{\\partial y} = N(x,y)\\).</li>
                <li><strong>Comparar y despejar:</strong> igualar \\(F_y(x,y)\\) a \\(N(x,y)\\) para encontrar \\(g'(y)\\).</li>
                <li><strong>Integrar \\(g'(y)\\):</strong> calcular \\(g(y) = \\int g'(y)\\,dy\\) y completar \\(F(x,y)\\).</li>
                <li><strong>Solución implícita:</strong> escribir \\(F(x,y) = C\\), donde \\(C\\) es constante de integración.</li>
                <li><strong>Si no es exacta:</strong> probar un factor integrante \\(\\mu(x)\\) o \\(\\mu(y)\\) tal que \\(\\mu(x)M(x,y)\\,dx + \\mu(x)N(x,y)\\,dy\\) o \\(\\mu(y)M(x,y)\\,dx + \\mu(y)N(x,y)\\,dy\\) sea exacta.</li>
            </ol>
            <h3>Ejemplo paso a paso</h3>
            <p>Para \\(M(x,y)=x+y\\) y \\(N(x,y)=x-y\\):</p>
            <ol>
                <li>Calcular \\(\\frac{\\partial M}{\\partial y} = 1\\) y \\(\\frac{\\partial N}{\\partial x} = 1\\): la ecuación es exacta.</li>
                <li>Integrar \\(M\\) respecto a \\(x\\): \\(F(x,y)=\\frac{x^{2}}{2} + xy + g(y)\\).</li>
                <li>Derivar \\(F\\) respecto a \\(y\\): \\(F_{y}(x,y)=x + g'(y)\\) y compararlo con \\(N(x,y)=x-y\\).</li>
                <li>Despejar \\(g'(y)\\): \\(x + g'(y) = x - y \\Rightarrow g'(y) = -y\\).</li>
                <li>Integrar \\(g'(y)\\): \\(g(y) = -\\frac{y^{2}}{2} + C_{1}\\), donde \\(C_{1}\\) se absorbe en la constante general.</li>
                <li>Formar \\(F(x,y)\\): \\(F(x,y)=\\frac{x^{2}}{2} + xy - \\frac{y^{2}}{2}\\), y la solución implícita es \\(\\frac{x^{2}}{2} + xy - \\frac{y^{2}}{2} = C\\).</li>
            </ol>
            <h3>Consejo</h3>
            <p>Si la ecuación no es exacta, prueba factores integrantes simples \\(\\mu(x)\\) o \\(\\mu(y)\\), en lugar de asumir inmediatamente que no hay solución.</p>
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

    renderMath(panel);
}