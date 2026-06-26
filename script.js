document.addEventListener("DOMContentLoaded", function () {
    initSemanas();
    // Activar auto-ajuste para campos fijos
    document.querySelectorAll('.auto-expand').forEach(textarea => {
        setupAutoExpand(textarea);
    });
    if (typeof toggleAdaptacionUI === 'function') toggleAdaptacionUI();
});

const componentesDesarrollo = [
    "Desarrollo del Lenguaje",
    "Desarrollo Cognitivo",
    "Desarrollo Socioafectivo",
    "Desarrollo Psicomotor",
    "Desarrollo de la Autonomía"
];

// Función para manejar el auto-ajuste de altura
function setupAutoExpand(textarea) {
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

function initSemanas() {
    const container = document.getElementById('semanas-container');
    let html = "";

    for (let i = 1; i <= 4; i++) {
        html += `
        <div class="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-400">
            <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black uppercase">Semana ${i}</span>
                <div class="h-px bg-slate-100 flex-grow"></div>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Elija los componentes a trabajar:</label>
                    <div class="flex flex-wrap gap-2">
                        ${componentesDesarrollo.map((c, idx) => `
                            <label class="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-transparent hover:border-emerald-200 transition-all has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-300">
                                <input type="checkbox" name="comp_sem${i}" value="${c}" 
                                       class="rounded-full border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                       onchange="togglePerfilText(${i})">
                                <span class="text-xs font-semibold text-slate-600">${c}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div id="perfiles_inputs_sem${i}" class="space-y-4 pt-2">
                    </div>
            </div>
        </div>
        `;
    }
    container.innerHTML = html;
}

function togglePerfilText(semanaNum) {
    const container = document.getElementById(`perfiles_inputs_sem${semanaNum}`);
    const checked = document.querySelectorAll(`input[name="comp_sem${semanaNum}"]:checked`);

    const currentValues = {};
    container.querySelectorAll('textarea').forEach(tx => {
        currentValues[tx.dataset.componente] = tx.value;
    });

    container.innerHTML = "";
    checked.forEach(cb => {
        const val = cb.value;
        const savedVal = currentValues[val] || "";
        const div = document.createElement('div');
        div.className = "animate-in fade-in slide-in-from-top-2 duration-300";
        div.innerHTML = `
            <label class="text-[10px] font-black text-emerald-600 uppercase mb-1 block">Perfil de Salida: ${val}</label>
            <textarea class="input-style text-xs mt-1 auto-expand" 
                      data-componente="${val}" id="perfil_${semanaNum}_${val.replace(/\s+/g, '')}"
                      placeholder="Describa qué logrará el niño en esta área..."
                      rows="2">${savedVal}</textarea>
        `;
        container.appendChild(div);

        // Aplicar auto-expand al nuevo textarea
        const newTextarea = div.querySelector('textarea');
        setupAutoExpand(newTextarea);
        // Ajustar altura inicial si ya tiene contenido
        if (savedVal) {
            setTimeout(() => {
                newTextarea.style.height = 'auto';
                newTextarea.style.height = (newTextarea.scrollHeight) + 'px';
            }, 0);
        }
    });
}

let documentoGeneradoBlob = null;
let documentoNombre = "";

function setProgress(percent, text) {
    const container = document.getElementById('progressContainer');
    const bar = document.getElementById('progressBar');
    const textEl = document.getElementById('progressText');
    const pEl = document.getElementById('progressPercent');

    if (container) container.classList.remove('hidden');
    if (bar) bar.style.width = percent + '%';
    if (textEl) textEl.innerText = text;
    if (pEl) pEl.innerText = percent + '%';
}

function descargarDocumento() {
    if (documentoGeneradoBlob && documentoNombre) {
        window.saveAs(documentoGeneradoBlob, documentoNombre);
    }
}

async function generarPDCWord() {
    const btn = document.getElementById('btnGenerar');
    const btnDescargar = document.getElementById('btnDescargar');
    const output = document.getElementById('promptOutput');
    const originalBtnText = btn.innerHTML;

    try {
        if (btn) {
            btn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> Generando...`;
            btn.disabled = true;
            if (btnDescargar) btnDescargar.classList.add('hidden');
        }

        setProgress(10, 'Inicializando generación...');
        output.value = 'Inicializando generación...\n';

        setTimeout(() => {
            if (output.value.includes('Inicializando')) {
                setProgress(20, 'Analizando datos...');
                output.value += 'Analizando datos...\n';
            }
        }, 600);

        const objNivelFijo = "“Fortalecemos los valores sociocomunitarios en la interrelación intercultural, intracultural y plurilingüe en armonía y complementariedad con la Madre Tierra, desarrollando capacidades y habilidades lingüísticas, cognitivas, socioafectivas, psicomotrices, artísticas y creativas, a través de la observación, exploración, experimentación e investigación, para asumir actitudes inclusivas, de autonomía y toma de decisiones.”";

        const num = document.getElementById('numeroPDC').value || "01";

        const datosReferenciales = {
            distrito: document.getElementById('distrito').value,
            director: document.getElementById('director').value,
            maestro: document.getElementById('maestro').value,
            trimestre: document.getElementById('trimestre').value,
            duracion: document.getElementById('duracion').value,
            ue: document.getElementById('ue').value,
            escolaridad: document.getElementById('escolaridad').value
        };

        const contenidos = {
            cosmos: document.getElementById('cont_cosmos').value,
            comunidad: document.getElementById('cont_comunidad').value,
            vida: document.getElementById('cont_vida').value,
            ciencia: document.getElementById('cont_ciencia').value
        };

        let perfilesSemanalesText = "";
        let semanasConDatos = 0;

        for (let i = 1; i <= 4; i++) {
            const perfilesDiv = document.getElementById(`perfiles_inputs_sem${i}`);
            const textareas = perfilesDiv.querySelectorAll('textarea');

            if (textareas.length > 0) {
                let semanaData = `SEMANA ${i}:\n`;
                let tieneContenido = false;

                textareas.forEach(tx => {
                    if (tx.value.trim() !== "") {
                        semanaData += `- Componente: ${tx.dataset.componente}\n  Perfil de Salida: ${tx.value.trim()}\n`;
                        tieneContenido = true;
                    }
                });

                if (tieneContenido) {
                    perfilesSemanalesText += semanaData + "\n";
                    semanasConDatos++;
                }
            }
        }

        const catAdapt = document.getElementById('categoriaAdaptacion').value;

        let templateFileName = 'inicial_formateado.docx';
        let adaptacionPrompt = "";
        let jsonExtraKeys = "";

        if (catAdapt === "curricular") {
            const detAdapt = document.getElementById('tipoAdaptacion').value || "No especificada";
            adaptacionPrompt = `9. ADAPTACIONES CURRICULARES:\nCondición: ${detAdapt}\nInstrucción: Generar actividades lúdicas generales de apoyo (no organizadas por semana).`;
            jsonExtraKeys = `    "criterios_de_evaluacion": "(Criterios SER, SABER, HACER)",\n    "condicion": "(Detalle de la condición o necesidad específica)",\n    "adaptaciones": "(Detalle de las adaptaciones curriculares sugeridas)"`;
        } else {
            const estudiantesInputs = document.querySelectorAll('.estudiante-input');
            let estudiantesList = [];
            estudiantesInputs.forEach(input => {
                if (input.value.trim() !== "") {
                    estudiantesList.push(input.value.trim());
                }
            });

            if (estudiantesList.length === 0) {
                estudiantesList.push("No especificada");
            }

            let numEstudiantes = estudiantesList.length;
            if (numEstudiantes > 3) numEstudiantes = 3;
            templateFileName = `inicial_formateado_${numEstudiantes}.docx`;

            adaptacionPrompt = `9. ADAPTACIONES CURRICULARES SIGNIFICATIVAS:
Discapacidad/talento extraordinario/TDAH/TEA y otros\n`;

            jsonExtraKeys = `    "criterios_de_evaluacion": "(Generar criterios de evaluación que contemplen las condiciones de los estudiantes, integrando las adaptaciones requeridas organizados como SER, SABER, HACER)"`;

            estudiantesList.forEach((estudiante, index) => {
                if (index >= 3) return;
                let i = index + 1;
                adaptacionPrompt += `\nESTUDIANTE ${i}: ${estudiante}
INSTRUCCIONES PARA LA ADAPTACIÓN CURRICULAR SIGNIFICATIVA (ESTUDIANTE ${i}):
- Generar ÚNICAMENTE una lista de actividades de adaptación curricular significativa.
- Las actividades deben estar personalizadas para la condición o discapacidad del estudiante (${estudiante}).
- Considerar EXCLUSIVAMENTE los Campos y Áreas de Saberes y Conocimientos registrados por el usuario y sus respectivos contenidos.
- NO incluir tablas.
- NO incluir encabezados como CONTENIDO, ADAPTACIÓN o CRITERIOS DE EVALUACIÓN.
- NO incluir los Momentos del Proceso Formativo (ni Práctica, ni Teoría, ni Producción, ni Valoración).
- NO incluir Recursos.
- NO incluir Criterios de evaluación.
- Las actividades deben redactarse de forma clara y pedagógica, listas para insertarse directamente en el documento.\n`;

                jsonExtraKeys += `,\n    "condicion_${i}": "(Condición del estudiante ${i}: ${estudiante})",\n    "adaptaciones_condicion_${i}": "(Lista de actividades de adaptación curricular significativa para el estudiante ${i}, sin tablas, sin encabezados, ni momentos formativos, ni recursos)"`;
            });

            adaptacionPrompt += `\nREGLAS IMPORTANTES PARA LAS ADAPTACIONES SIGNIFICATIVAS:
- Es obligatorio considerar la condición específica del estudiante para diseñar actividades pertinentes, accesibles y contextualizadas a su ritmo de aprendizaje.
- Mantener un lenguaje claro, pedagógico e inclusivo.
- Generar el texto en formato de lista con viñetas, en texto plano LIMPIO. Sin estructuras de tabla.`;
        }

        const finalPrompt = `Actúa como experto pedagogo de Educación Inicial en el Sistema Educativo Plurinacional de Bolivia. Elabora el siguiente plan:
⚠️ REQUISITO OBLIGATORIO: NO GENERAR IMÁGENES. Entrega solo texto técnico.
⚠️ CORRECCIÓN ORTOGRÁFICA: Revisa y corrige automáticamente cualquier error de ortografía y gramática en la información (contenidos, datos referenciales, etc.) registrada por el usuario antes de generar la planificación.
⚠️Si el usuario no registró información en alguna semana, colocar un guion (-) en ese espacio correspondiente.

TÍTULO:
EDUCACIÓN INICIAL EN FAMILIA COMUNITARIA
PLAN DE DESARROLLO CURRICULAR Nº ${num}

1. DATOS REFERENCIALES:
- Distrito: ${datosReferenciales.distrito}
- Unidad Educativa: ${datosReferenciales.ue}
- Director/a: ${datosReferenciales.director}
- Maestra/o: ${datosReferenciales.maestro}
- Trimestre: ${datosReferenciales.trimestre}
- Año de Escolaridad: ${datosReferenciales.escolaridad}
- Duración: ${datosReferenciales.duracion}

2. OBJETIVO DE NIVEL (FIJO):
${objNivelFijo}

3. CAMPOS Y CONTENIDOS:
- Campo Cosmos y Pensamiento (Valores y espiritualidades): ${contenidos.cosmos}
- Campo Comunidad y Sociedad (Lenguaje, sociales, música, expresión plástica y psicomotricidad fina y gruesa): ${contenidos.comunidad}
- Campo Vida, Tierra y Territorio (Ciencias naturales): ${contenidos.vida}
- Campo Ciencia, Tecnología y Producción (Razonamiento lógico matemático): ${contenidos.ciencia}

4. PERFILES DE SALIDA POR SEMANA:
${perfilesSemanalesText}

5. MOMENTOS DEL PROCESO FORMATIVO:
Para cada una de las ${semanasConDatos} semanas registradas, desarrolla actividades adecuadas para niños de 4-5 años:
- INSTRUCCIÓN: (Práctica) Redactar 6 o 7 actividades por semana, concretas y prácticas, que el estudiante pueda realizar de manera directa.
Ejemplo: 
- Mediante una ronda infantil “Hola, hola, hola, ¿cómo estás…?”, invitamos a los niños a expresarse espontáneamente con saludos y movimientos.
- Cantamos y realizamos movimientos con la canción del saludo, acompañando con gestos corporales (manos, brazos, desplazamientos).
- Juegos simbólicos (Simón dice, rondas), expresión de necesidades, dinámicas de convivencia (Práctica).

- INSTRUCCIÓN: (Teoría) Redactar  6 o 7  actividades por semana que inicien con verbos inclusivos.
Ejemplo: 
- Aprendemos, mediante imágenes, a identificar acciones positivas y negativas que favorecen o dificultan una convivencia armónica.
- Reconocemos quiénes conforman nuestra propia familia mediante láminas, tarjetas o imágenes.
- Observamos imágenes, videos cortos de valores, conversatorios con preguntas sencillas (Teoría).


- INSTRUCCIÓN: (Producción) Redactar 6 o 7 actividades por semanaque inicien con verbos inclusivos.
Ejemplo: 
- Salimos a jugar y realizamos actividades compartidas, aplicando normas de cortesía y convivencia, utilizando el lenguaje como medio de comunicación.
- Cantamos canciones cortas, manualidades creativas, expresión de saludos (Producción).

- INSTRUCCIÓN: (Valoración)  El estudiante debe reflexionar sobre su propio proceso formativo mediante preguntas orientadoras como: ¿Qué aprendí? ¿Cómo aprendí? ¿Para qué aprendí?.
Ejemplo: 
- Uso de caritas emocionales, preguntas "¿Cómo me sentí?", autoexpresión libr (Valoración).

- Al finalizar la redacción de cada momento del proceso formativo, se debe colocar entre paréntesis el nombre del momento correspondiente; por ejemplo: (Práctica)(Teoría)(Producción) y (Valoración). Esta indicación debe ubicarse únicamente al final del texto y en ningún caso al inicio o en otra parte del párrafo.       
* Nota: Asegura que todos los contenidos registrados se distribuyan en las semanas sin repeticiones innecesarias.

6. RECURSOS:
- De acuerdo con el contenido desarrollado, se deben definir los recursos correspondientes para cada semana. (ej: láminas, juguetes, materiales del entorno, TIC, Bolsa o caja sorpresa para el juego “¿Quién adivina las palabras mágicas?”, Láminas o secuencias visuales de: Saludar, Despedirse, Pedir ayuda, Esperar turno). 


7. CRITERIOS DE EVALUACIÓN (Su redacción debe ser preciso y evaluable.). 4 criterios de evaluación para la dimensión del SER. 4 criterios de evaluación para el SABER. 4 criterios de evaluación para el HACER.
    - SER: Evaluar actitudes, igualdad, inclusión, dignidad, libertad, solidaridad, respeto,  responsabilidad  (ej: Colabora con sus compañeros en actividades grupales, respetando sus opiniones. ).
    - SABER: Evaluar conocimientos propios y adquiridos, reflexión crítica, análisis profundo,  relación con la realidad (ej: Conoce los números naturales hasta el 10000. - Describe características del entorno (formas, colores, tamaños, sonidos, texturas) utilizando lenguaje oral acorde a su edad.).
    - HACER: Evaluar habilidades, destrezas tecnológicas y científicas, experimentación,  investigación (ej: Representa cantidades con objetos de su entorno)

Al finalizar la redacción de cada momento del proceso formativo, se debe colocar entre paréntesis el nombre del momento correspondiente; por ejemplo: (Práctica)(Teoría)(Producción) y (Valoración). Esta indicación debe ubicarse únicamente al final del texto y en ningún caso al inicio o en otra parte del párrafo.       


  ⚠️ INSTRUCCIONES CRÍTICAS PARA LA GENERACIÓN DEL JSON (EVITAR DESBORDES Y DESORDEN DE FORMATO)
  
  1. PROHIBICIÓN DE TABLAS MARKDOWN: NUNCA intentes dibujar, estructurar o crear tablas visuales (ej. usando barras | o guiones ---). La plantilla de Word ya tiene todas las tablas dibujadas físicamente. Solo debes inyectar TEXTO PLANO LIMPIO en cada variable del formato JSON. Si incluyes tablas Markdown o asteriscos ** , destruirás el diseño del documento y el texto se saldrá de las celdas asignadas.
  2. ALINEACIÓN Y DESBORDES: No añadas saltos de línea innecesarios o espacios en blanco excesivos al principio ni al final de los textos. Mantén el contenido organizado por párrafos limpios.
  3. UBICACIÓN CORRECTA: Verifica rigurosamente que las actividades de la semana 1 vayan EXCLUSIVAMENTE en la variable JSON "momentos_formativos_semana_1", los recursos de la semana 1 en la variable "recursos_semana_1", etc. No superpongas ni mezcles informaciones. Las tablas de destino se alimentarán independientemente.
  4. EXCLUSIÓN DE TÍTULOS REPETITIVOS: Como el documento Word ya posee los encabezados en su propia tabla, EVITA introducir títulos literales como "PERFILES DE SALIDA:" o "RECURSOS:" dentro del contenido generado. Limítate a redactar el contenido solicitado para esa sección.
  5. Si no hay contenido para alguna semana, debes colocar obligatoriamente un solo guion "-" en dicho campo JSON.

🎯 INSTRUCCIÓN FINAL DE GENERACIÓN:
    El Plan de Desarrollo Curricular (PDC) debe estar COMPLETAMENTE desarrollado, utilizando texto muy estructurado.
    Asegura la ARTICULACIÓN efectiva de los CAMPOS Y SUS ÁREAS DE SABERES Y CONOCIMIENTOS, PERFILES DE SALIDA EN RELACIÓN CON LOS CAMPOS Y LAS ÁREAS de SABERES Y CONOCIMIENTOS, aMOMENTOS DEL PROCESO FORMATIVO, CRITERIOS DE EVALUACIÓN con enfoque HOLÍSTICO, CRÍTICO y COMUNITARIO.

${adaptacionPrompt}

ESTILO DE GENERACIÓN: Texto técnico pedagógico estructurado, coherente con el MESCP.
        
INSTRUCCIÓN PARA EXPORTAR A WORD:
Devuelve ÚNICAMENTE un objeto JSON válido. Las claves deben ser EXACTAMENTE las siguientes indicadas abajo. 
Los valores deben contener la información pedagógica generada siguiendo ESTRICTAMENTE estas reglas de estilo para evitar desórdenes en Word:
1. Usa el símbolo de viñeta ("•") para las listas, pero LOS ENCABEZADOS PRINCIPALES (como SER:, SABER:, HACER:, DECIDIR:, PRÁCTICA:, TEORÍA:, PRODUCCIÓN:, VALORACIÓN:) NUNCA deben llevar viñetas, guiones ni caracteres especiales antes de la palabra.
2. Agrega saltos de línea explícitos (\\n) al finalizar cada párrafo o viñeta. Usa dobles saltos de línea (\\n\\n) antes de los encabezados principales.
3. NO uses Markdown bajo ninguna circunstancia (están totalmente prohibidos los asteriscos sueltos o dobles para negritas: **HACER:**). Emite todo en TEXTO PLANO LIMPIO. Los encabezados deben plantearse simplemente como palabras en MAYÚSCULAS seguidas de dos puntos (ej. HACER:).
4. Manten la redacción concisa sin amontonar palabras.

{
    "campos_areas": "(Resumen de los campos y contenidos)",
    "perfil_de_salida_semana_1": "(Perfil de salida de la semana 1 - si no hay poner '-')",
    "perfil_de_salida_semana_2": "(Perfil de salida de la semana 2 - si no hay poner '-')",
    "perfil_de_salida_semana_3": "(Perfil de salida de la semana 3 - si no hay poner '-')",
    "perfil_de_salida_semana_4": "(Perfil de salida de la semana 4 - si no hay poner '-')",
    "momentos_formativos_semana_1": "(Actividades de práctica, teoría, producción y valoración de la semana 1)",
    "momentos_formativos_semana_2": "(Actividades de la semana 2 - si no hay poner '-')",
    "momentos_formativos_semana_3": "(Actividades de la semana 3 - si no hay poner '-')",
    "momentos_formativos_semana_4": "(Actividades de la semana 4 - si no hay poner '-')",
    "recursos_semana_1": "(Recursos de la semana 1 - si no hay poner '-')",
    "recursos_semana_2": "(Recursos de la semana 2 - si no hay poner '-')",
    "recursos_semana_3": "(Recursos de la semana 3 - si no hay poner '-')",
    "recursos_semana_4": "(Recursos de la semana 4 - si no hay poner '-')",
${jsonExtraKeys}
}`;

        setProgress(40, 'Generando contenido con Gem...');
        output.value += 'Generando contenido con Gem...\n';

        let response;
        try {
            // Llamar a la función Edge de Netlify (Edge Functions no tienen el límite estricto de timeout de lambda)
            response = await fetch('/api/generate-pdc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: finalPrompt })
            });

            if (response.status === 404 && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')) {
                throw new Error("El entorno local no detectó la función Serverless de Netlify. Para probar la rotación segura de API Keys (.env), DEBES ejecutar tu proyecto usando 'netlify dev' en la consola, no con Live Server estándar.");
            }

            if (!response.ok) {
                const errData = await response.text();
                throw new Error(`Error en el Servidor Backend (${response.status}): ` + errData);
            }

        } catch (error) {
            console.error("Fallo en la comunicación con el Backend de Netlify:", error.message);
            throw new Error(error.message);
        }

        const data = await response.json();
        let geminiText = "";

        if (Array.isArray(data)) {
            for (const chunk of data) {
                if (chunk.candidates && chunk.candidates.length > 0 && chunk.candidates[0].content && chunk.candidates[0].content.parts && chunk.candidates[0].content.parts.length > 0) {
                    geminiText += chunk.candidates[0].content.parts[0].text;
                }
            }
        } else if (data.candidates && data.candidates.length > 0) {
            geminiText = data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Formato de respuesta inesperado (" + JSON.stringify(data).substring(0, 100) + ")");
        }

        geminiText = geminiText.replace(/```json/g, "").replace(/```/g, "").trim();

        setProgress(70, 'Completando la plantilla Word...');
        output.value += 'Completando la plantilla Word...\n';

        const generatedData = JSON.parse(geminiText);

        // Incorporar variables de interfaz
        generatedData.numero_pdc = String(num).toUpperCase();
        generatedData.distrito_educativo = String(datosReferenciales.distrito || "-").toUpperCase();
        generatedData.director = String(datosReferenciales.director || "-").toUpperCase();
        generatedData.maestro = String(datosReferenciales.maestro || "-").toUpperCase();
        generatedData.trimestre = String(datosReferenciales.trimestre || "-").toUpperCase();
        generatedData.duracion = String(datosReferenciales.duracion || "-").toUpperCase();
        generatedData.unidad_educativa = String(datosReferenciales.ue || "-").toUpperCase();
        generatedData.año_de_escolaridad = String(datosReferenciales.escolaridad || "-").toUpperCase();
        generatedData.nivel = "INICIAL EN FAMILIA COMUNITARIA";

        setProgress(85, 'Aplicando formato al documento...');
        output.value += 'Aplicando formato al documento...\n';

        try {
            const templateResponse = await window.fetch(templateFileName);
            if (!templateResponse.ok) throw new Error(`No se pudo cargar la plantilla ${templateFileName}`);
            const content = await templateResponse.arrayBuffer();

            const zip = new window.PizZip(content);

            // Eliminar tabla "Significativas" dinámicamente si se seleccionó "Leves"
            const catAdapt = document.getElementById('categoriaAdaptacion').value;
            if (catAdapt === "curricular") {
                let xml = zip.file('word/document.xml').asText();

                // Borrar todo el contenedor de la tabla que guarda {{adaptaciones}} y el titulo si existe
                xml = xml.replace(/<w:tbl\b[^>]*>(?:(?!<\/w:tbl>).)*?{{adaptaciones}}.*?<\/w:tbl>/gs, '');

                // Eliminar cualquier tabla que contenga la palabra SIGNIFICATIVAS
                xml = xml.replace(/<w:tbl\b[^>]*>(?:(?!<\/w:tbl>).)*?SIGNIFICATIVAS.*?<\/w:tbl>/gs, '');

                // Buscar párrafos de titulo sueltos con la palabra SIGNIFICATIVAS
                xml = xml.replace(/<w:p\b[^>]*>(?:(?!<\/w:p>).)*?SIGNIFICATIVAS.*?<\/w:p>/gs, '');

                zip.file('word/document.xml', xml);
            }

            const doc = new window.docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                delimiters: { start: '{{', end: '}}' },
                nullGetter: function (part) {
                    if (!part.module) { return ""; }
                    if (part.module === "rawxml") { return ""; }
                    return "";
                }
            });

            doc.render(generatedData);

            // --- POST-PROCESAMIENTO PARA NEGRITAS ---
            let postZip = doc.getZip();
            let finalXml = postZip.file('word/document.xml').asText();

            // Buscar textos generados como SER:, SABER:, HACER: y envolverlos en etiquetas XML de negrita (<w:b/>).
            // La regex busca el inicio de un texto <w:t>, espacios opcionales, la palabra clave pura y opcionalmente espacios.
            finalXml = finalXml.replace(/(<w:t[^>]*>)((?:&nbsp;|\s)*)(SER:|SABER:|HACER:|DECIDIR:|PRÁCTICA:|TEORÍA:|PRODUCCIÓN:|VALORACIÓN:)((?:&nbsp;|\s)*)/g,
                '$1$2</w:t></w:r><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">$3</w:t></w:r><w:r><w:t xml:space="preserve">$4');

            postZip.file('word/document.xml', finalXml);
            // -----------------------------------------

            const out = postZip.generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            setProgress(95, 'Preparando archivo para descarga...');
            output.value += 'Preparando archivo para descarga...\n';

            // Guardar blob para el botón de descarga en lugar de auto-descarga
            documentoGeneradoBlob = out;
            documentoNombre = `PDC_INICIAL_${generatedData.numero_pdc}.docx`;

            setTimeout(() => {
                setProgress(100, 'PDC generado correctamente');
                output.value += 'Generación finalizada.\n';

                // Mover scroll al final del textarea
                if (output) output.scrollTop = output.scrollHeight;

                if (btnDescargar) btnDescargar.classList.remove('hidden');
                if (btn) { btn.innerHTML = originalBtnText; btn.disabled = false; }
            }, 600);
        } catch (renderError) {
            console.error(renderError);
            let errorMsg = renderError.message;
            if (renderError.properties && renderError.properties.errors) {
                errorMsg += " | Detalles: " + renderError.properties.errors.map(e => e.properties.id || e.properties.explanation || e.message).join(", ");
            }
            setProgress(0, 'Error en la plantilla');
            output.value += '\\nERROR DOCXTEMPLATER: ' + errorMsg + '\\n';
            if (btn) { btn.innerHTML = originalBtnText; btn.disabled = false; }
        }

    } catch (error) {
        console.error(error);
        setProgress(0, 'Error en el proceso');
        output.value += `\nERROR: ${error.message}\nRevise la configuración o intente nuevamente.`;
        if (btn) { btn.innerHTML = originalBtnText; btn.disabled = false; }
    }
}

