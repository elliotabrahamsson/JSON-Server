const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Skapa en Express-app
const app = express();

// Middleware
app.use(cors()); // Tillåt CORS från alla domäner
app.use(express.json()); // Tillåt servern att läsa JSON-data i begäran
app.use(express.static("public")); // Tillåt statiska filer (t.ex. bilder)

const uploadFolder = path.join(__dirname, "Olympia_images");

// Se till att uppladdningsmappen finns
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Route för att hantera bilduppladdning (Base64-sträng)
app.post("/uploadImage", (req, res) => {
  const { image } = req.body; // Hämta Base64-strängen från body

  if (!image) {
    return res.status(400).json({ error: "Ingen bild skickades" });
  }

  // Generera ett unikt filnamn för varje uppladdad bild
  const filename = `${Date.now()}.png`; // Här kan du ändra på extension beroende på bildens format
  const filePath = path.join(uploadFolder, filename);

  // Skriv Base64-bilden till en fil
  const base64Data = image.replace(/^data:image\/png;base64,/, ""); // Rensa bort prefixet
  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      return res.status(500).json({ error: "Fel vid uppladdning av bild" });
    }

    // Returnera URL till den uppladdade bilden
    const imageUrl = `/Olympia_images/${filename}`;
    res.status(200).json({ message: "Bild uppladdad!", imageUrl });
  });
});

// Starta servern
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
