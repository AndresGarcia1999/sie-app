// utils/auth.js

import bcrypt from "bcrypt";
import { supabase } from "./supabase/client";

const saltRounds = 10; // Número de rondas de encriptación

export async function validateUserCredentials(email, password) {
  if (!email || !password) {
    throw new Error("Correo electrónico y contraseña son requeridos");
  }

  try {
    // Consultar la base de datos para obtener el usuario con el correo electrónico dado
    const { data, error } = await supabase
      .from("tutors")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw new Error("Usuario no encontrado");
    }

    if (!data) {
      throw new Error("Usuario no encontrado");
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, data.password);
    if (!passwordMatch) {
      throw new Error("Credenciales incorrectas");
    }

    // Si las credenciales son válidas, devolver los datos del usuario
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}
