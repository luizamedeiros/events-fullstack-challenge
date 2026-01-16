package com.backend.events.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EventDto {

    public EventDto (String title, LocalDate startDate, LocalDate endDate, BigDecimal price, String status) {
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.price = price;
        this.status = status;

    }
    @NotBlank(message = "title is required")
    private String title;

    @NotNull(message = "startDate is required")
    private LocalDate startDate;

    @NotNull(message = "endDate is required")
    private LocalDate endDate;

    @NotNull(message = "price is required")
    @PositiveOrZero(message = "price must be >= 0")
    private BigDecimal price;

    @NotNull(message = "status is required")
    private String status;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) { this.title = title; }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
