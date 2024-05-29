"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "store/userSlice";

const Auth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleSignIn = async () => {
    try {
      // Envía los datos de inicio de sesión al servidor
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(error);
        return;
      }

      const data = await response.json();

      dispatch(setLogin(data)); // Almacenar datos de usuario en Redux
      router.push("/"); // Redireccionar a la página principal
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  return (
    <main className="flex items-center justify-center h-screen bg-blue-50">
      <div className="flex flex-col items-center px-8 py-6 bg-white border rounded-xl">
        <h1 className="mb-8 text-xl font-bold">Bienvenido a SIE App</h1>
        <h2 className="mb-4 text-lg">Inicia Sesión</h2>
        <input
          className="w-64 max-w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo Electrónico"
        />
        <input
          className="w-64 max-w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <button
          className="px-6 py-3 font-semibold text-white transition duration-300 bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={handleSignIn}
        >
          Iniciar Sesión
        </button>
      </div>
    </main>
  );
};

export default Auth;
