import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import { eventsService } from '../data/services/service'
import type {
  Event,
  EventCreate,
  EventStatus,
  EventUpdate,
} from '../domain/entities/event'
import { validateEvent } from '../domain/validators/validators'
import createToast from '../utils/toast'
import { buildModalSetup, buildModalTryAgainLater } from '../utils/modal'

type LoadState = 'idle' | 'loading' | 'error'

export function useEvents() {
  const [items, setItems] = useState<Event[]>([])
  const [state, setState] = useState<LoadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const refresh = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const data = await eventsService.list()
      setItems(data)
      setState('idle')
    } catch (e) {
      setError(String(e))
      setState('error')
    }
  }, [])

  useEffect(() => {
    function initRefresh() {
      refresh()
    }
    initRefresh()
  }, [refresh])

  const openEventModalForm = useCallback(
    async (initial?: Event) => {
      const modalSetup = buildModalSetup(t)

      const getModalElements = () => {
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

        return {
          titleInput,
          startInput,
          endInput,
          priceInput,
          statusSelect,
        }
      }

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
          const { titleInput, startInput, endInput, priceInput, statusSelect } =
            getModalElements()

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
          const { titleInput, startInput, endInput, priceInput, statusSelect } =
            getModalElements()

          const payload = {
            title: titleInput.value.trim(),
            startDate: startInput.value,
            endDate: endInput.value,
            price: Number(priceInput.value.replace(',', '.')),
            status: statusSelect.value as EventStatus,
          } satisfies EventCreate

          const errors = validateEvent(payload)
          const firstError = Object.values(errors)[0]

          if (firstError) {
            Swal.showValidationMessage(firstError)
            return false
          }

          return payload
        },
      })

      return value as EventCreate | undefined
    },
    [t]
  )

  const create = useCallback(async () => {
    const payload = await openEventModalForm()
    if (!payload) return
    let tempId: number | null = null
    try {
      tempId = -Math.floor(Math.random() * 1000000)
      const optimistic: Event = { id: tempId, ...payload }
      setItems((prev) => [optimistic, ...prev])

      const saved = await eventsService.create(payload)
      setItems((prev) => prev.map((e) => (e.id === tempId ? saved : e)))
      createToast(t('common.toastEventCreated'))
    } catch {
      if (tempId != null) {
        setItems((prev) => prev.filter((e2) => e2.id !== tempId))
      }
      const modalError = buildModalTryAgainLater(t)
      await Swal.fire(modalError)
    }
  }, [openEventModalForm, t])

  const updateEvent = useCallback(async (id: number, payload: EventUpdate) => {
    let before: Event | undefined
    setItems((prev) => {
      before = prev.find((e) => e.id === id)
      return prev.map((e) => (e.id === id ? { ...e, ...payload } : e))
    })

    try {
      const saved = await eventsService.update(id, payload)
      setItems((prev) => prev.map((e) => (e.id === id ? saved : e)))
      return saved
    } catch (e) {
      if (before)
        setItems((prev) => prev.map((e2) => (e2.id === id ? before! : e2)))
      throw e
    }
  }, [])

  const edit = useCallback(
    async (event: Event) => {
      const payload = await openEventModalForm(event)
      if (!payload) return
      try {
        await updateEvent(event.id, payload)
        createToast(t('common.toastEventUpdated'))
      } catch {
        const modalError = buildModalTryAgainLater(t)
        await Swal.fire(modalError)
      }
    },
    [openEventModalForm, t, updateEvent]
  )

  const updateStatus = useCallback(
    async (event: Event, status: EventStatus) => {
      if (event.status === status) return
      try {
        await updateEvent(event.id, { ...event, status })
        createToast(t('common.toastEventStatusUpdated'))
      } catch {
        const modalError = buildModalTryAgainLater(t)
        await Swal.fire(modalError)
      }
    },
    [t, updateEvent]
  )

  const remove = useCallback(
    async (event: Event) => {
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

      let removedItem: Event | undefined
      try {
        setItems((prev) => {
          removedItem = prev.find((e) => e.id === event.id)
          return prev.filter((e) => e.id !== event.id)
        })

        await eventsService.remove(event.id)
        createToast(t('common.toastEventDeleted'))
      } catch {
        setItems((prev) => {
          if (!removedItem) return prev
          return [removedItem, ...prev]
        })
        const modalError = buildModalTryAgainLater(t)
        await Swal.fire(modalError)
      }
    },
    [t]
  )

  return {
    items,
    state,
    error,
    refresh,
    create,
    edit,
    remove,
    updateStatus,
  }
}
