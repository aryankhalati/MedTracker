require('dotenv').config();

const app = require('./src/app.js');
const connectDB = require('./src/db.js');

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('DB connection failed:', err);
        process.exit(1);
    });