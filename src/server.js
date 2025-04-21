import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('¡Ya estoy respondiendo!');
});

app.get('/saludar/:nombre', (req, res) => {
    const { nombre } = req.params;
    res.status(200).send(`Hola ${nombre}`);
});

app.get('/validarfecha/:ano/:mes/:dia', (req, res) => {
    const { ano, mes, dia } = req.params;
    const fecha = new Date(`${ano}-${mes}-${dia}`);
    if (isNaN(fecha.getTime())) {
        res.status(400).send('Fecha inválida');
    } else {
        res.status(200).send('Fecha válida');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
