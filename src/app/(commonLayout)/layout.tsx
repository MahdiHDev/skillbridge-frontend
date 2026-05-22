import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { userService } from "@/services/user.service";

export default async function CommonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await userService.getSession();

    console.log(session);

    return (
        <div>
            <Navbar user={session?.data?.user ?? null} />
            {children}
            <Footer />
        </div>
    );
}
