package com.backend.events.domain.repository;

import com.backend.events.domain.model.Event;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class EventRepositoryImpl implements EventRepository {

    private final ConcurrentMap<Long, Event> storage = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(0);

    @Override
    public Optional<Event> findById(Long id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Event> findAll() {
        List<Event> events = new ArrayList<>(storage.values());
//        events.sort(Comparator.comparing(Event::getStartDate). thenComparing(Event::getId));
        return events;
    }

    @Override
    public Event save(Event event) {
        if (event.getId() == null) {
            event.setId(sequence.incrementAndGet());
        }
        storage.put(event.getId(), event);
        return event;
    }

    @Override
    public void deleteById(Long id) {
        storage.remove(id);
    }

    @Override
    public boolean existsById(Long id) {
        return storage.containsKey(id);
    }
}
