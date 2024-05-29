import { validateUserCredentials } from "utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  // log the body to the console
  const { email, password } = body;
  try {
    // Verificar las credenciales del usuario
    const user = await validateUserCredentials(email, password);

    // Si las credenciales son válidas, devolver datos de usuario
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 401 });
  }
}
