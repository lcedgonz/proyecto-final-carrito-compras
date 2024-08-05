document.addEventListener("DOMContentLoaded", () => {
  const editButtons = document.querySelectorAll(".edit-product");
  const modal = document.getElementById("productModal");
  const form = document.getElementById("productForm");

  editButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.id;
      try {
        const response = await fetch(`/admin/api/productos/${productId}`);
        if (response.ok) {
          const product = await response.json();
          

          document.getElementById("productId").value = product.id;
          document.getElementById("nombre").value = product.nombre;
          document.getElementById("precio").value = product.precio;
          document.getElementById("cantidad").value = product.cantidad;
          document.getElementById("descripcion").value = product.descripcion;
          

          document.getElementById("productModalLabel").innerText = "Editar Producto";


          form.action = `/admin/productos/${product.id}/edit`;


          $(modal).modal("show");
        } else {
          alert("Error fetching product data");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    });
  });


  document.querySelector('[data-target="#productModal"]').addEventListener("click", () => {
    form.reset();
    form.action = "/admin/productos";
    document.getElementById("productModalLabel").innerText = "Crear Producto";
  });
});
