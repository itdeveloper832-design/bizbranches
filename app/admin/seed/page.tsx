"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Database } from "lucide-react"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"
import { SEED_BUSINESSES } from "@/lib/seed-businesses-data"

type LogLine = {
  kind: "added" | "skipped" | "failed"
  slug: string
  message?: string
}

function slugify(businessName: string, city: string) {
  const base = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
  return city ? `${base}-${city.toLowerCase().replace(/\s+/g, "-")}` : base
}

export default function AdminSeedPage() {
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [counts, setCounts] = useState({ added: 0, skipped: 0, failed: 0 })
  const [progress, setProgress] = useState(0)

  async function handleSeed() {
    if (running) return

    const confirmed = confirm(
      `This will attempt to add ${SEED_BUSINESSES.length} sample businesses to your Firestore. Duplicates (by slug) will be skipped. Continue?`
    )
    if (!confirmed) return

    setRunning(true)
    setDone(false)
    setLogs([])
    setCounts({ added: 0, skipped: 0, failed: 0 })
    setProgress(0)

    let added = 0
    let skipped = 0
    let failed = 0

    for (let i = 0; i < SEED_BUSINESSES.length; i++) {
      const biz = SEED_BUSINESSES[i]
      const slug = slugify(biz.name, biz.city)

      try {
        const existsQ = query(
          collection(db, "businesses"),
          where("slug", "==", slug)
        )
        const existsSnap = await getDocs(existsQ)

        if (!existsSnap.empty) {
          skipped++
          setLogs((prev) => [
            ...prev,
            { kind: "skipped", slug, message: "already exists" },
          ])
        } else {
          const doc = {
            businessName: biz.name,
            description: biz.desc,
            phone: biz.phone,
            whatsapp: biz.phone,
            email: "",
            websiteUrl: biz.website ?? "",
            facebookPage: "",
            youtubeChannel: "",
            logoUrl: "",
            address: biz.address,
            city: biz.city,
            category: biz.category,
            categoryId: biz.category,
            categorySlug: biz.category,
            subCategory: "",
            slug,
            status: "approved",
            featured: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }

          await addDoc(collection(db, "businesses"), doc)
          added++
          setLogs((prev) => [...prev, { kind: "added", slug }])
        }
      } catch (err: any) {
        failed++
        setLogs((prev) => [
          ...prev,
          { kind: "failed", slug, message: err?.message ?? "unknown error" },
        ])
        console.error("[v0] Seed failed for", slug, err)
      }

      setCounts({ added, skipped, failed })
      setProgress(Math.round(((i + 1) / SEED_BUSINESSES.length) * 100))
    }

    setRunning(false)
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Seed Sample Businesses
              </h1>
              <p className="text-sm text-gray-500">
                Bulk-add {SEED_BUSINESSES.length} realistic Pakistani businesses
                to your directory.
              </p>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-900">
              <p className="font-medium mb-1">Before you click:</p>
              <ul className="list-disc pl-5 space-y-1 text-blue-800">
                <li>
                  Adds {SEED_BUSINESSES.length} businesses spread across all 12
                  categories and major Pakistani cities.
                </li>
                <li>
                  Every record is saved with <code>status: &quot;approved&quot;</code>{" "}
                  so it shows up on the site immediately.
                </li>
                <li>
                  Email fields are left blank and phone numbers are realistic
                  but not real.
                </li>
                <li>
                  Safe to re-run &mdash; any business whose slug already exists
                  is skipped.
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSeed}
                disabled={running}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-md transition-colors"
              >
                {running ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Seeding... {progress}%
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    {done ? "Run Again" : `Seed ${SEED_BUSINESSES.length} Businesses`}
                  </>
                )}
              </button>

              {(running || done) && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-700">
                    Added: <strong>{counts.added}</strong>
                  </span>
                  <span className="text-gray-600">
                    Skipped: <strong>{counts.skipped}</strong>
                  </span>
                  <span className="text-red-700">
                    Failed: <strong>{counts.failed}</strong>
                  </span>
                </div>
              )}
            </div>

            {running && (
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {done && counts.failed === 0 && (
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Seeding complete.</p>
                  <p>
                    {counts.added} new businesses added,{" "}
                    {counts.skipped} skipped as duplicates. They will now appear
                    on the homepage, category pages, city pages and in
                    sitemap.xml.
                  </p>
                </div>
              </div>
            )}

            {done && counts.failed > 0 && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">
                    Finished with {counts.failed} failure
                    {counts.failed === 1 ? "" : "s"}.
                  </p>
                  <p>
                    Most likely cause: your Firestore security rules are
                    blocking writes from this signed-in session. Check the log
                    below for the exact error, then re-run after fixing rules.
                  </p>
                </div>
              </div>
            )}

            {logs.length > 0 && (
              <div className="border border-gray-200 rounded-md max-h-96 overflow-y-auto">
                <ul className="divide-y divide-gray-100 text-sm font-mono">
                  {logs.map((line, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 flex items-start gap-2"
                    >
                      {line.kind === "added" && (
                        <span className="text-green-600 shrink-0">added</span>
                      )}
                      {line.kind === "skipped" && (
                        <span className="text-gray-500 shrink-0">skip </span>
                      )}
                      {line.kind === "failed" && (
                        <span className="text-red-600 shrink-0">fail </span>
                      )}
                      <span className="text-gray-700 break-all">
                        {line.slug}
                        {line.message ? (
                          <span className="text-gray-500"> &mdash; {line.message}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

