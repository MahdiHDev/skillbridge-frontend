// // lib/api-client.ts
// import axios from "axios";

// export const apiClient = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:5000/api/v1
//     withCredentials: true, // 👈 sends cookies — required for req.user to work
// });

// lib/api-client.ts
import axios from "axios";

export const apiClient = axios.create({
    baseURL: "/api/v1",
    withCredentials: true,
});

// temporary debug interceptor — remove after fixing
apiClient.interceptors.request.use((config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    console.log("With credentials:", config.withCredentials);
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(
            "API Error:",
            error.response?.status,
            error.response?.data,
        );
        return Promise.reject(error);
    },
);
