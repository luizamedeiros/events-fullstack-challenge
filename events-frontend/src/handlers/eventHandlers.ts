import Swal from 'sweetalert2'
import type {
  Event,
  EventCreate,
  EventStatus,
  EventUpdate,
} from '../domain/event'
import { BuildModalSetup } from '../Components/Modal/ModalHtml'
import { ModalTryAgainLater } from '../Components/Modal/ModalTryAgainLater'
import Toast from '../Components/Toast/Toast'

type HandlersDeps = {
  create: (payload: EventCreate) => Promise<Event>
  update: (id: number, payload: EventUpdate) => Promise<Event>
  remove: (id: number) => Promise<void>
}

type Translator = (key: string, options?: Record<string, string>) => string

const openEventModalForm = async (t: Translator, initial?: Event) => {
  const modalSetup = BuildModalSetup(t)

  const { value } = await Swal.fire({
    title: initial ? t('common.modalEditEvent') : t('common.modalNewEvent'),
    html: modalSetup,
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonText: initial
      ? t('common.modalSave')
      : t('common.modalCreate'),
    cancelButtonText: t('common.cancel'),
    focusConfirm: false,
    buttonsStyling: false,
    customClass: {
      popup: 'swal-popup',
      title: 'swal-title',
      htmlContainer: 'swal-html',
      confirmButton: 'btn primary',
      cancelButton: 'btn ghost',
    },
    didOpen: () => {
      const titleInput = document.getElementById(
        'swal-title'
      ) as HTMLInputElement
      const startInput = document.getElementById(
        'swal-start'
      ) as HTMLInputElement
      const endInput = document.getElementById('swal-end') as HTMLInputElement
      const priceInput = document.getElementById(
        'swal-price'
      ) as HTMLInputElement
      const statusSelect = document.getElementById(
        'swal-status'
      ) as HTMLSelectElement

      if (initial) {
        titleInput.value = initial.title
        startInput.value = initial.startDate
        endInput.value = initial.endDate
        priceInput.value = String(initial.price)
        statusSelect.value = initial.status
      } else {
        statusSelect.value = 'STARTED'
      }
    },
    preConfirm: () => {
      const titleInput = document.getElementById(
        'swal-title'
      ) as HTMLInputElement
      const startInput = document.getElementById(
        'swal-start'
      ) as HTMLInputElement
      const endInput = document.getElementById('swal-end') as HTMLInputElement
      const priceInput = document.getElementById(
        'swal-price'
      ) as HTMLInputElement
      const statusSelect = document.getElementById(
        'swal-status'
      ) as HTMLSelectElement

      const title = titleInput.value.trim()
      const startDate = startInput.value
      const endDate = endInput.value
      const rawPrice = priceInput.value.replace(',', '.')
      const price = Number(rawPrice)
      const status = statusSelect.value as EventStatus

      if (!title || !startDate || !endDate || Number.isNaN(price)) {
        Swal.showValidationMessage(t('common.validationRequired'))
        return false
      }

      if (price < 0) {
        Swal.showValidationMessage(t('common.validationPricePositive'))
        return false
      }

      if (startDate > endDate) {
        Swal.showValidationMessage(t('common.validationEndAfterStart'))
        return false
      }

      return { title, startDate, endDate, price, status } satisfies EventCreate
    },
  })

  return value as EventCreate | undefined
}

export const createEventHandlers = (
  { create, update, remove }: HandlersDeps,
  t: Translator
) => {
  const handleCreate = async () => {
    const payload = await openEventModalForm(t)
    if (!payload) return
    try {
      await create(payload)
      Toast(t('common.toastEventCreated'))
    } catch {
      const modalError = ModalTryAgainLater(t)
      await Swal.fire(modalError)
    }
  }

  const handleEdit = async (event: Event) => {
    const payload = await openEventModalForm(t, event)
    if (!payload) return
    try {
      await update(event.id, payload)
      Toast(t('common.toastEventUpdated'))
    } catch {
      const modalError = ModalTryAgainLater(t)
      await Swal.fire(modalError)
    }
  }

  const handleDelete = async (event: Event) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: t('common.confirmDeleteTitle'),
      text: t('common.confirmDelete', { name: event.title }),
      showCancelButton: true,
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      buttonsStyling: false,
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title-alert',
        confirmButton: 'btn danger',
        cancelButton: 'btn ghost',
      },
    })

    if (!result.isConfirmed) return

    try {
      await remove(event.id)
      Toast(t('common.toastEventDeleted'))
    } catch {
      const modalError = ModalTryAgainLater(t)
      await Swal.fire(modalError)
    }
  }

  const handleStatusChange = async (event: Event, status: EventStatus) => {
    if (event.status === status) return
    try {
      await update(event.id, { ...event, status })
      Toast(t('common.toastEventStatusUpdated'))
    } catch {
      const modalError = ModalTryAgainLater(t)
      await Swal.fire(modalError)
    }
  }

  return {
    handleCreate,
    handleEdit,
    handleDelete,
    handleStatusChange,
  }
}
