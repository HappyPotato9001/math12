import { auth } from "@/auth";
import { getUserById, type PublicUser } from "./users";

export async function getSessionUser(): Promise<PublicUser | null> {
  const session = await auth();
  const sessionUser = session?.user;
  const id = sessionUser?.id;
  if (!id) return null;
  const user = await getUserById(id);
  if (user) return user;

  // Keep the signed-in session usable when a serverless instance cannot see
  // the optional persistent user store yet.
  if (!sessionUser.email) return null;
  return {
    id,
    name: sessionUser.name || sessionUser.email.split("@")[0] || "Student",
    email: sessionUser.email,
    status: sessionUser.status || "pending",
    role: sessionUser.role || "student",
    createdAt: "",
  };
}
