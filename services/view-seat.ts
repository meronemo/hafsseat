import { supabase } from "@/lib/db"
import { type Session } from "next-auth"
import { Student } from "@/types/settings"

export async function viewSeat(session: Session) {
  const userClassId = session.user.classId
  
  const { data, error } = await supabase
    .schema("next_auth")
    .from("classes")
    .select("grade, class, seat, date")
    .eq("id", userClassId)
  if (error) throw new Error(error.message)

  const seat = data[0].seat
  let reverseSeat: (Student | null)[][] = []
  if (seat) {
    reverseSeat = []
    for (let i=seat.length-1; i>=0; i--) {
      let newRow: (Student | null)[] = []
      for (let j=seat[0].length-1; j>=0; j--) {
        newRow.push(seat[i][j])
      }
      reverseSeat.push(newRow)
    }
  }

  return { ok: true, grade: data[0].grade, class: data[0].class, seat: seat, reverseSeat: reverseSeat, date: data[0].date }
}