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
    onAuthStateChanged,
    Unsubscribe
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, Unsubscribe as FirestoreUnsubscribe } from "firebase/firestore";
import { auth, db } from "../utils/firebase";

// User specific data type
export type UserPlan = "free" | "pro" | "enterprise";

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
    isEnterprise: boolean;
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
    isEnterprise: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let authUnsub: Unsubscribe;
        let firestoreUnsub: FirestoreUnsubscribe | null = null;

        authUnsub = onAuthStateChanged(auth, async (currentUser) => {
            // Cleanup previous firestore listener if any
            if (firestoreUnsub) {
                firestoreUnsub();
                firestoreUnsub = null;
            }

            if (currentUser) {
                setUser(currentUser);
                setLoading(true);

                const userRef = doc(db, "users", currentUser.uid);

                // Subscribe to real-time updates
                firestoreUnsub = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data() as UserData);
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
                        setDoc(userRef, newUserData).catch(err => console.error("Error creating user profile:", err));
                        setUserData(newUserData);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });

            } else {
                setUser(null);
                setUserData(null);
                setLoading(false);
            }
        });

        return () => {
            if (authUnsub) authUnsub();
            if (firestoreUnsub) firestoreUnsub();
        };
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

    const isEnterprise = userData?.plan?.trim().toLowerCase() === "enterprise";
    // Pro features are available to both pro and enterprise users
    const isPro = userData?.plan?.trim().toLowerCase() === "pro" || isEnterprise;

    return (
        <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, isPro, isEnterprise }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
