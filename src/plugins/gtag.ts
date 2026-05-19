import type { App } from 'vue'
import { createGtag } from 'vue-gtag'
import router from '@/router'

export function setupGtag(app: App) {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

  if (!measurementId || measurementId === 'G-XXXXXXXXXX') return

  app.use(
    createGtag({
      tagId: measurementId,
      config: {
        send_page_view: true,
        anonymize_ip: true
      },
      pageTracker: {
        router: router,
      }
    })
  )
}