function toggleAdaptacionUI() {
    const selector = document.getElementById('categoriaAdaptacion').value;
    const significativas = document.getElementById('estudiantesSignificativasContainer');
    const leves = document.getElementById('estudiantesLevesContainer');

    if (selector === 'significativa') {
        significativas.classList.remove('hidden');
        leves.classList.add('hidden');
    } else {
        significativas.classList.add('hidden');
        leves.classList.remove('hidden');
    }
}

function agregarEstudiante() {
    const lista = document.getElementById('listaEstudiantes');
    const div = document.createElement('div');
    div.className = "flex items-center gap-3 estudiante-item animate-in fade-in slide-in-from-top-2 duration-300 group";
    div.innerHTML = `
        <input type="text" class="input-style flex-grow estudiante-input !bg-white transition-colors hover:border-emerald-300 focus:!border-emerald-400 focus:!ring-emerald-400/20" placeholder="Ej: Estudiante: Tipo de Dificultad">
        <button type="button" class="w-12 h-12 bg-white text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all shrink-0 flex items-center justify-center border border-slate-200 hover:border-red-200 shadow-sm" onclick="eliminarEstudiante(this)" title="Eliminar estudiante">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    `;
    lista.appendChild(div);
}

function eliminarEstudiante(btn) {
    const item = btn.closest('.estudiante-item');
    if (document.querySelectorAll('.estudiante-item').length > 1) {
        item.remove();
    } else {
        // Clear input instead of removing if it's the last one
        item.querySelector('input').value = "";
        item.querySelector('input').focus();
    }
}

