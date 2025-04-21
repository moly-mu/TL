document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data); 

            if (response.ok) {
                window.location.href = "http://localhost:3000/catalogoL.html"; 
            } else {
                alert("Error: " + (data.error || "Credenciales incorrectas"));
            }
        } catch (error) {
            console.error("Error en el login:", error);
            alert("Hubo un problema con el servidor. Inténtalo más tarde.");
        }
    });
});
