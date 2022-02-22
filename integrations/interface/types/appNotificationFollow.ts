import { AppUserEmbedded } from "integrations/interface/types"

/**
 * 通知（フォロー）
 */
export type AppNotificationFollow = {
  id: string
  createdAt: Date
  type: "FOLLOW"
  isRead: boolean
  embedded: AppUserEmbedded
}
