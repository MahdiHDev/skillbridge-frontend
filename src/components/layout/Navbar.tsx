"use client";

import { Menu, User } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface User {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
}

interface Navbar1Props {
    className?: string;
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
        className?: string;
    };
    menu?: MenuItem[];
    auth?: {
        login: {
            title: string;
            url: string;
        };
        signup: {
            title: string;
            url: string;
        };
    };
    user?: User | null;
}

const Navbar = ({
    logo = {
        url: "/",
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
        alt: "logo",
        title: "Skill Bridge",
    },
    menu = [
        { title: "Home", url: "/" },
        { title: "About", url: "/about" },
        { title: "Browse Tutors", url: "/browse-tutors" },
        { title: "My Sessions", url: "/my-sessions" },
    ],
    auth = {
        login: { title: "Login", url: "/login" },
        signup: { title: "Sign up", url: "/signup" },
    },
    user = null,

    className,
}: Navbar1Props) => {
    const router = useRouter();

    // const handleLogout = async () => {
    //     // Option 2
    //     await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/sign-out`, {
    //         method: "POST",
    //         credentials: "include",
    //     });
    //     router.refresh();
    //     setTimeout(() => router.push("/"), 100);
    // };

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.refresh();
                    setTimeout(() => router.push("/"), 100);
                },
                onError: () => {
                    // fallback redirect even if signOut fails
                    router.push("/");
                },
            },
        });
    };

    console.log("user data", user);
    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    const ProfileDropdown = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image ?? ""} alt={user?.name} />
                        <AvatarFallback className="text-xs">
                            {getInitials(user?.name ?? "U")}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                    </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    {user?.role === "TUTOR" ? (
                        <Link href="/tutorProfile">Profile</Link>
                    ) : (
                        <Link href="/studentProfile">Profile</Link>
                    )}
                    {/* <Link href="/profile">Profile</Link> */}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/my-sessions">My Sessions</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/my-reviews">My Reviews</Link>
                </DropdownMenuItem>

                {user?.role === "STUDENT" && (
                    <DropdownMenuItem asChild>
                        <Link href="/tutorProfile/create">Be a Tutor</Link>
                    </DropdownMenuItem>
                )}

                {user?.role === "TUTOR" && (
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                >
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <section
            className={cn(
                "py-4 shadow-[0_1px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.1)]",
                className,
            )}
        >
            <div className="container max-w-7xl mx-auto px-4 ">
                {/* Desktop Menu */}
                <nav className="hidden items-center justify-between lg:flex">
                    <div className="flex items-center gap-10">
                        {/* Logo */}
                        <Link
                            href={logo.url}
                            className="flex items-center gap-2"
                        >
                            {/* <img
                                src={logo.src}
                                className="max-h-8 dark:invert"
                                alt={logo.alt}
                            /> */}
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </Link>
                        <div className="flex items-center">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {menu.map((item) => renderMenuItem(item))}
                                </NavigationMenuList>
                                {(user?.role === "TUTOR" ||
                                    user?.role === "ADMIN") && (
                                    <NavigationMenuList asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </NavigationMenuList>
                                )}
                            </NavigationMenu>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <ModeToggle />
                        {user ? (
                            <ProfileDropdown />
                        ) : (
                            <>
                                {" "}
                                <Button asChild variant="outline" size="sm">
                                    <Link href={auth.login.url}>
                                        {auth.login.title}
                                    </Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={auth.signup.url}>
                                        {auth.signup.title}
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            href={logo.url}
                            className="flex items-center gap-2"
                        >
                            {/* <img
                                src={logo.src}
                                className="max-h-8 dark:invert"
                                alt={logo.alt}
                            /> */}
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </Link>
                        <Sheet>
                            <div className="flex items-center gap-2">
                                <ModeToggle />
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Menu className="size-4" />
                                    </Button>
                                </SheetTrigger>
                            </div>
                            <SheetContent className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>
                                        <a
                                            href={logo.url}
                                            className="flex items-center gap-2"
                                        >
                                            <img
                                                src={logo.src}
                                                className="max-h-8 dark:invert"
                                                alt={logo.alt}
                                            />
                                        </a>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 p-4">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="flex w-full flex-col gap-4"
                                    >
                                        {menu.map((item) =>
                                            renderMobileMenuItem(item),
                                        )}

                                        {user?.role === "TUTOR" && (
                                            <Link
                                                href="/dashboard"
                                                className="text-md font-semibold"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                    </Accordion>

                                    <div className="flex flex-col gap-3">
                                        {user && (
                                            <div className="flex items-center gap-3 border-b pb-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={user.image ?? ""}
                                                    />
                                                    <AvatarFallback>
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-sm">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-3">
                                            {user ? (
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                    >
                                                        <Link
                                                            href={
                                                                auth.login.url
                                                            }
                                                        >
                                                            {auth.login.title}
                                                        </Link>
                                                    </Button>
                                                    <Button asChild>
                                                        <Link
                                                            href={
                                                                auth.signup.url
                                                            }
                                                        >
                                                            {auth.signup.title}
                                                        </Link>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </section>
    );
};

const renderMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover text-popover-foreground">
                    {item.items.map((subItem) => (
                        <NavigationMenuLink
                            asChild
                            key={subItem.title}
                            className="w-80"
                        >
                            <SubMenuLink item={subItem} />
                        </NavigationMenuLink>
                    ))}
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
                asChild
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
            >
                <Link href={item.url}>{item.title}</Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
};

const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <AccordionItem
                key={item.title}
                value={item.title}
                className="border-b-0"
            >
                <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((subItem) => (
                        <SubMenuLink key={subItem.title} item={subItem} />
                    ))}
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <Link
            key={item.title}
            href={item.url}
            className="text-md font-semibold"
        >
            {item.title}
        </Link>
    );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
    return (
        <a
            className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
            href={item.url}
        >
            <div className="text-foreground">{item.icon}</div>
            <div>
                <div className="text-sm font-semibold">{item.title}</div>
                {item.description && (
                    <p className="text-sm leading-snug text-muted-foreground">
                        {item.description}
                    </p>
                )}
            </div>
        </a>
    );
};

export { Navbar };
