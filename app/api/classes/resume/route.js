import { NextResponse } from "next/server";
import { supabase } from "utils/supabase/client";

export async function GET(req) {
  const url = new URL(req.url);
  const tutorId = url.searchParams.get("tutor");
  const startDate = url.searchParams.get("start");
  const endDate = url.searchParams.get("end");
  const insidePrice = parseFloat(url.searchParams.get("inside_price"));
  const outsidePrice = parseFloat(url.searchParams.get("outside_price"));

  // Error handling for missing parameters
  if (!tutorId || !startDate || !endDate) {
    return NextResponse.json(
      { message: "Missing required parameters: tutorId, start, and end" },
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
          student_name:name
        )
        `
      ) // Select all necessary fields with student name alias
      .eq("tutor", tutorId)
      .gte("day", startDate)
      .lte("day", endDate)
      .order("day");

    if (error) {
      throw new Error(error.message);
    }

    const classResume = {};
    let total = 0;
    let totalInside = 0;
    let totalOutside = 0;
    let totalTransportationCost = 0;

    data.forEach((classData) => {
      const formattedDate = classData.day;
      const duration = calculateClassDuration(classData);
      const classPrice = classData.is_outside
        ? duration * outsidePrice
        : duration * insidePrice;

      if (!classResume[formattedDate]) {
        classResume[formattedDate] = {
          classes: [],
          totalPrice: 0,
        };
      }

      classResume[formattedDate].classes.push({
        ...classData,
        duration,
        price: classPrice,
      });

      classResume[formattedDate].totalPrice +=
        classPrice + (classData.transportation_cost || 0);

      total += classPrice + (classData.transportation_cost || 0);

      if (classData.is_outside) {
        totalOutside += classPrice;
      } else {
        totalInside += classPrice;
      }

      totalTransportationCost += classData.transportation_cost || 0;
    });

    return NextResponse.json(
      {
        days: classResume,
        totals: {
          total,
          totalInside,
          totalOutside,
          totalTransportationCost,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

const calculateClassDuration = (classData) => {
  const start = new Date(`${classData.day}T${classData.start_at}`);
  const end = new Date(`${classData.day}T${classData.end_at}`);
  return Number(((end - start) / 3600000).toFixed(2)); // Calculate duration in hours
};
