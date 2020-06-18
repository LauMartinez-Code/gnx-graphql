const express = require('express');
//eslint-disable-next-line
const gnx = require('@simtlix/gnx');
const app = express();
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
mongoose.plugin(require("./plugins/auditablePluginSchema"));

connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  replicaSet: 'rs'
}

//mongoose.connect('mongodb://localhost:27017,localhost:27018,localhost:27019/example', connectionOptions) 
const connectWithRetry = () => {
  console.log('Connecting to database...');
  mongoose.connect('mongodb://192.168.0.14:27017,192.168.0.14:27018,192.168.0.14:27019/example', connectionOptions)
  //mongoose.connect('mongodb://YourIP:27017,YourIP:27018,YourIP:27019/example', connectionOptions) //if have problems connecting whith mongoDB try this line instead of the previous one
  .then(() => {                                                                         //change 'localhost' to your IP adress(e.g. 191.167.0.15)
    console.log('--> MongoDB is connected <--');
  }).catch(err => {
    console.log('MongoDB connection unsuccessful, retry after 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  })
}
connectWithRetry();

mongoose.connection.once('open', () => {
  console.log('Connected to database')
})

const types = require('./types');
const includedTypes = Object.values(types);
const schema = gnx.createSchema(includedTypes, includedTypes);

app.use('/graphql', graphqlHTTP({
  schema, // Directing express-graphql to use this schema to map out the graph
  
  graphiql: true,  /* Directing express-graphql to use graphiql when goto '/graphql' address in the browser
  which provides an interface to make GraphQl queries */
}))

app.listen(3000, () => {
  console.log('Listening on port 3000')
})