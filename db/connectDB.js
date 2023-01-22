/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
// process.env.NODE_ENV === 'production' ? process.env.DB_ATLAS_URI : process.env.DB_LOCAL_URI;

const db_uri = process.env.DB_ATLAS_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(db_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connected');
    } catch (err) {
        console.log('Database error');
    }
};
module.exports = connectDb;
