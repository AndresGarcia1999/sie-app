import { NextResponse } from "next/server";
import { hashPassword } from "utils/auth";
import { supabase } from "utils/supabase/client";

export async function GET() {
  //get all students from supabase
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("id");
  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {
  try {
    const dataToInsert = await request.json();

    // Create a new student
    const { data, error } = await supabase
      .from("students")
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Inserted student data not found.");
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error inserting student:", error);
    return new Response(JSON.stringify(error.message), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
