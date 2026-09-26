import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy,
  serverTimestamp, Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type PolicyCategory = "FUNERAL" | "LIFE" | "CAR" | "HOME" | "MEDICAL" | "DISABILITY" | "INCOME_PROTECTION" | "CREDIT_LIFE" | "OTHER"

export interface Policy {
  id?: string
  userId: string
  insurer: string
  productName: string
  policyNumber: string
  category: PolicyCategory
  benefitAmount: number
  monthlyPremium: number
  insuredName: string
  startDate: string
  renewalDate: string
  notes?: string
  pdfUrl?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  plan: "free" | "mid" | "pro"
  age?: number
  location?: string
  employmentStatus?: string
  maritalStatus?: string
  dependants?: number
  homeOwner?: boolean
  createdAt?: Timestamp
}

export interface TcfIncident {
  id?: string
  userId: string
  insurer: string
  incidentType: string
  description: string
  dateOccurred: string
  outcome6Violation: string
  createdAt?: Timestamp
}

// ─── USER PROFILE ─────────────────────────────────────────────────────────────

export async function createUserProfile(profile: UserProfile) {
  await doc(db, "users", profile.uid)
  return updateDoc(doc(db, "users", profile.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).catch(() =>
    // doc doesn't exist yet — use set via addDoc workaround
    import("firebase/firestore").then(({ setDoc }) =>
      setDoc(doc(db, "users", profile.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    )
  )
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  return updateDoc(doc(db, "users", uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

// ─── POLICIES ─────────────────────────────────────────────────────────────────

export async function addPolicy(policy: Omit<Policy, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, "policies"), {
    ...policy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getUserPolicies(userId: string): Promise<Policy[]> {
  const q = query(
    collection(db, "policies"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Policy))
}

export async function updatePolicy(policyId: string, updates: Partial<Policy>) {
  return updateDoc(doc(db, "policies", policyId), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deletePolicy(policyId: string) {
  return deleteDoc(doc(db, "policies", policyId))
}

// ─── TCF INCIDENTS ────────────────────────────────────────────────────────────

export async function logTcfIncident(incident: Omit<TcfIncident, "id" | "createdAt">) {
  return addDoc(collection(db, "tcf_incidents"), {
    ...incident,
    createdAt: serverTimestamp(),
  })
}

export async function getUserTcfIncidents(userId: string): Promise<TcfIncident[]> {
  const q = query(
    collection(db, "tcf_incidents"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TcfIncident))
}

// ─── ANALYTICS HELPERS ────────────────────────────────────────────────────────

export function calcFuneralCapStatus(policies: Policy[]) {
  const funeralPolicies = policies.filter(p => p.category === "FUNERAL")
  const total = funeralPolicies.reduce((s, p) => s + p.benefitAmount, 0)
  const excess = Math.max(0, total - 100000)
  const wastedPremium = excess > 0
    ? funeralPolicies.reduce((s, p) => {
        const excessShare = Math.min(p.benefitAmount, excess) / total
        return s + p.monthlyPremium * excessShare
      }, 0)
    : 0
  return { total, excess, wastedPremium: Math.round(wastedPremium), count: funeralPolicies.length }
}

export function calcTotalMonthlyPremium(policies: Policy[]) {
  return policies.reduce((s, p) => s + p.monthlyPremium, 0)
}

export function detectDuplicateBenefits(policies: Policy[]) {
  const issues: { benefit: string; policies: string[]; estimatedWaste: number }[] = []

  // Check roadside assist: CAR + HOME both active
  const car  = policies.filter(p => p.category === "CAR")
  const home = policies.filter(p => p.category === "HOME")
  if (car.length > 0 && home.length > 0) {
    issues.push({ benefit: "Roadside Assist", policies: [...car, ...home].map(p => `${p.insurer} (${p.category})`), estimatedWaste: 120 })
  }

  // Check duplicate funeral policies (more than 1 = potential waste)
  const funeral = policies.filter(p => p.category === "FUNERAL")
  if (funeral.length > 1) {
    issues.push({ benefit: "Funeral Cover Overlap", policies: funeral.map(p => p.insurer), estimatedWaste: funeral.slice(1).reduce((s, p) => s + p.monthlyPremium, 0) })
  }

  return issues
}
