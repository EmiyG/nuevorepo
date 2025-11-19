import express from "express";

const app = express();

import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js"; // Nota: Asume que 'connection' es el pool o la conexión

const PORT = environments.port;

//PARSEAR JSON
app.use(express.json());

app.listen(PORT, ()=>{
    console.log(PORT);
});

app.get("/productos", async (req, res) => {
    try {
        let sql = 'SELECT * FROM products';
        let [rows] = await connection.query(sql); // Desestructuración para obtener solo las filas
        console.log(rows);
        res.status(200).json({
            payload: rows, // payload es lo que devuelve el query
            message: "Productos encontrados"
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: "Error al obtener productos"
        })
    }
});

app.get("/productos/:id", async (req, res) => {
    try{
        let { id } = req.params; // Obtengo el id
        let sql = 'SELECT * FROM products WHERE id = ?';
        let [rows] = connection.query(sql, [id]); // 👈 FALTA el 'await'
        
        res.status(200).json({
            payload: rows,
            message: "Producto encontrado"
        })

    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: "Error al obtener productos"
        });
    }
});

app.post("/productos", async (req, res) => {
    try {
        let {name, category, price, image} = req.body;
        let sql = 'INSERT INTO products (name, category, price, image, active) VALUES (?,?,?,?)';
        let [rows] = await connection.query(sql, [name, category, price, image, active]);

        res.status(200).json({
            message: "Producto creado correctamente"
        });



    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: "no se creo el producto"
        });
    }
});

app.put("/productos", async (req, res) => {
    try {
        let {name, category, price, image, active, id} = req.body;
        if (!name || !category || !price || !image || active == null || !id){
            console.log(name, category, price, image, active, id)
            res.status(400).json({
                error: "Faltan parametros"
            })
        }
        
        let sql = 'UPDATE products (name = ?,  category = ? , price = ?, image = ?, active = ? WHERE id = ?'
        let [result] = await connection.query(sql, [name, category, price, image, active, id])

        if (result.affectedRows === 0) {
            res.status(404).json({
                message: "Producto no encontrado"
            })
        }

        res.status(200).json({
            message: "Producto actualizado"
        });
        
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: "Erro interno"
        });
    }
});

app.delete("/productos/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let sql = 'DELETE FROM products WHERE id = ?';
        let [result] = await connection.query(sql, [id]); 
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Producto no encontrado"
            })
        }
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: "Error interno"
        });
    }
});