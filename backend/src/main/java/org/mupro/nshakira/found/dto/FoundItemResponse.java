package org.mupro.nshakira.found.dto;

import org.mupro.nshakira.user.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class FoundItemResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime foundDate;
    private boolean isReturned = false;
    private String imagePath;
    private User reportedBy;

    public FoundItemResponse(Long id, String title, String description, String location,
                             LocalDateTime foundDate, boolean isReturned, String imagePath, User reportedBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.foundDate = foundDate;
        this.isReturned = isReturned;
        this.imagePath = imagePath;
        this.reportedBy = reportedBy;
    }

    // Getters only

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }

    public LocalDate getFoundDate() {
        return foundDate;
    }

    public boolean isReturned() {
        return isReturned;
    }

    public String getImagePath() {
        return imagePath;
    }

    public User getReportedBy() {
        return reportedBy;
    }
}
