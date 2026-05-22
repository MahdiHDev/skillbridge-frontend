// export const breadcrumbMap: Record<
//     string,
//     { parent?: { label: string; href: string }; label: string }
// > = {
//     "/dashboard": { label: "Dashboard" },
//     "/dashboard/users": {
//         parent: { label: "User Management", href: "#" },
//         label: "All Users",
//     },
//     "/dashboard/tutors": {
//         parent: { label: "User Management", href: "#" },
//         label: "All Tutors",
//     },
//     "/dashboard/subjects": {
//         parent: { label: "Content", href: "#" },
//         label: "Subjects",
//     },
//     "/dashboard/bookings": {
//         parent: { label: "Bookings", href: "#" },
//         label: "All Bookings",
//     },
//     "/dashboard/bookings/upcoming": {
//         parent: { label: "Bookings", href: "/dashboard/bookings" },
//         label: "Upcoming",
//     },
//     "/dashboard/profile": {
//         parent: { label: "Profile", href: "#" },
//         label: "My Profile",
//     },
//     "/dashboard/availability": {
//         parent: { label: "Profile", href: "#" },
//         label: "Availability",
//     },
//     "/dashboard/sessions": {
//         parent: { label: "Profile", href: "#" },
//         label: "Sessions",
//     },
//     "/dashboard/reviews": {
//         parent: { label: "Reviews", href: "#" },
//         label: "My Reviews",
//     },
// };

export const breadcrumbMap: Record<
    string,
    { parent?: { label: string; href: string }; label: string }
> = {
    // shared
    "/dashboard": { label: "Dashboard" },
    "/dashboard/tutor": { label: "Dashboard" },
    "/dashboard/admin": { label: "Dashboard" },

    // tutor routes
    "/dashboard/tutor/profile": {
        parent: { label: "Profile", href: "#" },
        label: "My Profile",
    },
    "/dashboard/tutor/availability": {
        parent: { label: "Profile", href: "#" },
        label: "Availability",
    },
    "/dashboard/tutor/sessions": {
        parent: { label: "Profile", href: "#" },
        label: "Sessions",
    },
    "/dashboard/tutor/reviews": {
        parent: { label: "Reviews", href: "#" },
        label: "My Reviews",
    },
    "/dashboard/tutor/bookings": {
        parent: { label: "Bookings", href: "#" },
        label: "My Bookings",
    },
    "/dashboard/tutor/bookings/upcoming": {
        parent: { label: "Bookings", href: "/dashboard/tutor/bookings" },
        label: "Upcoming",
    },

    // admin routes
    "/dashboard/admin/users": {
        parent: { label: "User Management", href: "#" },
        label: "All Users",
    },
    "/dashboard/admin/tutors": {
        parent: { label: "User Management", href: "#" },
        label: "All Tutors",
    },
    "/dashboard/admin/subjects": {
        parent: { label: "Content", href: "#" },
        label: "Subjects",
    },
    "/dashboard/admin/bookings": {
        parent: { label: "Bookings", href: "#" },
        label: "All Bookings",
    },
};
