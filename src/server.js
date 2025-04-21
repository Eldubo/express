import express from "express"; 
const app = express(); 
const port = 6969; 

app.get('/', (req,res)=>{
    res.send("Hola a todos")
})
app.get('/saludar', (req, res) => { 
    const nombre = req.query.nombre; 
    
    if (nombre) {
        res.send(`Hello ${nombre}!!`);
    } else {
        res.send('Hello randomUser!!');
    }
}); 

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`); 
});
