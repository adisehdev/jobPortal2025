"use server"
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function credentialLogin(formData) {
    try {
        const email = formData.get("email");
        const password = formData.get("password");
        const role = formData.get("role");
        
        if (!email || !password || !role) {
            return {
                isVerified: false,
                error: "Email, password, and role are required.",
            };
        }
        
        // Sign in the user using NextAuth
        await signIn("credentials", {
            email: email,
            password: password,
            role: role,
            redirect: false,
        });
        
        return {
            isVerified: true,
            error: null,
        };
    } catch (error) {
        console.error("Login error:", error);
        
        // Handle specific NextAuth errors
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        isVerified: false,
                        error: "Invalid credentials",
                    };
                case "CallbackRouteError":
                    return {
                        isVerified: false,
                        error: "Authentication callback error",
                    };
                default:
                    return {
                        isVerified: false,
                        error: "Authentication failed",
                    };
            }
        }
        
        return {
            isVerified: false,
            error: "An unexpected error occurred",
        };
    }
}