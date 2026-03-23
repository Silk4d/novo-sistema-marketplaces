import pb from '@/lib/pocketbase/client'

export interface SyncSummary {
  read: number
  saved: number
  skipped: number
}

export const syncTinyProducts = async (token: string): Promise<SyncSummary> => {
  return await pb.send('/backend/v1/tiny-sync', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
