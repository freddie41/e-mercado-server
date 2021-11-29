//Importación del modulo ExpressJS.
const express = require('express');

//Llama al objeto importado del framework ExpressJS para crear la aplicación.
const app = express();

//Determina el puerto local para la escucha de peticiones HTTP.
const port = 3000;

//FileSystem para crear y modificar archivos.
const fs = require('fs');

//Middleware para recibir y almacenar objetos con solicitudes POST.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Control de CORS para servir los archivos desde todas las ubicaciones.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

//Sirve todo el front-end desde el directorio static.
app.use(express.static(__dirname + "/static"));

//Sirve dinamicamente cada archivo en el directorio con los json.
app.get("/json/:id", function (req, res) {
  res.sendFile(__dirname + `/json/${req.params.id}.json`)
});

//Recibe datos de nuevo comentario de un producto.
app.post("/new-comment", function (req, res) {

    //Crea un texto con todos los datos del comentario.
    let newCommentString = `
    Usuario: ${req.body.user}.
    Descripción: ${req.body.description}.
    Fecha: ${req.body.dateTime}.
    Calificación: ${req.body.score}.
    `;

    //Guarda datos de comentario como archivo
    //formato txt en repositorio local.
    fs.appendFile("comments/new-comment.txt", newCommentString, function (err) {
        if (err) {
            console.log(err);
            res.send(
                {msj: "Ha ocurrido un error."}
            );
        } else {
            console.log("Archivo de comentario guardado");
            res.send(
                {msj: "El comentario ha sido guardado."}
            );
        }
    });
});

//Recibe datos de nueva orden.
app.post("/new-order", function (req, res) {
    
    //Guarda el array de productos del carrito.
    let cartProducts = JSON.parse(req.body.products);
    let products = "";
    let productHTML = "";

    //Muestra la info de los productos del carrito.
    for (let i = 0; i < cartProducts.length; i++) {
        const product = cartProducts[i];

        productHTML += `
        *****************************************

        Nombre: ${product.name}
        Cantidad: ${product.count}
        Costo unitario: USD ${product.unitCost}

        *****************************************
        `
        products = productHTML;
    }

    //Crea un texto con los datos de la orden.
    let newOrderString = `
    -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

    Usuario: ${req.body.user}.
    Fecha: ${req.body.dateTime}.

    -----------------------------------------
    
    Productos de la orden: 
    ${products}
    -----------------------------------------
    
    Tipo de envío: ${req.body.shippingType}.
    Costo de envío: ${req.body.shippingCost}.

    -----------------------------------------

    Dirección de envío:

    ${req.body.name} ${req.body.lastname}
    ${req.body.email}
    ${req.body.address}, ${req.body.address2}
    ${req.body.country}, ${req.body.state}, ${req.body.zip}

    -----------------------------------------

    Método de pago seleccionado: ${req.body.paymentType}.

    -----------------------------------------

    Subtotal de la orden: ${req.body.subtotal}.
    Total de la orden: ${req.body.total}.

    -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-


    `;

    //Guarda datos de orden como archivo
    //formato txt en repositorio local.
    fs.appendFile("orders/new-order-placed.txt", newOrderString, function (err) {
        if (err) {
            console.log(err);
            res.send(
                {msj: "Ha ocurrido un error.<br>Intente de nuevo mas tarde."}
            );
        } else {
            console.log("Archivo de orden guardado");
            res.send(
                {msj: "Tu orden ha sido creada."}
            );
        }
    });
});

//Control de mensaje de error por ruta invalida.
app.use( function (req, res) {
    res.status(404).sendFile(__dirname + "/static/404.html");
});

//Escucha de peticiones en la ruta y puerto configurados.
app.listen(port, function () {
    console.log("Escuchando a http://localhost:" + port)
});