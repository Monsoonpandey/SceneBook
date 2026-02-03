import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/Firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = async (email, password, userData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email,
            ...userData,
            role: 'user',
            createdAt: new Date().toISOString(),
            profileImage: `https://ui-avatars.com/api/?name=${userData.name}&background=FF6B6B&color=fff`
        });

        return userCredential;
    };

    const login = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));

        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', result.user.uid), {
                email: result.user.email,
                name: result.user.displayName,
                role: 'user',
                profileImage: result.user.photoURL || `https://ui-avatars.com/api/?name=${result.user.displayName}&background=FF6B6B&color=fff`,
                createdAt: new Date().toISOString()
            });
        }

        return result;
    };

    const logout = () => {
        return signOut(auth);
    };

    const updateProfile = async (userId, data) => {
        await updateDoc(doc(db, 'users', userId), data);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userData,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}