import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import Settings from "@/components/Settings/index"
import { getGeneralSettings } from "@/services/settings/general"
import { getStudentsSettings } from "@/services/settings/students"

export default async function SettingsPage() {
  const session = await getServerSideSession()

  if (!session || !session.user.classId) {
    redirect("/")
  }

  const { email, username, grade, class: userClass } = session.user

  try {
    const [{ settings }, { students }] = await Promise.all([
      getGeneralSettings(session),
      getStudentsSettings(session)
    ])

    return (
      <Settings
        user={{
          email: email ?? "",
          name: username ?? "",
          grade: grade ?? 0,
          class: userClass ?? ""
        }}
        generalSettings={settings}
        students={students ?? []}
      />
    )
  } catch (error) {
    console.error("Failed to load settings:", error)
    redirect("/")
  }
}