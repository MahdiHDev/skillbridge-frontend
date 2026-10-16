import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getUserInfo } from "@/services/auth.service";

export default async function CommonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUserInfo();

    return (
        <div>
            <Navbar user={user ?? null} />
            {children}
            <Footer />
        </div>
    );
}
