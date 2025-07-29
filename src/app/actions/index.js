"use server"
import {signIn} from "@/auth";



export async function credentialLogin(formData) {

    try {

        const email = formData.get("email");
        const password = formData.get("password");
        const role = formData.get("role");

        if (!email || !password || !role) {
            //throw new Error("Email, password, and role are required.");
            return {
                isVerified: false,
                error: "Email, password, and role are required.",
            };
        }

        

        

          

        // Sign in the user using NextAuth

        const response = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            role: formData.get("role"),
            redirect: false, // Prevent automatic redirection,
            
            
        })

        

        return {
            isVerified: true,
            error: response?.error || null,
        };
    } catch (error) {
        
        return {
            isVerified: false,
            error: error,
        }
    }
}

