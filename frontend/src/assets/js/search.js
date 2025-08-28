import { endpointSearch } from "./main";

function buscar() {
    const query = document.getElementById('searchInput').value;  // Tomar el valor del input
    if (!query) {
        alert('Por favor ingrese algo para buscar.');
        return;
    }

    const endpoint = `${endpointSearch}${encodeURIComponent(query)}`; // Construir URL con el query

    // Hacer el GET request
    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la búsqueda');
            }
            return response.json();  // Parsear respuesta JSON
        })
        .then(data => {
            mostrarResultados(data);  // Mostrar resultados
        })
        .catch(error => {
            console.error('Hubo un problema con la petición:', error);
        });
}

function mostrarResultados(data) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';  // Limpiar resultados previos

    // Verificar que data sea un array y que tenga elementos
    if (!Array.isArray(data) || data.length === 0) {
        resultadosDiv.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    // Crear una lista de resultados
    const lista = document.createElement('ul');
    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.nombre || 'Sin nombre';  // Asumiendo que cada objeto tiene una propiedad 'nombre'
        lista.appendChild(li);
    });

    resultadosDiv.appendChild(lista);
}
