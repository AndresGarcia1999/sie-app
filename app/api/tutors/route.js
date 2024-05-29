import { NextResponse } from "next/server";
import { hashPassword } from "utils/auth";
import { supabase } from "utils/supabase/client";

export async function GET() {
  //get all tutors from supabase
  const { data, error } = await supabase.from("tutors").select("*").order("id");
  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    // Encrypt the password
    const encryptedPassword = await hashPassword(password);

    // Create a new tutor
    const { data, error } = await supabase
      .from("tutors")
      .insert([{ name, email, password: encryptedPassword }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Inserted tutor data not found.");
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error inserting tutor:", error);
    return new Response(JSON.stringify(error.message), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
