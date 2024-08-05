let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funcion para agregar elementos al carrito

function agregarAlCarrito(productId, nombre, precio) {
  const cantidad = parseInt(document.getElementById(`cantidad${productId}`).value);
  const productoExistente = cart.find(item => item.id === productId);

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    cart.push({ id: productId, nombre, precio, cantidad });
  }

  guardarCarrito();          
  actualizarConteoCarrito(); 
  mostrarModalCarrito(nombre); 
}

// Funcion para la cantidad de elementos en el carrito

function actualizarCantidad(productId, cantidad) {
  const productoExistente = cart.find(item => item.id === productId);
  if (productoExistente) {
    productoExistente.cantidad = parseInt(cantidad);
    guardarCarrito();
    actualizarConteoCarrito();
    renderCarrito();
  }
}

// Funcion para limpiar el carrito

function limpiarCarrito() {
  cart = [];
  guardarCarrito();
  actualizarConteoCarrito();
  renderCarrito();
}

// Funcion de proceso de compra

function procesarCompra() {
  const customerName = document.getElementById('customerName').value;
  if (!customerName) {
    alert('Por favor, ingrese el nombre del cliente.');
    return;
  }

  window.location.href = `/compra-exitosa?nombre=${encodeURIComponent(customerName)}`;

  limpiarCarrito(); 
}

// Funcion para eliminar un elemento del carrito

function eliminarDelCarrito(productId) {
  cart = cart.filter(item => item.id !== productId);
  guardarCarrito();
  actualizarConteoCarrito();
  renderCarrito();
}

// Acá yo guardo mi carrito ma' jevi en el localstorage

function guardarCarrito() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Mi función ni ma' jevi para el conteo del carrito en el header (el badge ese).

function actualizarConteoCarrito() {
  const totalCantidad = cart.reduce((total, item) => total + item.cantidad, 0);
  document.getElementById("cart-count").textContent = totalCantidad;
}

// Renderización de mi carrito

function renderCarrito() {
  let cartHtml = '';
  const carritoContainer = document.getElementById('carritoContainer');

  if (cart.length > 0) {
    cartHtml += '<table class="table table-striped">';
    cartHtml += '<thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th><th>Acción</th></tr></thead><tbody>';
    cart.forEach(item => {
      cartHtml += `<tr>
          <td>${item.nombre}</td>
          <td><input type="number" class="form-control" value="${item.cantidad}" min="1" onchange="actualizarCantidad(${item.id}, this.value)"></td>
          <td>RD$${item.precio.toFixed(2)}</td>
          <td>RD$${(item.precio * item.cantidad).toFixed(2)}</td>
          <td><button class="btn btn-danger" onclick="eliminarDelCarrito(${item.id})">Eliminar</button></td>
        </tr>`;
    });
    cartHtml += '</tbody><tfoot><tr><td colspan="3" class="text-end fw-bold">Total:</td><td class="fw-bold">RD$' + calculateTotal(cart).toFixed(2) + '</td><td></td></tr></tfoot>';
    cartHtml += '</table>';

    cartHtml += `<div class="d-flex justify-content-between mt-4">
      <button class="btn btn-secondary" onclick="limpiarCarrito()">Limpiar Carrito</button>
      <button class="btn btn-primary" onclick="procesarCompra()">Procesar Compra</button>
    </div>`;
  } else {
    cartHtml = '<p>Tu carrito está vacío.</p>';
  }

  carritoContainer.innerHTML = cartHtml;
}

// Funcion que calcula el total en mi carrito

function calculateTotal(cart) {
  return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Muestra el modal ese de carritoModal.handlebars

function mostrarModalCarrito(nombre) {
  const modalBody = document.getElementById('cartModalBody');
  modalBody.innerHTML = `<p>Has agregado <strong>${nombre}</strong> a tu carrito.</p>`;
  const modal = new bootstrap.Modal(document.getElementById('cartModal'));
  modal.show();
}

// JS para DOM, señores. Shoutout to mi gente de freeCodeCamp.

document.addEventListener("DOMContentLoaded", () => {
  actualizarConteoCarrito();
  renderCarrito();
});