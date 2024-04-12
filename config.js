const mongoose = require('mongoose');
const dbconnect = () => {
mongoose.connect("mongodb://127.0.0.1:27017/Zynch")
  .then(() => {
    console.log('Conexion a MongoDB establecida exitosamente');
      })
  .catch(err => console.error('Error al conectar a MongoDB:', err));
}


module.exports = dbconnect;
