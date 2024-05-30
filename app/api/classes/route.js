import { NextResponse } from "next/server";
import { supabase } from "utils/supabase/client";

export async function GET() {
  //get all classes from supabase
  const { data, error } = await supabase
    .from("classes")
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

    // Create a new class
    const { data, error } = await supabase
      .from("classes")
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Inserted class data not found.");
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error inserting class:", error);
    return new Response(JSON.stringify(error.message), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
