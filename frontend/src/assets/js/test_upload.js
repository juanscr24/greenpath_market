document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('productForm');
    const responseDiv = document.getElementById('response');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Mostrar indicador de carga
        responseDiv.innerHTML = '<p>Enviando datos...</p>';
        
        const formData = new FormData(this);

        try {
            const response = await fetch('http://localhost:8000/products/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                // Éxito - mostrar datos del producto creado
                responseDiv.innerHTML = `
                    <h3>✅ Producto registrado exitosamente</h3>
                    <p><strong>ID:</strong> ${data.id_product}</p>
                    <p><strong>Nombre:</strong> ${data.name_product}</p>
                    <p><strong>Precio:</strong> $${data.price}</p>
                    <p><strong>Stock:</strong> ${data.stock}</p>
                    <p><strong>Imagen:</strong> <a href="${data.image_url}" target="_blank">Ver imagen</a></p>
                    <p><strong>Creado:</strong> ${new Date(data.created_at).toLocaleString()}</p>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            } else {
                // Error del servidor
                responseDiv.innerHTML = `
                    <h3>❌ Error del servidor</h3>
                    <p><strong>Código:</strong> ${response.status}</p>
                    <p><strong>Mensaje:</strong> ${data.detail || 'Error desconocido'}</p>
                `;
            }
        } catch (error) {
            // Error de conexión
            responseDiv.innerHTML = `
                <h3>❌ Error de conexión</h3>
                <p><strong>Mensaje:</strong> ${error.message}</p>
                <p>Verifique que el servidor esté ejecutándose en http://localhost:8000</p>
            `;
        }
    });

    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.style.borderColor = '#ddd';
        });
    });
});
