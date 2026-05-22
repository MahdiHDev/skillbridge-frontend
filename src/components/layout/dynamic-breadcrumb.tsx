// "use client";

// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { breadcrumbMap } from "@/config/breadcrumbs";

// import { usePathname } from "next/navigation";

// export function DynamicBreadcrumb() {
//     const pathname = usePathname();
//     const crumb = breadcrumbMap[pathname];

//     if (!crumb) return null;

//     return (
//         <Breadcrumb>
//             <BreadcrumbList>
//                 {crumb.parent && (
//                     <>
//                         <BreadcrumbItem className="hidden md:block">
//                             <BreadcrumbLink href={crumb.parent.href}>
//                                 {crumb.parent.label}
//                             </BreadcrumbLink>
//                         </BreadcrumbItem>
//                         <BreadcrumbSeparator className="hidden md:block" />
//                     </>
//                 )}
//                 <BreadcrumbItem>
//                     <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
//                 </BreadcrumbItem>
//             </BreadcrumbList>
//         </Breadcrumb>
//     );
// }

"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { breadcrumbMap } from "@/config/breadcrumbs";
import { usePathname } from "next/navigation";

export function DynamicBreadcrumb() {
    const pathname = usePathname();

    console.log("pathname:", pathname); // ✅ check this in browser console

    const crumb = breadcrumbMap[pathname ?? ""];

    console.log("crumb:", crumb); // ✅ check this too

    // fallback so something always shows
    if (!crumb) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="capitalize">
                            {pathname?.split("/").filter(Boolean).pop() ??
                                "Dashboard"}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {crumb.parent && (
                    <>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href={crumb.parent.href}>
                                {crumb.parent.label}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                    </>
                )}
                <BreadcrumbItem>
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
