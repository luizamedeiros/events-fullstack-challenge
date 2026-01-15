import type { SweetAlertOptions } from 'sweetalert2'

export const ModalTryAgainLater = (
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
