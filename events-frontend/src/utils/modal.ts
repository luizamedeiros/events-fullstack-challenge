import type { SweetAlertOptions } from 'sweetalert2'
import { eventStatuses } from '../domain/entities/event'

export const buildModalSetup = (t: (key: string) => string) => {
  const statusLabels: Record<string, string> = {
    STARTED: t('common.statusStarted'),
    PAUSED: t('common.statusPaused'),
    COMPLETED: t('common.statusCompleted'),
  }

  return `
        <div class="swal-form">
          <label class="swal-field">
            <span>${t('common.title')}</span>
            <input id="swal-title" class="swal2-input" placeholder="${t(
              'common.eventName'
            )}" />
          </label>
          <div class="swal-grid">
            <label class="swal-field">
              <span>${t('common.start')}</span>
              <input id="swal-start" type="date" class="swal2-input" />
            </label>
            <label class="swal-field">
              <span>${t('common.end')}</span>
              <input id="swal-end" type="date" class="swal2-input" />
            </label>
          </div>
          <div class="swal-grid">
            <label class="swal-field">
              <span>${t('common.price')}</span>
              <input id="swal-price" type="number" min="0" step="0.01" class="swal2-input" placeholder="0,00" />
            </label>
            <label class="swal-field">
              <span>${t('common.status')}</span>
              <select id="swal-status" class="swal2-input">
                ${eventStatuses
                  .map(
                    (status) =>
                      `<option value="${status}">${statusLabels[status]}</option>`
                  )
                  .join('')}
              </select>
            </label>
          </div>
        </div>
      `
}

export const buildModalTryAgainLater = (
  t: (key: string) => string
): SweetAlertOptions => ({
  icon: 'error',
  title: t('common.modalTryAgainLaterTitle'),
  text: t('common.modalTryAgainLaterText'),
  buttonsStyling: false,
  customClass: {
    popup: 'swal-popup',
    title: 'swal-title-alert',
    confirmButton: 'btn primary',
  },
})