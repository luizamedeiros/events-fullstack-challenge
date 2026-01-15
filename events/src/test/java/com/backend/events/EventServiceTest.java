package com.backend.events;

import com.backend.events.domain.dto.EventDto;
import com.backend.events.domain.enums.EventStatus;
import com.backend.events.domain.model.Event;
import com.backend.events.domain.repository.EventRepository;
import com.backend.events.domain.service.EventService;
import com.backend.events.exceptions.BusinessRuleException;
import com.backend.events.exceptions.InvalidStatusException;
import com.backend.events.exceptions.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @Mock
    private EventRepository repository;

    @InjectMocks
    private EventService service;

    private EventDto eventDto;

    @BeforeEach
    void setUp() {
        eventDto = new EventDto(
                "Party",
                LocalDate.now(),
                LocalDate.now().plusDays(1),
                BigDecimal.TEN,
                "STARTED"
        );
    }

    @Test
    void shouldNotSaveWhenStatusIsInvalid() {
        eventDto.setStatus("INVALID_STATUS");

        assertThrows(InvalidStatusException.class,
                () -> service.saveEvent(eventDto)
        );

        verify(repository, never()).save(any());
        verifyNoInteractions(repository);
    }

    @Test
    void shouldNotSaveWhenPriceIsNegative() {
        eventDto.setPrice(BigDecimal.valueOf(-5));

        assertThrows(
                BusinessRuleException.class,
                () -> service.saveEvent(eventDto)
        );

        verify(repository, never()).save(any());
        verifyNoInteractions(repository);
    }

    @Test
    void shouldNotSaveWhenEndDateIsBeforeStartDate() {
        eventDto.setStartDate(LocalDate.now().plusDays(5));
        eventDto.setEndDate(LocalDate.now());

        assertThrows(
                BusinessRuleException.class,
                () -> service.saveEvent(eventDto)
        );

        verify(repository, never()).save(any());
        verifyNoInteractions(repository);
    }

    @Test
    void shouldNotSaveWhenTitleIsBlank() {
        eventDto.setTitle(null);

        assertThrows(
                BusinessRuleException.class,
                () -> service.saveEvent(eventDto)
        );

        verify(repository, never()).save(any());
        verifyNoInteractions(repository);
    }

    @Test
    void shouldSaveWhenDtoIsValid() {
        Event event = new Event();
        event.setId(1L);
        event.setTitle(eventDto.getTitle());
        event.setStartDate(eventDto.getStartDate());
        event.setEndDate(eventDto.getEndDate());
        event.setPrice(eventDto.getPrice());
        event.setStatus(EventStatus.valueOf(eventDto.getStatus()));

        when(repository.save(any(Event.class))).thenReturn(event);

        var result = service.saveEvent(eventDto);

        verify(repository).save(any(Event.class));
        assertNotNull(result.getId());
        assertEquals(event.getId(), result.getId());
        assertEquals(event.getStartDate(), result.getStartDate());
        assertEquals(event.getEndDate(), result.getEndDate());
        assertEquals(event.getPrice(), result.getPrice());
        assertEquals(event.getStatus().name(), result.getStatus());
    }

    @Test
    void shouldNotEditWhenEventDoesNotExist() {
        Long eventId = 1L;
        when(repository.findById(eventId)).thenReturn(java.util.Optional.empty());

        assertThrows(
                NotFoundException.class,
                () -> service.editEvent(eventId, eventDto)
        );

        verify(repository, never()).save(any());
    }

    @Test
    void shouldEditWhenEventIsValid(){
        Long eventId = 1L;
        Event existing = new Event();
        existing.setId(eventId);
        existing.setTitle("Old title");
        existing.setStartDate(LocalDate.now());
        existing.setEndDate(LocalDate.now().plusDays(1));
        existing.setPrice(new BigDecimal("5.00"));
        existing.setStatus(EventStatus.STARTED);

        when(repository.findById(eventId)).thenReturn(Optional.of(existing));
        when(repository.save(any(Event.class))).thenReturn(existing);

        var result = service.editEvent(eventId, eventDto);

        verify(repository).findById(eventId);
        verify(repository).save(any(Event.class));

        assertEquals(existing.getId(), result.getId());
        assertEquals(eventDto.getTitle(), result.getTitle());
        assertEquals(eventDto.getStartDate(), result.getStartDate());
        assertEquals(eventDto.getEndDate(), result.getEndDate());
        assertEquals(eventDto.getPrice(), result.getPrice());
        assertEquals(eventDto.getStatus(), result.getStatus());
    }

    @Test
    void shouldDeleteWhenEventExists() {
        Long eventId = 1L;

        when(repository.existsById(eventId)).thenReturn(true);

        service.deleteEvent(eventId);
        var resultFindById = repository.findById(eventId);

        verify(repository).existsById(eventId);
        verify(repository).deleteById(eventId);
        assertEquals(resultFindById, Optional.empty());
    }

    @Test
    void shouldNotDeleteWhenEventDoesNotExist() {
        Long eventId = 1L;

        when(repository.existsById(eventId)).thenReturn(false);

        assertThrows(
                NotFoundException.class,
                () -> service.deleteEvent(eventId)
        );

        verify(repository, never()).deleteById(eventId);
    }

    @Test
    void shouldReturnEmptyWhenNoEventsExist(){
        when(repository.findAll()).thenReturn(List.of());

        var result = service.getAllEvents();

        verify(repository).findAll();
        assertTrue(result.isEmpty());
    }

    @Test
    void shouldReturnEventsWhenTheyExist(){
        Event event1 = new Event();
        event1.setId(1L);
        event1.setTitle("Event 1");
        event1.setStartDate(LocalDate.now());
        event1.setEndDate(LocalDate.now().plusDays(1));
        event1.setPrice(BigDecimal.TEN);
        event1.setStatus(EventStatus.STARTED);

        Event event2 = new Event();
        event2.setId(2L);
        event2.setTitle("Event 2");
        event2.setStartDate(LocalDate.now().plusDays(2));
        event2.setEndDate(LocalDate.now().plusDays(3));
        event2.setPrice(BigDecimal.valueOf(20));
        event2.setStatus(EventStatus.PAUSED);

        when(repository.findAll()).thenReturn(List.of(event1, event2));

        var result = service.getAllEvents();

        verify(repository).findAll();
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals("Event 1", result.get(0).getTitle());
        assertEquals(2L, result.get(1).getId());
        assertEquals("Event 2", result.get(1).getTitle());
    }

}
