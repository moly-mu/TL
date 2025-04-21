const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;  

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/js", express.static(path.join(__dirname, "js")));

app.get("/catalogoL.html", (req, res) => {
    res.sendFile(path.join(__dirname, "Biblioteca", "catalogoL.html"));
});

// Ruta para registrar usuarios
app.post("/registro", async (req, res) => {
    try {
        const { name, lastname, documentType, documentNumber, email, password } = req.body;
        const formattedDocumentType = documentType.toUpperCase().replace(/\s+/g, "_");
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.usuario.create({
            data: {
                nombre: name,
                apellido: lastname,
                tipoDocumento: formattedDocumentType,
                numeroDocumento: documentNumber,
                email: email,
                contrase_a: hashedPassword,  // Campo correcto en la BD
            },
        });

        res.status(201).json({ message: "Usuario registrado con éxito" });

    } catch (error) {
        console.error("Error en registro:", error);
        if (error.code === "P2002") {
            res.status(400).json({ error: "El correo o número de documento ya está en uso" });
        } else {
            res.status(500).json({ error: "Error al registrar usuario", detalles: error.message });
        }
    }
});

// Ruta para login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await prisma.usuario.findUnique({
            where: { email: email },
        });

        console.log("Usuario encontrado:", usuario);
        console.log("Contraseña ingresada:", password);
        console.log("Contraseña almacenada (hash):", usuario.contrase_a);

        if (!usuario) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, usuario.contrase_a);

        console.log("¿Las contraseñas coinciden?", isMatch); 

        if (!isMatch) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        res.status(200).json({ redirect: "/catalogoL.html" });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});



// Servir catalogo despues del login
app.get("/catalogoL.html", (req, res) => {
    res.sendFile(path.join(__dirname, "Biblioteca", "catalogoL.html"));
});

app.get("/", (req, res) => { 
    res.sendFile(path.join(__dirname, "index.html"));
});

// Iniciar el servidor (solo una vez)
app.listen(PORT,"0.0.0.0", () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
