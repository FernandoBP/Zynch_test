const express = require('express');
const dbconnect = require('./config');
const ModelUser = require('./userModel');
const app = express();

const router = express.Router();

router.get("/",(req,res) =>{
    res.send("hello soy el metodo get")

})

router.get('/api/users', async (req, res) => {
    try {
        const users = await ModelUser.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

router.get('/api/userMoto', async (req, res) => {
    try {
        const dato_search = req.query.dato_search; 

        if (!dato_search) {
            return res.status(400).json({ error: 'Parametro de busqueda no proporcionado' });
        }
        
        console.log(dato_search);
        const pipeline = [
            //nombre, telfono o correo electronico
            {
                $match: {
                    $or: [
                        { names: dato_search },
                        { phone: dato_search },
                        { "e-mail": dato_search }
                    ]
                }
            },
            // Realizar la unión con la colección userMoto para obtener los datos de la moto relacionada
            {
                $lookup: {
                    from: "userMoto",
                    localField: "Id_user",
                    foreignField: "Id_user",
                    as: "motos_relacionadas"
                }
            },
            // Proyectar los campos deseados
            {
                $project: {
                    _id: 0,
                    Usuario: "$names",
                    Motos: {
                        $map: {
                            input: "$motos_relacionadas",
                            as: "moto",
                            in: {
                                idMoto: "$$moto.Id_moto",
                                moto: "$$moto.Engine_code",
                                bateria1: "$$moto.Bateria_1",
                                bateria2: "$$moto.Bateria_2"
                            }
                        }
                    }
                }
            }
        ];
        const result = await ModelUser.aggregate(pipeline).exec();
        res.json({ ok: true, result });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: 'Error en la búsqueda' });
    }
});

router.post("/", async (req, res) => {
    const body = req.body;
    const respuesta = await ModelUser.create(body)
    res.send(body)    
})
    
app.use(express.json())
app.use(router);
app.listen(3001, () => {
    console.log("El servidor esta en el puerto 3001"); 
})


dbconnect();