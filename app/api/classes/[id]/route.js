import { NextResponse } from "next/server";
import { supabase } from "utils/supabase/client";

export async function DELETE(_, { params }) {
  const { id } = params;
  const { data, error } = await supabase.from("classes").delete().eq("id", id);
  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const updateData = await request.json();
  const { data, error } = await supabase
    .from("classes")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (!data) {
    throw new Error("Updated class data not found.");
  }

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}
