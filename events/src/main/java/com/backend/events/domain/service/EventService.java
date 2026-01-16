package com.backend.events.domain.service;

import com.backend.events.domain.dto.EventDto;
import com.backend.events.domain.dto.EventResponseDto;
import com.backend.events.domain.enums.EventStatus;
import com.backend.events.domain.model.Event;
import com.backend.events.domain.repository.EventRepository;
import com.backend.events.exceptions.BusinessRuleException;
import com.backend.events.exceptions.InvalidStatusException;
import com.backend.events.exceptions.NotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {

    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
    }

    public List<EventResponseDto> getAllEvents() {
        return repository.findAll().stream()
                .map(this::eventToResponseDto)
                .toList();
    }

    public EventResponseDto getEventById(Long id) {
        Event event = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event with " + id + " not found"));
        return eventToResponseDto(event);
    }

    public EventResponseDto saveEvent(EventDto eventDto) {
        validateEvent(eventDto);
        Event savedEvent = repository.save(dtoToEvent(eventDto));
        return eventToResponseDto(savedEvent);
    }

    public EventResponseDto editEvent(Long eventId, EventDto eventDto) {
        Event existingEvent = repository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Cannot find event with the given ID to update"));

        validateEvent(eventDto);

        existingEvent.setTitle(eventDto.getTitle().trim());
        existingEvent.setStartDate(eventDto.getStartDate());
        existingEvent.setEndDate(eventDto.getEndDate());
        existingEvent.setPrice(eventDto.getPrice());
        existingEvent.setStatus(EventStatus.valueOf(eventDto.getStatus().trim().toUpperCase()));

        Event updatedEvent = repository.save(existingEvent);
        return eventToResponseDto(updatedEvent);
    }

    public void deleteEvent(Long eventId) {
        if (!repository.existsById(eventId)) {
            throw new NotFoundException("Cannot find event with the given ID to delete");
        }
        repository.deleteById(eventId);
    }

    private void validateEvent(EventDto eventDto) {
        if(hasNullFields(eventDto)) {
            throw new BusinessRuleException("All fields are required and must not be null.");
        }
        if(!isValidDateRange(eventDto.getStartDate(), eventDto.getEndDate())) {
            throw new BusinessRuleException("Invalid date range: End date must be after start date.");
        }
        if(!isValidPriceValue(eventDto.getPrice())){
            throw new BusinessRuleException("Price must be a value greater than zero.");
        }
        if(!isValidStatus(eventDto.getStatus())){
            throw new InvalidStatusException();
        }
    }

    private boolean hasNullFields(EventDto eventDto) {
        return eventDto.getTitle() == null ||
                eventDto.getTitle().trim().isBlank() ||
                eventDto.getStartDate() == null ||
                eventDto.getEndDate() == null ||
                eventDto.getPrice() == null ||
                eventDto.getStatus() == null ||
                eventDto.getStatus().isBlank();
    }

    private boolean isValidPriceValue(BigDecimal price) {
        return price != null && price.compareTo(BigDecimal.ZERO) > 0;
    }

    private boolean isValidDateRange(LocalDate startDate, LocalDate endDate) {
        return startDate != null && endDate != null && endDate.isAfter(startDate);
    }

    private String formatStatus (String status){
        return status.trim().toUpperCase();
    }

    private boolean isValidStatus(String status) {
        if(status == null || status.isBlank()) {
            return false;
        }
        try {
            EventStatus.valueOf(formatStatus(status));
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private EventResponseDto eventToResponseDto(Event event) {
        return new EventResponseDto(
                event.getId(),
                event.getTitle(),
                event.getStartDate(),
                event.getEndDate(),
                event.getPrice(),
                event.getStatus().name()
        );
    }

    private Event dtoToEvent(EventDto eventDto) {
        Event event = new Event();
        event.setTitle(eventDto.getTitle().trim());
        event.setStartDate(eventDto.getStartDate());
        event.setEndDate(eventDto.getEndDate());
        event.setPrice(eventDto.getPrice());
        event.setStatus(EventStatus.valueOf(formatStatus(eventDto.getStatus())));
        return event;
    }

}
