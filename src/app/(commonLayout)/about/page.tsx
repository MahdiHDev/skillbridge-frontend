import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users } from "lucide-react";

export default function page() {
    return (
        <section className="py-20">
            <div className="container max-w-6xl mx-auto px-4">
                {/* Page Title */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold">About Skill Bridge</h1>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        Skill Bridge is an online tutoring platform that
                        connects students with experienced tutors to make
                        learning easier, accessible, and personalized.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid gap-8 md:grid-cols-2 mb-16">
                    <Card>
                        <CardContent className="p-8 space-y-4">
                            <h2 className="text-2xl font-semibold">
                                Our Mission
                            </h2>
                            <p className="text-muted-foreground">
                                Our mission is to bridge the gap between
                                students and skilled tutors by providing a
                                reliable platform where knowledge can be shared
                                efficiently. We aim to make quality education
                                accessible to everyone regardless of location.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-8 space-y-4">
                            <h2 className="text-2xl font-semibold">
                                Our Vision
                            </h2>
                            <p className="text-muted-foreground">
                                We envision a world where students can easily
                                find the right mentor to guide them in their
                                academic and professional journey. Skill Bridge
                                strives to become a trusted hub for online
                                learning and collaboration.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Platform Highlights */}
                <div className="grid gap-8 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-8 text-center space-y-4">
                            <BookOpen className="mx-auto h-10 w-10 text-primary" />
                            <h3 className="text-xl font-semibold">
                                Wide Range of Subjects
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Students can explore tutors across multiple
                                subjects and categories to find the perfect
                                match for their learning needs.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-8 text-center space-y-4">
                            <Users className="mx-auto h-10 w-10 text-primary" />
                            <h3 className="text-xl font-semibold">
                                Experienced Tutors
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Our tutors are experienced professionals who are
                                passionate about helping students succeed.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-8 text-center space-y-4">
                            <GraduationCap className="mx-auto h-10 w-10 text-primary" />
                            <h3 className="text-xl font-semibold">
                                Flexible Learning
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Students can book tutoring sessions at
                                convenient times and learn at their own pace.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
