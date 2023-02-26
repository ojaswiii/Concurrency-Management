const express = require('express');
const mongoose = require('mongoose');
const dotenv=require('dotenv');

const postRoutes=require('./routes/postRoutes')

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config({path:'./config.env'});

const DB=process.env.DATABASE;
mongoose.connect(DB, { useNewUrlParser:true, useUnifiedTopology:true })
    .then(() => console.log('DB connection successful'))
    .catch((err) => console.error(err));

app.use('/posts', postRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

process.on('unhandledRejection', err=>{
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shutting down...');
    server.close(()=>{
        process.exit(1);
    });
});