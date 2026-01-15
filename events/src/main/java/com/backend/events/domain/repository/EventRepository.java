package com.backend.events.domain.repository;

import com.backend.events.domain.model.Event;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

//@Repository
public interface EventRepository {
    List<Event> findAll();
    Optional<Event> findById(Long id);
    Event save(Event event);
    void deleteById(Long id);
    boolean existsById(Long id);
}