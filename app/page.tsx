import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import { viewSeat } from "@/services/view-seat"
import { getGeneralSettings } from "@/services/settings/general"
import { getStudentsSettings } from "@/services/settings/students"
import HomePage from "@/components/HomePage/index"

export interface HomeProps {
  session: boolean
  data?: {
    seatCount: number
    studentCount: number
    isSeatNull: boolean
    settingsChanged: boolean
  }
} 

export default async function Page() {
  const session = await getServerSideSession()
  if (!session) {
    return <HomePage session={false} />
  }
  if (!session.user.classId) {
    redirect("/confirm-representative")
  }

  try {
    const [seatData, generalSettingsData, studentsSettingsData] = await Promise.all([
      viewSeat(session),
      getGeneralSettings(session),
      getStudentsSettings(session)
    ])

    const seat = seatData.seat
    const generalSettings = generalSettingsData.settings
    const students = studentsSettingsData.students
    
    const seatCount = generalSettings.rows * generalSettings.columns
    const studentCount = students.length
    const isSeatNull = !seat
    const settingsChanged = generalSettings.changed || studentsSettingsData.changed
  
    return <HomePage 
      session={true}
      data={{ seatCount, studentCount, isSeatNull, settingsChanged }}
    />
  } catch (error) {
    console.error(error)
  }
}
