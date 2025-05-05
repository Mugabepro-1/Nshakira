package org.mupro.nshakira.lost.dto;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

public class LostItemRequest {
    private String title;
    private String description;
    private String location;
    private LocalDateTime lostDate;
    private MultipartFile image;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getLostDate() {
        return lostDate;
    }

    public void setLostDate(LocalDateTime lostDate) {
        this.lostDate = lostDate;
    }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public MultipartFile getImage() { return image; }
    public void setImage(MultipartFile image) { this.image = image; }
}
