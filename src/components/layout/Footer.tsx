// components/Footer.jsx
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-200 dark:bg-gray-900 text-gray-500 dark:text-gray-200 font-semibold py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo & Description */}
                <div>
                    <h2 className="text-2xl font-bold dark:text-white text-gray-700 mb-4">
                        SkillBridge 🎓
                    </h2>
                    <p className="text-gray-500 dark:text-gray-300">
                        Connect with expert tutors and learn anything, anytime.
                        Find, book, and grow with SkillBridge.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold  dark:text-white text-gray-700 mb-4">
                        Quick Links
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/"
                                className="dark:hover:text-white hover:text-gray-700 transition"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/browse-tutors"
                                className="dark:hover:text-white hover:text-gray-700 transition"
                            >
                                Browse Tutors
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="dark:hover:text-white hover:text-gray-700 transition"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                className="dark:hover:text-white hover:text-gray-700 transition"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Role Links */}
                <div>
                    <h3 className="text-xl font-semibold dark:text-white text-gray-700 mb-4">
                        Get Started
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/sign-up"
                                className="dark:hover:text-white hover:text-gray-700 transition"
                            >
                                Sign Up as Student
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/tutorProfile/create"
                                className="dark:hover:text-white hover:text-gray-700 transition"
                            >
                                Wanna Be a Tutor
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/login"
                                className="dark:hover:text-white hover:text-gray-700 transition"
                            >
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom */}
            <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} SkillBridge. All rights
                reserved.
            </div>
        </footer>
    );
}
