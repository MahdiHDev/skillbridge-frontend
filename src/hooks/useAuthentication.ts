import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/router";

const handleLogout = async () => {
    const router = useRouter();
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                setTimeout(() => router.push("/"), 100);
            },
        },
    });
};
