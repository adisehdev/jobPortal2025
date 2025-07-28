"use server"
import { signIn, signOut } from "@/auth";
import { CredentialsSignin } from "next-auth";

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
        return {
            isVerified: false,
            error: "Invalid credentials. Please try again.",
        }
    }
}