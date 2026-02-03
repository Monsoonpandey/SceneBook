import { useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Try this import path - it should work if firebase folder is in src
import { auth, db } from "../firebase/config";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Get user data from Firestore
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            id: firebaseUser.uid,
                            name: userData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
                            email: firebaseUser.email,
                            role: userData.role || "user",
                            photoURL: userData.photoURL || null
                        });
                    } else {
                        // Create user document if it doesn't exist
                        await setDoc(doc(db, "users", firebaseUser.uid), {
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                            email: firebaseUser.email,
                            role: "user",
                            createdAt: new Date().toISOString(),
                            photoURL: null
                        });

                        setUser({
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                            email: firebaseUser.email,
                            role: "user",
                            photoURL: null
                        });
                    }
                } catch (err) {
                    console.error("Error fetching user data:", err);
                    setUser({
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                        email: firebaseUser.email,
                        role: "user",
                        photoURL: null
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Register new user
    const register = async (email, password, name) => {
        try {
            setError(null);
            setLoading(true);

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Update profile
            await updateProfile(firebaseUser, { displayName: name });

            // Create user document
            await setDoc(doc(db, "users", firebaseUser.uid), {
                uid: firebaseUser.uid,
                name: name,
                email: email,
                role: "user",
                createdAt: new Date().toISOString(),
                photoURL: null
            });

            return {
                success: true,
                user: {
                    id: firebaseUser.uid,
                    name: name,
                    email: email,
                    role: "user"
                }
            };
        } catch (error) {
            let errorMessage = error.message;

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters.";
            }

            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Get user data
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            const userData = userDoc.data();

            return {
                success: true,
                user: {
                    id: firebaseUser.uid,
                    name: userData?.name || firebaseUser.displayName,
                    email: firebaseUser.email,
                    role: userData?.role || "user",
                    photoURL: userData?.photoURL || null
                }
            };
        } catch (error) {
            let errorMessage = error.message;

            if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password.";
            }

            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        try {
            setError(null);
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        }
    };

    // Check if user is admin
    const isAdmin = () => {
        return user?.role === 'admin';
    };

    return {
        user,
        loading,
        error,
        setError,
        register,
        login,
        logout,
        resetPassword,
        isAdmin
    };
};