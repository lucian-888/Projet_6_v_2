const express = require('express');
const mongoose = require('mongoose');

const Book = require('./models/Book');

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');


// Accès au path du serveur pour envoyer l'image au bon endroit
const path = require('path');


const app = express();

mongoose.connect('mongodb+srv://lucianbistreanu:XpWR8RFtWB2xnM8n@cluster0.juk6c.mongodb.net/')
    //{ useNewUrlParser: true,
    //  useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => console.log(e));

app.use(express.json());



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

 
  
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;