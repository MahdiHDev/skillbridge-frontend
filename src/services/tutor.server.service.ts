import { env } from "@/env";
import { TutorProfileData } from "@/types/tutor.types";
import { cookies } from "next/headers"; // ✅ safe here — only used in Server Components
import { notFound } from "next/navigation";

const API_URL = env.API_URL;

export const tutorServerService = {
    getTutorById: async function (id: string): Promise<TutorProfileData> {
        const cookieStore = await cookies();
        const url = `${API_URL}/tutor/${id}`;

        // console.log("Fetching tutor URL:", url);
        // console.log("Cookies:", cookieStore.toString()); // 👈 check if cookies exist

        const res = await fetch(url, {
            headers: {
                Cookie: cookieStore.toString(),
            },
            next: { tags: [`tutor-${id}`] },
        });

        console.log("Response status:", res.status); // 👈 check actual status
        const json = await res.json();
        console.log("Response body:", json); // 👈 see full response

        if (res.status === 404) notFound();

        if (!res.ok) throw new Error(json.message ?? `HTTP ${res.status}`);
        return json.data;
    },
};
