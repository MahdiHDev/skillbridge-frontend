import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Atom,
    BookOpen,
    Calculator,
    CalendarCheck,
    Code,
    Globe,
    Languages,
    Search,
    Star,
    UserPlus,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

const tutors = [
    {
        id: 1,
        name: "Sarah Johnson",
        subject: "Mathematics",
        rating: 4.9,
        price: 20,
        image: "/images/tutor1.jpg",
    },
    {
        id: 2,
        name: "Michael Lee",
        subject: "Physics",
        rating: 4.8,
        price: 25,
        image: "/images/tutor2.jpg",
    },
    {
        id: 3,
        name: "Emma Watson",
        subject: "English",
        rating: 4.7,
        price: 18,
        image: "/images/tutor3.jpg",
    },
    {
        id: 4,
        name: "David Kim",
        subject: "Chemistry",
        rating: 4.9,
        price: 22,
        image: "/images/tutor4.jpg",
    },
];

const categories = [
    {
        name: "Mathematics",
        icon: Calculator,
        slug: "math",
    },
    {
        name: "Science",
        icon: Atom,
        slug: "science",
    },
    {
        name: "Programming",
        icon: Code,
        slug: "programming",
    },
    {
        name: "Languages",
        icon: Languages,
        slug: "languages",
    },
    {
        name: "Business",
        icon: Globe,
        slug: "business",
    },
    {
        name: "General Studies",
        icon: BookOpen,
        slug: "general",
    },
];

const steps = [
    {
        title: "Create an Account",
        description:
            "Register as a student or tutor and complete your profile in minutes.",
        icon: UserPlus,
    },
    {
        title: "Find the Right Tutor",
        description:
            "Browse tutors by subject, rating, and price to find the perfect match.",
        icon: Search,
    },
    {
        title: "Book a Session",
        description:
            "Choose a convenient time and book your tutoring session instantly.",
        icon: CalendarCheck,
    },
    {
        title: "Learn & Leave a Review",
        description:
            "Attend the session and share your experience by leaving a review.",
        icon: Star,
    },
];

export default async function Home() {
    return (
        <div>
            {/* Hero Section started  */}
            <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white dark:text-gray-100 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col-reverse lg:flex-row items-center gap-10">
                    {/* Text Content */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-3xl sm:text-5xl font-bold mb-6">
                            Connect with Expert Tutors Anytime, Anywhere
                        </h1>
                        <p className="text-lg sm:text-xl mb-8 text-gray-100 dark:text-gray-300">
                            SkillBridge helps students find the perfect tutors
                            for their needs and manage learning sessions
                            effortlessly.
                        </p>
                        <div className="flex justify-center flex-col sm:flex-row lg:justify-start gap-3 sm:gap-4">
                            <a
                                href="/sign-up"
                                className="px-6 py-2 sm:py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition text-sm sm:text-base"
                            >
                                Get Started
                            </a>
                            <a
                                href="/browse-tutors"
                                className="px-6 py-2 sm:py-3 border border-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 dark:border-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 transition text-sm sm:text-base"
                            >
                                Browse Tutors
                            </a>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="lg:w-1/2 relative w-full h-80 sm:h-96 lg:h-[28rem]">
                        <Image
                            src="/images/heroimg.jpg" // replace with your image
                            alt="Learning with tutors"
                            fill
                            className="object-cover rounded-xl shadow-xl"
                        />
                    </div>
                </div>
            </section>
            {/* Hero Section ended */}

            {/* Featured Tutor Sections Started */}
            <section className="py-20">
                <div className="container max-w-7xl mx-auto px-4">
                    {/* Section Title */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Featured Tutors</h2>
                        <p className="text-muted-foreground mt-2">
                            Learn from our top rated tutors
                        </p>
                    </div>

                    {/* Tutors Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {tutors.map((tutor) => (
                            <Card
                                key={tutor.id}
                                className="hover:shadow-lg transition"
                            >
                                <CardHeader className="flex flex-col items-center gap-3">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={tutor.image} />
                                        <AvatarFallback>
                                            {tutor.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <CardTitle className="text-lg">
                                        {tutor.name}
                                    </CardTitle>

                                    <Badge variant="secondary">
                                        {tutor.subject}
                                    </Badge>
                                </CardHeader>

                                <CardContent className="text-center space-y-3">
                                    {/* Rating */}
                                    <div className="flex items-center justify-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm">
                                            {tutor.rating}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <p className="text-sm text-muted-foreground">
                                        ${tutor.price} / hour
                                    </p>

                                    {/* Button */}
                                    <Button asChild className="w-full">
                                        <Link href={`/tutors/${tutor.id}`}>
                                            View Profile
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            {/* Featured Tutor Sections Ended */}

            {/* Browse By Categories Section Started */}
            <section className="py-20">
                <div className="container max-w-7xl mx-auto px-4">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">
                            Browse by Categories
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Find tutors by your favorite subject
                        </p>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
                        {categories.map((category) => {
                            return (
                                <Card
                                    key={category.slug}
                                    className="hover:shadow-lg transition cursor-pointer"
                                >
                                    <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>
                                                {category.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="font-medium">
                                            {category.name}
                                        </p>

                                        <Button
                                            variant="secondary"
                                            asChild
                                            size="sm"
                                        >
                                            <Link
                                                href={`/browse-tutors?subject=${category.slug}`}
                                            >
                                                Explore
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
            {/* Browse By Categories Section Ended */}

            {/* How It Works Section Started */}
            <section className="py-20 bg-muted/40">
                <div className="container max-w-7xl mx-auto px-4">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">How It Works</h2>
                        <p className="text-muted-foreground mt-2">
                            Start learning in just a few simple steps
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <Card key={index} className="text-center">
                                    <CardContent className="flex flex-col items-center gap-4 py-10">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>

                                        <h3 className="font-semibold text-lg">
                                            {step.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
