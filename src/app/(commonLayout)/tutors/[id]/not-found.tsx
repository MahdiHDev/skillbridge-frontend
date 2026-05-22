import Link from "next/link";

export default function TutorNotFound() {
    return (
        <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
                <h1 className="text-6xl font-bold">404</h1>
                <h2 className="text-2xl font-semibold">Tutor Not Found</h2>
                <p className="text-muted-foreground">
                    The tutor you are looking for does not exist or has been
                    removed.
                </p>
                <Link
                    href="/browse-tutors"
                    className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg"
                >
                    Back to Tutors
                </Link>
            </div>
        </section>
    );
}
