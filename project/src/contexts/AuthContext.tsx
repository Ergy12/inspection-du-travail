import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  direction_id?: string;
  branch_id?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      try {
        if (currentUser) {
          const profileRef = doc(db, 'profiles', currentUser.uid);
          const profileSnap = await getDoc(profileRef);
          
          if (profileSnap.exists()) {
            const profileData = profileSnap.data();
            setProfile({
              id: profileSnap.id,
              ...profileData,
              created_at: profileData.created_at.toDate(),
              updated_at: profileData.updated_at.toDate()
            } as Profile);
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, userData: any) {
    try {
      setLoading(true);
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'profiles', newUser.uid), {
        email: newUser.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signOut,
    signUp,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}