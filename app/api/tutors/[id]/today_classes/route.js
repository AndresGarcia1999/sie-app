import { NextResponse } from "next/server";
import { supabase } from "utils/supabase/client";

export async function GET(req, { params }) {
  const url = new URL(req.url);
  const tutorId = params.id;

  if (!tutorId) {
    return NextResponse.json(
      { message: "Missing required parameters: tutor, date" },
      { status: 400 }
    );
  }

  //get today's date
  const todayUTC = new Date();
  const today = new Date(todayUTC.setHours(todayUTC.getHours() - 5));
  const [month, day, year] = [
    today.getMonth() + 1,
    today.getDate(),
    today.getFullYear(),
  ];
  const date = `${year}-${month}-${day}`;
  const [hour, minutes] = [today.getHours(), today.getMinutes()];
  const time = `${hour}:${minutes}`;

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
      .gte("end_at", time)
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
