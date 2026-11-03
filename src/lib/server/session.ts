import { auth } from "@/auth";
import { getUserById, type PublicUser } from "./users";

export async function getSessionUser(): Promise<PublicUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return getUserById(id);
}
