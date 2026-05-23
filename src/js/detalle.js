document.addEventListener("DOMContentLoaded", () => {
    // 1. Leer el ID de la URL
    const parametrosURL = new URLSearchParams(window.location.search);
    const idProyecto = parametrosURL.get("id");

    if (!idProyecto) {
        document.getElementById("proyecto-titulo").innerText = "Proyecto no encontrado";
        return;
    }

    // 2. Traer datos del JSON (Ajusta la ruta a tu JSON real)
    fetch("src/data/proyectos.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            const proyecto = datos.find(p => p.id === idProyecto);

            if (proyecto) {
                // Inyectar Título
                document.getElementById("proyecto-titulo").innerText = proyecto.titulo;

                // --- LÓGICA DEL CARRUSEL ADAPTATIVO ---
                const carouselInner = document.getElementById("carousel-imagenes");
                const carouselIndicadores = document.getElementById("carousel-indicadores");
                const btnPrev = document.getElementById("btn-prev");
                const btnNext = document.getElementById("btn-next");

                // Verificar si existe el arreglo 'imagenes' y no está vacío
                if (proyecto.imagenes && proyecto.imagenes.length > 0) {

                    // Recorrer el arreglo de imágenes
                    proyecto.imagenes.forEach((rutaImagen, index) => {
                        const claseActiva = index === 0 ? "active" : ""; // La primera imagen debe ser activa

                        // Crear indicador
                        carouselIndicadores.innerHTML += `
                            <button type="button" data-bs-target="#carouselProyecto" data-bs-slide-to="${index}" class="${claseActiva}" aria-label="Slide ${index + 1}"></button>
                        `;

                        // Crear la imagen
                        carouselInner.innerHTML += `
                            <div class="carousel-item h-100 ${claseActiva}">
                                <img src="${rutaImagen}" class="d-block w-100 h-100" style="object-fit: cover; object-position: top center;" alt="Captura del proyecto">
                            </div>
                        `;
                    });

                    // MAGIA ADAPTATIVA: ¿Ocultar flechas si solo hay 1 imagen?
                    if (proyecto.imagenes.length === 1) {
                        btnPrev.style.display = "none";
                        btnNext.style.display = "none";
                        carouselIndicadores.style.display = "none";
                    }

                } else {
                    // Si el arreglo está vacío o no existe, escondemos toda la caja
                    document.getElementById("carouselProyecto").style.display = "none";
                }
                // --- FIN LÓGICA CARRUSEL ---

                // Inyectar Tecnologías
                const divTecnologias = document.getElementById("proyecto-tecnologias");
                const arrayTecnologias = proyecto.tecnologias.split(',');
                arrayTecnologias.forEach(tech => {
                    const span = document.createElement('span');
                    span.className = 'service-tag';
                    span.innerText = tech.trim();
                    divTecnologias.appendChild(span);
                });

                // Inyectar Descripción
                document.getElementById("proyecto-descripcion").innerText = proyecto.descripcion;

                // --- CONFIGURACIÓN DE BOTONES ---
                const linkElement = document.getElementById("proyecto-link");
                const btnGithub = document.getElementById("proyecto-github");

                // 1. APAGAR AMBOS BOTONES (LA SOLUCIÓN AL BUG)
                // Usamos "d-none" de Bootstrap para ocultarlos y eliminamos cualquier rastro de "d-inline-flex"
                linkElement.className = "d-none";
                btnGithub.className = "d-none";
                // Limpiamos los estilos en línea por si acaso
                linkElement.removeAttribute("style");
                btnGithub.removeAttribute("style");

                // 2. Configurar Botón Principal (Sitio Web)
                if (proyecto.link) {
                    if (proyecto.link.trim() !== "#") {
                        // Tiene enlace web
                        linkElement.href = proyecto.link.trim();
                        linkElement.className = "btn-proyect ms-2 rounded-pill btn-sm d-inline-flex align-items-center gap-2 px-4 py-2 text-decoration-none fw-medium";
                        linkElement.innerHTML = `Ver <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>`;
                    } else {
                        // Enlace web Offline
                        linkElement.removeAttribute("href");
                        linkElement.className = "btn-proyect ms-2 rounded-pill btn-sm d-inline-flex align-items-center gap-2 px-4 py-2 text-decoration-none fw-medium";
                        linkElement.style.cursor = "not-allowed";
                        linkElement.innerHTML = `Proyecto Offline <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"></path></svg>`;
                    }
                }

                // 3. Configurar Botón GitHub
                if (proyecto.hasOwnProperty("github") && proyecto.github !== null && proyecto.github.trim() !== "") {
                    if (proyecto.github.trim() === "#") {
                        // GitHub Privado
                        btnGithub.removeAttribute("href");
                        btnGithub.className = "btn btn-secondary rounded-pill btn-sm d-inline-flex align-items-center gap-2 px-4 py-2 text-decoration-none fw-medium";
                        btnGithub.style.cursor = "not-allowed";
                        btnGithub.innerHTML = `Código Privado <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`;
                    } else {
                        // GitHub Público
                        btnGithub.href = proyecto.github.trim();
                        btnGithub.className = "btn-proyect rounded-pill btn-sm d-inline-flex align-items-center gap-2 px-4 py-2 text-decoration-none fw-medium";
                        btnGithub.style.cursor = "pointer";
                        btnGithub.innerHTML = `Ver en GitHub <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`;
                    }
                }


            } else {
                window.location.href = "/404.html";
                document.getElementById("proyecto-titulo").innerText = "Proyecto no encontrado";
                document.getElementById("carouselProyecto").style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error al cargar los proyectos:", error);
            document.getElementById("proyecto-titulo").innerText = "Error al cargar la información";
            document.getElementById("carouselProyecto").style.display = "none";
        });
});
