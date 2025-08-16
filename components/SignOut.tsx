import { signOut } from "../auth";
import { Button } from "./ui/Button";

interface SignOutProps {
  children?: React.ReactNode;
}

export function SignOut({ children }: SignOutProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit" variant="outline">
        {children || "Đăng xuất"}
      </Button>
    </form>
  );
}
