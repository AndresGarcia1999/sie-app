import { NextResponse } from "next/server";
import { supabase } from "utils/supabase/client";

export async function GET(req, { params }) {
  const url = new URL(req.url);
  const tutorId = params.id;
  const date = url.searchParams.get("date");

  if (!tutorId || !date) {
    return NextResponse.json(
      { message: "Missing required parameters: tutor, date" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("classes")
      .select(
        `
           *,
        ...students!inner(
            student_name:name,
            student_address:address,
            student_phone:phone
        )
        `
      ) // Select all necessary fields with student name alias
      .eq("tutor", tutorId)
      .eq("day", date)
      .order("start_at", {
        ascending: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
