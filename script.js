let carrito = [];
let total = 0;
const DomItems = document.getElementById('items');
const DomCarrito = document.getElementById('carrito');
const DomTotal = document.getElementById('total');
const DomBotonVaciar = document.getElementById('boton-vaciar');
const miLocalStorage = window.localStorage;

let nuevasCards = "";
function renderizarProductos(filtro = "default") {
  let nuevasCards =
  filtro !== "default" ?
  cuadroProductos.filter(
    (cuadroProductos) => cuadroProductos.tipo == filtro
  ) : 
  cuadroProductos;

  DomItems.textContent = "";

  nuevasCards.forEach((info) => {
      const div = document.createElement('div');
      div.classList.add('card', 'col-sm-4');
      
      //Body
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      div.appendChild(cardBody);
      
      //Título
      const title = document.createElement('h2');
      title.classList.add('card-title');
      title.textContent = info.nombre;
      cardBody.appendChild(title);
      
      //Productos (cuadros)
      const imagen = document.createElement('img');
      imagen.classList.add('img-thumbnail');
      imagen.setAttribute('src', info.imagen);
      cardBody.appendChild(imagen);
      
      //Precio
      const precio = document.createElement('p');
      precio.classList.add('card-text');
      precio.textContent = '$' + info.precio;
      cardBody.appendChild(precio);

      //Precio dolar
    const precioDolar = document.createElement("p");
    precioDolar.classList.add("card-text");
    precioDolar.textContent = 'USD ' + (info.precio / dolarHoy).toFixed(2);
    cardBody.appendChild(precioDolar);
      
      const boton = document.createElement('button');
      boton.classList.add('btn', 'btn-primary');
      boton.textContent = 'Comprar';
      boton.setAttribute('marcador', info.id);
      boton.addEventListener('click', agregarProductoAlCarrito);
      cardBody.appendChild(boton);
         
          
      DomItems.appendChild(div);
  });
}



function agregarProductoAlCarrito(evento) {
    carrito.push(evento.target.getAttribute('marcador'))
  
    calcularTotal();  
    renderizarCarrito();
    guardarCarritoEnLocalStorage();

}


