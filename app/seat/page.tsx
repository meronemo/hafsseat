import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import { viewSeat } from "@/services/view-seat"
import SeatPage from "@/components/SeatPage/index"

export default async function Page() {
  const session = await getServerSideSession()

  if (!session || !session.user.classId) {
    redirect("/")
  }

  try {
    const { seat, reverseSeat, grade, class: cls, date } = await viewSeat(session)

    return (
      <SeatPage
        seat={seat}
        reverseSeat={reverseSeat}
        grade={grade}
        cls={cls}
        date={date}
        cols={seat[0].length}
      />
    )
  } catch (error) {
    console.error("Failed to load settings:", error)
    redirect("/")
  }
}