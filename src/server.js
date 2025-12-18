require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

// importar modelos
require("./models");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("✅ Conectado a PostgreSQL");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();
