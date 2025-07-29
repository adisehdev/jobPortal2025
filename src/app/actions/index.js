"use server"
import { signIn} from "@/auth";



export async function credentialLogin(formData) {

    try {

        const email = formData.get("email");
        const password = formData.get("password");
        const role = formData.get("role");

        if (!email || !password || !role) {
            return {
                isVerified: false,
                error: "All fields are required.",
            };
        }

        
        
        const response = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            role: formData.get("role"),
            redirect : false,
        })

        //console.log("signIn response:", response);

        return {
            isVerified: true,
            error: response?.error || null,
        };
    } catch (error) {
        console.error("Error during login:", error);
        return {
            isVerified: false,
            error: error.digest || "An error occurred during login.",
        }
    }
}

