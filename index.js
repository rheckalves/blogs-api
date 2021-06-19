const express = require('express');

const app = express();
const routes = require('./routes');

app.listen(3000, () => console.log('ouvindo porta 3000!'));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.use(express.json());
app.use(routes);

const errorHandlerMiddleware = require('./services/errorHandlerMiddleware');

app.use(errorHandlerMiddleware);
