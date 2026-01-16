import { useCallback, useEffect, useState } from 'react'
import { eventsService } from '../data/services/service'
import type { Event, EventCreate, EventUpdate } from '../domain/entities/event'

type LoadState = 'idle' | 'loading' | 'error'

export function useEvents() {
  const [items, setItems] = useState<Event[]>([])
  const [state, setState] = useState<LoadState>('idle')
  const [error, setError] = useState<string | null>(null)

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
    function initRefresh(){
      refresh()
    }
    initRefresh()
  }, [refresh])

  const create = useCallback(async (payload: EventCreate) => {
    const tempId = -Math.floor(Math.random() * 1000000)
    const optimistic: Event = { id: tempId, ...payload }
    setItems((prev) => [optimistic, ...prev])

    try {
      const saved = await eventsService.create(payload)
      setItems((prev) => prev.map((e) => (e.id === tempId ? saved : e)))
      return saved
    } catch (e) {
      setItems((prev) => prev.filter((e2) => e2.id !== tempId))
      throw e
    }
  }, [])

  const update = useCallback(async (id: number, payload: EventUpdate) => {
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

  const remove = useCallback(async (id: number) => {
    let removedItem: Event | undefined
    setItems((prev) => {
      removedItem = prev.find((e) => e.id === id)
      return prev.filter((e) => e.id !== id)
    })

    try {
      await eventsService.remove(id)
    } catch (e) {
      if (removedItem) setItems((prev) => [removedItem!, ...prev])
      throw e
    }
  }, [])

  return { items, state, error, refresh, create, update, remove }
}
