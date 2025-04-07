const bcrypt = require('bcryptjs');

const adminPassword = "AlEnBiJu@2003"; // Change this to your actual password

async function hashPassword() {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    console.log("Hashed Password:", hashedPassword);
}

hashPassword();
