import { AppSidebar } from "@/components/layout/app-sidebar";
import { DynamicBreadcrumb } from "@/components/layout/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { userService } from "@/services/user.service";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const data = await userService.getSession();
    const user = data?.data?.user;

    return (
        <SidebarProvider>
            <AppSidebar role={user.role} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                    />

                    <DynamicBreadcrumb />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