// --- MECANISMOS DE PROTECCIÓN DEL CÓDIGO FUENTE ---

// 1. Deshabilitar el menú contextual (clic derecho) excepto en campos rellenables
document.addEventListener('contextmenu', function (e) {
    // Permite usar clic derecho para Pegar, Cortar, Copiar en campos de texto
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return true;
    }
    e.preventDefault();
});

// 2. Deshabilitar atajos de teclado comunes para herramientas de desarrollador
document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+I (Inspeccionar)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+J (Consola)
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+C (Inspeccionar elemento)
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
        e.preventDefault();
        return false;
    }

    // Ctrl+U (Ver código fuente)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
        return false;
    }

    // Ctrl+S (Guardar página)
    if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
        e.preventDefault();
        return false;
    }
});

// 3. Ocultar los mensajes y la funcionalidad de la consola
const noop = () => { };
['log', 'debug', 'info', 'warn', 'dir', 'dirxml', 'trace', 'profile'].forEach(method => {
    console[method] = noop;
});

// 4. Bucle antidot (Anti-DevTools)
// Si logran abrir las herramientas de desarrollador, este bucle pausará constantemente la ejecución
setInterval(function () {
    const before = new Date().getTime();
    debugger;
    const after = new Date().getTime();
    if (after - before > 100) {
        // Las DevTools probablemente estén abiertas.
        // Podrías redirigir al usuario o limpiar la pantalla, pero pausarlos con debugger
        // ya hace que sea muy difícil interactuar con la consola.
    }
}, 1000);