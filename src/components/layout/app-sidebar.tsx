import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

// This is sample data.

type NavItem = { title: string; url: string };
type NavGroup = { title: string; items: NavItem[] };

const adminNav: NavGroup[] = [
    {
        title: "Overview",
        items: [{ title: "Dashboard", url: "/dashboard/admin" }],
    },
    {
        title: "User Management",
        items: [
            { title: "All Users", url: "/dashboard/admin/users" },
            { title: "All Tutors", url: "/dashboard/admin/tutors" },
        ],
    },
    {
        title: "Content",
        items: [{ title: "Subjects", url: "/dashboard/admin/subjects" }],
    },
    {
        title: "Bookings",
        items: [{ title: "All Bookings", url: "/dashboard/admin/bookings" }],
    },
    {
        title: "Home",
        items: [{ title: "Home", url: "/" }],
    },
];

const tutorNav: NavGroup[] = [
    {
        title: "Overview",
        items: [{ title: "Dashboard", url: "/dashboard/tutor" }],
    },
    {
        title: "Profile",
        items: [
            { title: "My Profile", url: "/dashboard/tutor/profile" },
            { title: "Sessions", url: "/dashboard/tutor/sessions" },
            { title: "Availability", url: "/dashboard/tutor/availability" },
        ],
    },
    {
        title: "Bookings",
        items: [
            { title: "My Bookings", url: "/dashboard/tutor/bookings" },
            { title: "Upcoming", url: "/dashboard/tutor/bookings/upcoming" },
        ],
    },
    {
        title: "Reviews",
        items: [{ title: "My Reviews", url: "/dashboard/tutor/reviews" }],
    },
    {
        title: "Home",
        items: [{ title: "Home", url: "/" }],
    },
];

const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
        {
            title: "Getting Started",

            items: [
                {
                    title: "Installation",
                    url: "#",
                },
                {
                    title: "Project Structure",
                    url: "#",
                },
            ],
        },
    ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    role: "ADMIN" | "TUTOR";
    pathname?: string; // pass current path for active state
}

export function AppSidebar({ role, pathname, ...props }: AppSidebarProps) {
    console.log("role: ", role);
    const navGroups = role === "ADMIN" ? adminNav : tutorNav;

    return (
        <Sidebar {...props}>
            <SidebarContent>
                <h1 className="text-center p-4 font-bold text-lg md:text-xl">
                    Skill Bridge
                </h1>
                {/* We create a SidebarGroup for each parent. */}
                {navGroups.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            // isActive={item.isActive}
                                        >
                                            <Link href={item.url}>
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
