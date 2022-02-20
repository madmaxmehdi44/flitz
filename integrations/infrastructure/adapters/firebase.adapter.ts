import admin from "firebase-admin"
import { injectable } from "tsyringe"
import { z } from "zod"

@injectable()
export class FirebaseAdapter {
  initialize() {
    if (admin.apps.length > 0) return null

    const { projectId, clientEmail, privateKey } = z
      .object({
        projectId: z.string(),
        clientEmail: z.string().email(),
        privateKey: z.string(),
      })
      .parse({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      })

    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n").replace(/\\/g, ""),
        projectId,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`,
      storageBucket: `${projectId}.appspot.com`,
    })

    return null
  }
}
