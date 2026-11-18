import { TIMEZONE, buildDateSlots } from "@/lib/calendar";
import { format, parse, toZonedTime } from "@/lib/date";
import { createClient } from "@/supabase/client";
import { Contact } from "@/types/contact.types";

export const getAvailableSlots = async (date: string) => {
  try {
    const dayDate = parse(date, "yyyyMMdd");
    const dateSlots = buildDateSlots(dayDate);

    const formattedSlots = dateSlots.map((slot) =>
      format(toZonedTime(slot, TIMEZONE), "HH:mm"),
    );

    return { data: formattedSlots };
  } catch (error) {
    console.error("Error generating slots:", error);
    return { data: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] };
  }
};

export const createMeeting = async (formData: Contact) => {
  try {
    const supabase = createClient();

    // Attempt to store in Supabase contact/leads table if available
    try {
      await supabase.from("contacts").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        budget: formData.budget,
        service_type: formData.service_type,
        meeting_date: formData.meeting_date,
        user_type: formData.user_type,
        created_at: new Date().toISOString(),
      });
    } catch (dbError) {
      console.warn("Supabase contacts insert notice:", dbError);
    }

    return { data: "I will notify you shortly" };
  } catch (error) {
    console.error("An unexpected error occurred: ", error);
    return { error: "An unexpected error occurred" };
  }
};
