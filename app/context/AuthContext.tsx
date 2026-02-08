"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../utils/firebase";

// User specific data type
export type UserPlan = "free" | "pro";

interface UserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    plan: UserPlan;
    createdAt?: any;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
    isPro: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    signUpWithEmail: async () => { },
    signOut: async () => { },
    isPro: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);
                // Check if user document exists in Firestore
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserData(userSnap.data() as UserData);
                } else {
                    // Create new user document with default "free" plan
                    const newUserData: UserData = {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                        plan: "free",
                        createdAt: serverTimestamp(),
                    };
                    await setDoc(userRef, newUserData);
                    setUserData(newUserData);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            console.error("Error signing in", error);
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, pass: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            // Update display name immediately
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: name });
                // Force update state to reflect name change
                setUser({ ...userCredential.user, displayName: name });
            }
        } catch (error) {
            console.error("Error signing up", error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const isPro = userData?.plan === "pro";

    return (
        <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, signOut, isPro }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
