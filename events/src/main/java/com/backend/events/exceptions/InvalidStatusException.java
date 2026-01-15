package com.backend.events.exceptions;

public class InvalidStatusException extends RuntimeException {
    public InvalidStatusException() {
            super("Invalid event status. Status can only be 'STARTED', 'PAUSED', or 'COMPLETED'. ");
    }
}
