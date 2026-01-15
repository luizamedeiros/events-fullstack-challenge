package com.backend.events.domain.controller;

import com.backend.events.domain.dto.EventDto;
import com.backend.events.domain.dto.EventResponseDto;
import com.backend.events.domain.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<EventResponseDto> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public EventResponseDto getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponseDto createEvent(@RequestBody EventDto eventDto) {
        return eventService.saveEvent(eventDto);
    }

    @PutMapping("/{id}")
    public EventResponseDto updateEvent(@PathVariable Long id, @RequestBody EventDto eventDto) {
        return eventService.editEvent(id, eventDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

}
