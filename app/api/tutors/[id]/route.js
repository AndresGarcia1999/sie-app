import { NextResponse } from "next/server";
import { hashPassword } from "utils/auth";
import { supabase } from "utils/supabase/client";

export async function DELETE(_, { params }) {
  const { id } = params;
  const { data, error } = await supabase.from("tutors").delete().eq("id", id);
  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const { name, password } = await request.json();

  const updateData = { name };
  if (password) {
    const encryptedPassword = await hashPassword(password);
    updateData.password = encryptedPassword;
  }

  // Perform the update
  const { data, error } = await supabase
    .from("tutors")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (!data) {
    throw new Error("Updated tutor data not found.");
  }

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}
