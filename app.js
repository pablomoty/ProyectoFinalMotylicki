let carrito = [] // Array que almacena los productos seleccionados en el carrito
let data = [] // Array que almacena los datos de los productos

document.addEventListener('DOMContentLoaded', async () => {
    await llamarDatoProductos()
    carrito = JSON.parse(localStorage.getItem("carrito")) || [] // Obtiene el carrito almacenado en el local storage o un array vacío si no hay ningún carrito guardado
    mostrarCarrito()
    mostrarProductos()
    agregarEventListeners() 
    actualizarBotonCarrito()
});


// Función asincrónica para obtener los datos de los productos

async function llamarDatoProductos() {
    data = await fetch("productos.json") 
        .then((response) => {
            if (response.ok) {
                return response.json(); 
            } else {
                throw new Error('Error: ' + response.statusText) 
            }
        }).catch((error) => {
            console.log('error: ' + error) 
        })
}


// Muestra los productos disponibles

function mostrarProductos() {
    const divProductos = document.querySelector('.div-productos')
    divProductos.innerHTML = '';

    data.forEach((dato) => {
        divProductos.innerHTML += `
            <article class="col-xl-2 col-lg-4 col-md-4 col-sm-6 mb-2">
                <div class="card h-100">
                    <img src="${dato.imagen}" class="card-img-top opacidad">
                    <div class="card-body">
                        <p class="card-title">${dato.titulo}</p>
                        <p class="card-text text-dark fs-4 fuenteAlternativa">$${dato.precio}</p>
                        <button href="#" class="btn btn-success w-100 boton-compra" data-id="${dato.id}">Comprar</button>
                    </div>
                </div>
            </article>
        `;
    })
}


// Agrega los event listeners a los elementos relevantes

function agregarEventListeners() {
    const botonesCompra = document.querySelectorAll('.boton-compra')

    botonesCompra.forEach((boton) => {
        boton.addEventListener('click', agregarAlCarrito) 
    });

    const divCarrito = document.querySelector('.modal-body')

    divCarrito.addEventListener('click', (boton) => {
        if (boton.target.classList.contains('boton-eliminar-producto')) {
            const idProducto = parseInt(boton.target.dataset.id)
            carrito = carrito.filter((producto) => producto.id !== idProducto) 
            mostrarCarrito() 
        }
    });

    const vaciar = document.querySelector(".vaciar-carrito")

    vaciar.addEventListener('click', () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Eliminarás tu carrito de compras definitivamente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#187053',
            confirmButtonText: "Vaciar",
            cancelButtonText: "Cancelar"
        }).then((resultado) => {
            if (resultado.isConfirmed) {
                carrito = [] 
                mostrarCarrito() 
                Swal.fire(
                    "Carrito vaciado",
                    "Se ha vaciado el carrito correctamente",
                    "success"
                );
            }
        })
    })

    const finalizarCompra = document.querySelector(".finalizar-compra")

    finalizarCompra.addEventListener('click', () => {
        if (carrito.length === 0) {
            Swal.fire({
                title: "Carrito vacío",
                text: "No puedes realizar la compra porque tu carrito está vacío.",
                icon: "error",
                confirmButtonColor: '#187053',
                confirmButtonText: "Aceptar"
            })
        } else {
            Swal.fire({
                title: "Compra realizada!",
                text: "Tu compra ha sido realizada!",
                icon: "success",
                confirmButtonColor: '#187053',
                confirmButtonText: "Aceptar"
            }).then((resultado) => {
                if (resultado.isConfirmed) {
                    carrito = [] 
                    mostrarCarrito()
                }
            })
        }
    })
}

//Transfiere los productos seleccionados al carrito

function agregarAlCarrito(evento) {
    const id = parseInt(evento.target.dataset.id)
    const producto = data.find((dato) => dato.id === id)
    const productoExistente = carrito.find((producto) => producto.id === id)

    if (productoExistente) {
        productoExistente.cantidad++; 
    } else {
        producto.cantidad = 1; 
        carrito.push(producto) 
    }

    Toastify({
        text: "Producto Agregado!",
        position: "left",
        duration: 3000,
        className: "success"
    }).showToast()

    mostrarCarrito() 
}


// Muestra los productos en el carrito

function mostrarCarrito() {
    const modalBody = document.querySelector(".modal .modal-body")
    const totalHtml = document.querySelector(".precio-total")

    if (modalBody) {
        modalBody.innerHTML = "";

        carrito.forEach((dato) => {
            const subtotal = dato.precio * dato.cantidad
            const subtotalHtml = dato.cantidad > 1 ? `<p class="card-text text-dark fs-4 fuenteAlternativa">Subtotal: $${subtotal}</p>` : ""

            modalBody.innerHTML += `
                <div class="modal-contenedor">
                    <div>
                        <img class="img-fluid img-carrito" src="${dato.imagen}"/>
                    </div>
                    <div>
                        <p class="card-title">${dato.titulo}</p>
                        <p class="card-text text-dark fs-4 fuenteAlternativa">$${dato.precio}</p>
                        <p class="card-text text-dark fs-4 fuenteAlternativa">Cantidad: ${dato.cantidad}</p>
                        ${subtotalHtml} 
                        <button class="btn btn-danger boton-eliminar-producto" data-id="${dato.id}">Eliminar producto</button>
                    </div>
                </div>
            `;
        })
    }

    if (carrito.length === 0) {
        modalBody.innerHTML = `
            <p class="text-center text-dark">Tu carrito está vacío!</p>
        `;
        totalHtml.innerHTML = "";
    } else {
        const total = carrito.reduce((acumulador, producto) => acumulador + (producto.precio * producto.cantidad), 0)
        totalHtml.innerHTML = `
            <p class=" text-center text-dark">Precio total:&nbsp</p>
            <p class="text-center text-dark fuenteAlternativa">$${total}</p>
        `;
    }

    actualizarBotonCarrito()
    guardarCarrito() 
}


// Actualiza la apariencia del botón del carrito

function actualizarBotonCarrito() {
    const botonCarrito = document.querySelector('.boton-carr')
    const iconoCarrito = document.querySelector('.iconito')

    if (carrito.length > 0) {
        botonCarrito.classList.add('con-productos')
        iconoCarrito.classList.add('con-productos')
    } else {
        botonCarrito.classList.remove('con-productos')
        iconoCarrito.classList.remove('con-productos')
    }
}

// Guarda el carrito en el almacenamiento local
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito))}
