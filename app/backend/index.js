const express = require('express');
const router  = require('./routes/routes');
const bodyParser = require('body-parser');
const cors  = require('cors');

const PORT = 3000;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

app.use('/', router);

app.listen(PORT, () => {
    console.log('Servidor ouvindo na porta ', PORT) ;
});