import { NextResponse } from "next/server";
import { supabase } from "utils/supabase/client";

export async function GET(_, { params }) {
  const tutorId = params.id;

  if (!tutorId) {
    return NextResponse.json(
      { message: "Missing required parameters: tutor" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("classes")
      .select(
        `
           title,
           day,
           start_at,
           end_at,
           student,
        ...students!inner(
            student_name:name
        )
        `
      ) // Select all necessary fields with student name alias
      .eq("tutor", tutorId)
      .order("day", {
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