function renderizarCarrito() {
  
  DomCarrito.textContent = '';  
  const carritoSinDuplicados = [...new Set(carrito)];  
  carritoSinDuplicados.forEach((item) => {      
      const miItem = cuadroProductos.filter((itemBaseDatos) => {          
          return itemBaseDatos.id === parseInt(item);
      });     
      const numeroUnidadesItem = carrito.reduce((total, itemId) => {          
          return itemId === item ? total += 1 : total;
      }, 0);
      
      const divCarrito = document.createElement('li');
      divCarrito.classList.add('list-group-item', 'text-right', 'mx-2');
      divCarrito.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - $${miItem[0].precio}`;

      // Boton de borrar
      const botonBorrar = document.createElement('button');
      botonBorrar.classList.add('btn', 'btn-danger', 'mx-4');
      botonBorrar.textContent = 'Eliminar';
      botonBorrar.dataset.item = item;
      botonBorrar.addEventListener('click', borrarItemCarrito);
      
      divCarrito.appendChild(botonBorrar);
      DomCarrito.appendChild(divCarrito);
  });
}


function borrarItemCarrito(evento) {
    const id = evento.target.dataset.item;  
    carrito = carrito.filter((carritoId) => {
      return carritoId !== id;
  });
  
  renderizarCarrito();  
  calcularTotal();
  guardarCarritoEnLocalStorage();
}


function calcularTotal() {
  
  total = 0;  
  carrito.forEach((item) => {
      
      const miItem = cuadroProductos.filter((itemBaseDatos) => {
          return itemBaseDatos.id === parseInt(item);
      });
      total = total + miItem[0].precio;
  });
  
  DomTotal.textContent = "$" + total;
}


function vaciarCarrito() {  
  carrito = [];  
  renderizarCarrito();
  calcularTotal();
  localStorage.clear();
}

function guardarCarritoEnLocalStorage () {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage () {
    if (miLocalStorage.getItem('carrito') !== null) {
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

DomBotonVaciar.addEventListener('click', vaciarCarrito);

// Creación array clientes
const listaClientes = [];

class Cliente {
  constructor(nombre, apellido, mail, pago) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.mail = mail;
    this.pago = pago;
  }
}
//Variables para el input del formulario
let inputName = $("#inputName").val();
let imputLastName = $("#inputLastName").val();
let inputEmail = $("#inputLastName").val();
let inputPaymentMethod = $("#inputPaymentMethod").val();

let form = $("#buttonForm").on("click", function (e) {


  inputName = $("#inputName").val();
  imputLastName = $("#inputLastName").val();
  inputEmail = $("#inputEmail").val();
  inputPaymentMethod = $("#inputPaymentMethod").val();



  listaClientes.push(
    new Cliente(inputName, imputLastName, inputEmail, inputPaymentMethod)
  );
  addProduct();

  $(".btn-close").on("click", vaciarCarrito);
  return listaClientes;
});

//Función Modal carrito
function carritoModal(e) {
    if (carrito.length == 0) {
      $("#ModalError").modal("show");
    } else if (carrito.length != 0) {
      $("#staticBackdrop").modal("show");
    }
  }
  $("#btn-comprar").on("click", carritoModal);

  

// Interactuar con API para obtener el valor del dolar hoy en NAVBAR. En las cards arroja Precio en dolares.

const urlApi =
  "https://openexchangerates.org/api/latest.json?app_id=e82d0e43d7a545ba923feba46e1ec1d8";


function traerDolar() {
  $.get(urlApi, function (respuesta, estado) {
    if (estado === "success") {
      valorDolar = respuesta;
      $("#cotizacion").append(`<div>
                           <p>Dólar hoy: ${valorDolar.rates.ARS}</p>
                          </div>`);
    }

    let dolarHoy = valorDolar.rates.ARS;

    localStorage.setItem("miDolar", JSON.stringify(dolarHoy));
  });
}
let dolarHoy = JSON.parse(localStorage.getItem("miDolar"));
traerDolar();


// Función modal error
function carritoModal(e) {
  if (carrito.length == 0) {
    $("#ModalError").modal("show");
  } else if (carrito.length != 0) {
    $("#staticBackdrop").modal("show");
  }
}
$("#btn-comprar").on("click", carritoModal);


//función para formulario
function addProduct() {
  event.preventDefault();
  if (
    inputName == "" ||
    imputLastName == "" ||
    inputEmail == "" ||
    inputPaymentMethod == ""
  ) {
    //si esta vacio sale y muestra un alert
    alert("Por favor completa los campos vacios");
    return false;
  }
  //Validamos que nombre no este vacio
  if (inputName == "") {
    //si esta vacio sale y muestra un alert
    alert("Por favor completa tu nombre");
    return false;
  }

  if (imputLastName == "") {
    //si esta vacio sale y muestra un alert
    alert("Por favor completa tu apellido");
    return false;
  }

  if (inputEmail == "") {
    //si esta vacio sale y muestra un alert
    alert("Por favor completa tu mail");
    return false;
  }

  if (inputPaymentMethod == "") {
    //si esta vacio sale y muestra un alert
    alert("Por favor completa tu metodo de pago");
    return false;
  }

  // Si el formulario se completa correctamente, ocultar form y botón "Seguir comprando", agregar confirmación de compra
  $("#form").fadeOut(1000);
  $("#boton-seguir").hide();
  $("#confirmacionDatos").append(`
    <div>
    <p>${inputName} ${imputLastName} Muchas gracias por tu compra!</p>
    <p>Vas a estar recibiendo un mail en: ${inputEmail} para coordinar el envío</p>
    <p>Método de pago elegido: ${inputPaymentMethod}</p>
    </div>
    `);
}


renderizarProductos();
cargarCarritoDeLocalStorage();
calcularTotal();
renderizarCarrito();