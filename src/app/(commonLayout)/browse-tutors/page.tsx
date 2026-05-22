import { Suspense } from "react";
import TutorsPage from "./TutorPage";

export default function Page() {
    return (
        <Suspense
            fallback={<div className="py-20 text-center">Loading...</div>}
        >
            <TutorsPage />
        </Suspense>
    );
}
