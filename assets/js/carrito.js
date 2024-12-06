document.addEventListener('DOMContentLoaded', () => { 
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Portatil ASUS',
            precio: 2500000,
            imagen: 'assets/img/productos/Img-1-pc.jpg',
            categoria: 'portatil'
        },
        {
            id: 2,
            nombre: 'Tv JVC',
            precio: 1500000,
            imagen: 'assets/img/productos/img-5-tv.jpg',
            categoria: 'tv'
        },
        {
            id: 3,
            nombre: 'Tarjeta Geforce RTX 4060',
            precio: 1200000,
            imagen: 'assets/img/productos/img-10.jpg',
            categoria: 'tarjeta grafica'
        },
        {
            id: 4,
            nombre: 'Teclado Genius',
            precio: 80000,
            imagen: 'assets/img/productos/img-9.jpg',
            categoria: 'teclado'
        },
        {
            id: 5,
            nombre: 'Consola Play stations',
            precio: 2000000,
            imagen: 'assets/img/productos/img-7-consola.jpg',
            categoria: 'consolas'
        },
        {
            id: 6,
            nombre: 'Pantalla Accer',
            precio: 750000,
            imagen: 'assets/img/productos/img-12.jpg',
            categoria: 'pantalla'
        }
    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;
    const filtroSelect = document.getElementById("filtro");

    function renderizarProductos() {
        DOMitems.innerHTML = "";
        const filtro = filtroSelect.value;
        const productosFiltrados = baseDeDatos.filter(producto => 
            filtro === "todas" || producto.categoria === filtro
        );

        productosFiltrados.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('col-md-4', 'mb-4');
            
            miNodo.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${info.imagen}" class="card-img-top" alt="${info.nombre}" style="height: 200px; object-fit: cover;">
                    <div class="card-body text-center">
                        <h5 class="card-title">${info.nombre}</h5>
                        <p class="card-text">${divisa}${info.precio.toLocaleString()}</p>
                        <button class="btn btn-primary" marcador="${info.id}">Agregar</button>
                    </div>
                </div>
            `;
            
            miNodo.querySelector('button').addEventListener('click', anadirProductoAlCarrito);
            DOMitems.appendChild(miNodo);
        });
    }

    function anadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'));
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
    }

    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio.toLocaleString()}`;
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal().toLocaleString();
    }

    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
    }

    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0);
    }

    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
    }

    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    filtroSelect.addEventListener('change', renderizarProductos);

    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});