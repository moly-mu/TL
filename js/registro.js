const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function registrarUsuario() {
  const hashedPassword = await bcrypt.hash("password123", 10); // Encripta la contraseña

  const nuevoUsuario = await prisma.usuario.create({
    data: {
      nombre: "Juan",
      apellido: "Pérez",
      tipoDocumento: "CEDULA",
      numeroDocumento: "123456789",
      correo: "juan@example.com",
      contraseña: hashedPassword
    }
  });

  console.log("Usuario registrado:", nuevoUsuario);
}

registrarUsuario()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
