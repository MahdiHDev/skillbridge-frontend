import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dateFormat";
import { tutorServerService } from "@/services/tutor.server.service";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function TutorProfilePage({ params }: Props) {
    const { id } = await params;

    const tutor = await tutorServerService.getTutorById(id);

    const reviews = tutor?.reviews ?? [];
    console.log("tutor", tutor);

    if (!tutor) {
        return notFound();
    }

    return (
        <>
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    {/* MAIN CARD */}
                    <div className=" p-10 space-y-12">
                        {/* PROFILE */}
                        <div className="text-center space-y-4">
                            <h1 className="text-3xl font-bold">
                                {/* {tutor?.user.name ?? "tutor"} */}
                                {tutor.user?.name ?? "Tutor"}
                            </h1>

                            <p className="text-muted-foreground">
                                ⭐ {tutor.averageRating} rating (
                                {tutor.totalReviews} reviews)
                            </p>

                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                {tutor.bio}
                            </p>
                        </div>

                        {/* SUBJECTS */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-center">
                                Subjects & Pricing
                            </h2>

                            <div className="flex flex-wrap justify-center items-center gap-6">
                                {tutor.tutorCategories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="border rounded-lg p-6 text-center space-y-3 shadow-sm w-87.5 dark:bg-stone-800"
                                    >
                                        <p className="font-semibold text-lg">
                                            {cat.subject.name}
                                        </p>

                                        <p className="text-sm text-muted-foreground capitalize">
                                            {cat.level.toLowerCase()} •{" "}
                                            {cat.experienceYears} years
                                            experience
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            ${cat.hourlyRate} / hour
                                        </p>

                                        <Link
                                            href={`/booking/${cat.id}?tutorName=${tutor.user?.name ?? "Tutor"}&subject=${cat.subject.name}&tutorProfileId=${tutor.id}`}
                                            className="inline-block mt-3 bg-black text-white dark:bg-stone-500 hover:text-gray-200 px-5 py-2 rounded-md text-sm duration-300"
                                        >
                                            Book Session
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* REVIEWS */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-center">
                                Student Reviews
                            </h2>

                            {reviews?.length === 0 ? (
                                <p className="text-muted-foreground text-center  dark:text-gray-300">
                                    No reviews yet
                                </p>
                            ) : (
                                <div className="grid md:grid-cols-3 gap-6">
                                    {tutor?.reviews?.map((review, index) => (
                                        <div
                                            key={index}
                                            className={`border rounded-xl p-6 bg-white dark:bg-stone-800 shadow-sm 
              `}
                                        >
                                            {/* Top */}
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="text-yellow-500">
                                                    {"★".repeat(review.rating)}
                                                    {"☆".repeat(
                                                        5 - review.rating,
                                                    )}
                                                </div>

                                                <span className="text-xs text-gray-400 dark:text-gray-200">
                                                    {formatDate(
                                                        review.createdAt,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Subject  */}

                                            <Badge>
                                                {
                                                    review?.booking
                                                        ?.tutorCategory?.subject
                                                        ?.name
                                                }
                                            </Badge>

                                            {/* Comment */}
                                            <p className="text-gray-600 dark:text-gray-300 text-sm my-4 px-2">
                                                &quot;
                                                {review.comment}
                                                &quot;
                                            </p>

                                            {/* User */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold text-lg">
                                                    {review.student.name.charAt(
                                                        0,
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-sm">
                                                        {review.student.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {/* ---------------------- */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4"></div>
            </section>
        </>
    );
}
