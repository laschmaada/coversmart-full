"use client"

import {
  createContext, useContext, useEffect, useState, ReactNode,
} from "react"
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null
  loading: boolean
  register: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  error: string | null
  clearError: () => void
}

// ─── CONTEXT ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null)

// ─── PROVIDER ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const router                = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken()
          document.cookie = `cs_auth_token=${token}; path=/; max-age=3600; SameSite=Strict`
        } catch {
          // Token refresh failed — non-critical, user still logged in
        }
      } else {
        document.cookie = "cs_auth_token=; path=/; max-age=0"
      }
    }, (err) => {
      console.error("[CoverSmart] Auth state error:", err)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // ─── CREATE USER PROFILE IN FIRESTORE ─────────────────────────────────────
  const createFirestoreProfile = async (user: User, displayName: string) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid:         user.uid,
        email:       user.email,
        displayName: displayName,
        plan:        "free",
        createdAt:   serverTimestamp(),
        updatedAt:   serverTimestamp(),
      })
    } catch (err) {
      // Profile creation failed — log but don't block login
      console.error("[CoverSmart] Firestore profile creation failed:", err)
    }
  }

  // ─── REGISTER ─────────────────────────────────────────────────────────────
  const register = async (email: string, password: string, displayName: string) => {
    setError(null)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName })
      await createFirestoreProfile(cred.user, displayName)
      router.push("/dashboard/overview")
    } catch (e: unknown) {
      const msg = getFirebaseErrorMessage(e)
      setError(msg)
      throw e
    }
  }

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard/overview")
    } catch (e: unknown) {
      setError(getFirebaseErrorMessage(e))
      throw e
    }
  }

  // ─── GOOGLE LOGIN ─────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      const { getDoc } = await import("firebase/firestore")
      const snap = await getDoc(doc(db, "users", cred.user.uid))
      if (!snap.exists()) {
        await createFirestoreProfile(cred.user, cred.user.displayName || "User")
      }
      router.push("/dashboard/overview")
    } catch (e: unknown) {
      setError(getFirebaseErrorMessage(e))
      throw e
    }
  }

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth)
    router.push("/")
  }

  // ─── RESET PASSWORD ───────────────────────────────────────────────────────
  const resetPassword = async (email: string) => {
    setError(null)
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (e: unknown) {
      setError(getFirebaseErrorMessage(e))
      throw e
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout, resetPassword, error, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}

// ─── ERROR MESSAGES ───────────────────────────────────────────────────────────

function getFirebaseErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) return "An unexpected error occurred."
  const code = (error as { code?: string }).code
  const messages: Record<string, string> = {
    // Auth errors
    "auth/user-not-found":           "No account found with this email address.",
    "auth/wrong-password":           "Incorrect password. Please try again.",
    "auth/invalid-credential":       "Incorrect email or password.",
    "auth/email-already-in-use":     "An account with this email already exists. Try signing in.",
    "auth/weak-password":            "Password must be at least 6 characters.",
    "auth/invalid-email":            "Please enter a valid email address.",
    "auth/too-many-requests":        "Too many attempts. Please wait a moment and try again.",
    "auth/network-request-failed":   "Network error. Check your connection and try again.",
    "auth/popup-closed-by-user":     "Google sign-in was cancelled.",
    "auth/popup-blocked":            "Pop-up blocked by browser. Please allow pop-ups and try again.",
    "auth/cancelled-popup-request":  "Another sign-in is in progress. Please wait.",
    // Config errors (shows friendly message instead of raw Firebase error)
    "auth/operation-not-allowed":    "Email sign-in is not enabled. Please check your Firebase Console → Authentication → Sign-in methods.",
    "auth/configuration-not-found":  "Firebase is not configured correctly. Check your .env.local file has all NEXT_PUBLIC_FIREBASE_* variables.",
    "auth/api-key-not-valid":        "Invalid Firebase API key. Check NEXT_PUBLIC_FIREBASE_API_KEY in your .env.local file.",
    "auth/app-not-authorized":       "This domain is not authorised in Firebase. Add it to Firebase Console → Authentication → Authorised domains.",
    "auth/internal-error":           "A Firebase error occurred. Check your Firebase Console setup and ensure Email/Password sign-in is enabled.",
  }
  return (code && messages[code]) || `Sign-in error (${code || "unknown"}). Check the browser console for details.`
}
