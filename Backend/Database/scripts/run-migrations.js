const fs = require("fs");
const path = require("path");
const postgres = require("postgres");
require("dotenv").config();

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

(async () => {
  try {
    const folder = path.join(__dirname, "../schema");
    const files = fs.readdirSync(folder).sort();

    for (const file of files) {
      const content = fs.readFileSync(path.join(folder, file), "utf8");
      console.log(`Running: ${file}`);
      await sql.unsafe(content);
    }

    console.log("Migrations completed successfully!");
    process.exit();
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
})();
