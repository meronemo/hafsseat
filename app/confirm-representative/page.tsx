import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import ConfirmRepresentative from "@/components/ConfirmRepresentative/index"

export default async function ConfirmRepresentativePage() {
  const session = await getServerSideSession()

  if (!session || session.user?.classId) {
    redirect("/")
  }

  const userEmail = String(session.user?.email)
  const userName = String(session.user?.name)
  const userStudentId = String(session.user?.studentId)
  const userGrade = Number(userStudentId[0])
  const userClass = Number(userStudentId.slice(1, 3))

  return (
    <ConfirmRepresentative
      userEmail={userEmail}
      userName={userName}
      userGrade={userGrade}
      userClass={userClass}
    />
  )
}
