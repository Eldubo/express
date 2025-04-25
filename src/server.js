// index.js
import express from "express";
import cors from "cors";
import Alumno from "./src/models/alumno.js";
import { sumar, restar, multiplicar, dividir } from "./src/modules/matematica.js";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./src/modules/omdb-wrapper.js";
import ValidacionesHelper from "./src/modules/validaciones-helper.js";
import DateTimeHelper from "./src/modules/datetime-helper.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Alumnos
const alumnosArray = [
  new Alumno("Esteban Dido", "22888444", 20),
  new Alumno("Matias Queroso", "28946255", 51),
  new Alumno("Elba Calao", "32623391", 18)
];

// Endpoints comunes
a1: app.get("/", (req, res) => res.status(200).send("¡Ya estoy respondiendo!"));
a2: app.get("/saludar/:nombre", (req, res) => res.status(200).send(`Hola ${req.params.nombre}`));
a3: app.get("/validarfecha/:ano/:mes/:dia", (req, res) => {
  let fecha = new Date(`${req.params.ano}-${req.params.mes}-${req.params.dia}`);
  isNaN(fecha) ? res.status(400).send("Fecha inválida") : res.status(200).send("Fecha válida");
});

// Endpoints matemática
app.get("/matematica/sumar", (req, res) => {
  let n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, 0);
  let n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, 0);
  res.status(200).send(`${sumar(n1, n2)}`);
});

app.get("/matematica/restar", (req, res) => {
  let n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, 0);
  let n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, 0);
  res.status(200).send(`${restar(n1, n2)}`);
});

app.get("/matematica/multiplicar", (req, res) => {
  let n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, 0);
  let n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, 0);
  res.status(200).send(`${multiplicar(n1, n2)}`);
});

app.get("/matematica/dividir", (req, res) => {
  let n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, 0);
  let n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, 1);
  if (n2 === 0) return res.status(400).send("El divisor no puede ser cero");
  res.status(200).send(`${dividir(n1, n2)}`);
});

// Endpoints OMDB
app.get("/omdb/searchbypage", async (req, res) => {
  let search = ValidacionesHelper.getStringOrDefault(req.query.search, "");
  let p = ValidacionesHelper.getIntegerOrDefault(req.query.p, 1);
  let datos = await OMDBSearchByPage(search, p);
  res.status(200).json({ respuesta: datos.length > 0, cantidadTotal: datos.length, datos });
});

app.get("/omdb/searchcomplete", async (req, res) => {
  let search = ValidacionesHelper.getStringOrDefault(req.query.search, "");
  let datos = await OMDBSearchComplete(search);
  res.status(200).json({ respuesta: datos.length > 0, cantidadTotal: datos.length, datos });
});

app.get("/omdb/getbyomdbid", async (req, res) => {
  let imdbID = ValidacionesHelper.getStringOrDefault(req.query.imdbID, "");
  let datos = await OMDBGetByImdbID(imdbID);
  res.status(200).json({ respuesta: datos ? true : false, cantidadTotal: datos ? 1 : 0, datos: datos || {} });
});

// Endpoints alumnos
d1: app.get("/alumnos", (req, res) => res.status(200).json(alumnosArray));
d2: app.get("/alumnos/:dni", (req, res) => {
  let alumno = alumnosArray.find(a => a.dni === req.params.dni);
  alumno ? res.status(200).json(alumno) : res.status(404).send("Alumno no encontrado");
});

d3: app.post("/alumnos", (req, res) => {
  let { username, dni, edad } = req.body;
  alumnosArray.push(new Alumno(username, dni, edad));
  res.status(201).send("Alumno agregado");
});

d4: app.delete("/alumnos", (req, res) => {
  let index = alumnosArray.findIndex(a => a.dni === req.body.dni);
  if (index >= 0) {
    alumnosArray.splice(index, 1);
    res.status(200).send("Alumno eliminado");
  } else {
    res.status(404).send("Alumno no encontrado");
  }
});

// Endpoints fechas
e1: app.get("/fechas/isDate", (req, res) => {
  DateTimeHelper.isDate(req.query.fecha) ? res.status(200).send("Fecha válida") : res.status(400).send("Fecha inválida");
});

e2: app.get("/fechas/getEdadActual", (req, res) => {
  try {
    let edad = DateTimeHelper.getEdadActual(new Date(req.query.fechaNacimiento));
    res.status(200).json({ edad });
  } catch {
    res.status(400).send("Fecha inválida");
  }
});

e3: app.get("/fechas/getDiasHastaMiCumple", (req, res) => {
  try {
    let diasRestantes = DateTimeHelper.getDiasHastaMiCumple(new Date(req.query.fechaNacimiento));
    res.status(200).json({ diasRestantes });
  } catch {
    res.status(400).send("Fecha inválida");
  }
});

e4: app.get("/fechas/getDiaTexto", (req, res) => {
  try {
    let abr = req.query.abr === "true";
    let dia = DateTimeHelper.getDiaTexto(new Date(req.query.fecha), abr);
    res.status(200).json({ dia });
  } catch {
    res.status(400).send("Fecha inválida");
  }
});

e5: app.get("/fechas/getMesTexto", (req, res) => {
  try {
    let abr = req.query.abr === "true";
    let mes = DateTimeHelper.getMesTexto(new Date(req.query.fecha), abr);
    res.status(200).json({ mes });
  } catch {
    res.status(400).send("Fecha inválida");
  }
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
