package org.mupro.nshakira.lost;

import jakarta.persistence.*;
import org.mupro.nshakira.user.User;

import java.time.LocalDateTime;

@Entity
public class LostItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String location;

    @Column(name = "image_path")
    private String imagePath;

    private LocalDateTime lostDate;

    private boolean isResolved = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User reportedBy;

    public LostItem() {}


    public LostItem(String title, String description, String location, LocalDateTime lostDate, boolean isResolved, User reportedBy, String imagePath) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.lostDate = lostDate;
        this.isResolved = isResolved;
        this.reportedBy = reportedBy;
        this.imagePath = imagePath;
    }
    public LostItem(String title, String description, String location, LocalDateTime lostDate, String imagePath) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.lostDate = lostDate;
        this.imagePath = imagePath;

    }
    public LostItem(String title, String description, String location, LocalDateTime lostDate, boolean isResolved, User reportedBy) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.lostDate = lostDate;
        this.isResolved = isResolved;
        this.reportedBy = reportedBy;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getLostDate() {
        return lostDate;
    }

    public void setLostDate(LocalDateTime lostDate) {
        this.lostDate = lostDate;
    }

    public boolean isResolved() {
        return isResolved;
    }

    public void setResolved(boolean resolved) {
        isResolved = resolved;
    }

    public User getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(User reportedBy) {
        this.reportedBy = reportedBy;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    // === Builder Pattern ===

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String title;
        private String description;
        private String location;
        private LocalDateTime lostDate;
        private boolean isResolved = false;
        private User reportedBy;

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder lostDate(LocalDateTime lostDate) {
            this.lostDate = lostDate;
            return this;
        }

        public Builder isResolved(boolean isResolved) {
            this.isResolved = isResolved;
            return this;
        }

        public Builder reportedBy(User reportedBy) {
            this.reportedBy = reportedBy;
            return this;
        }

        public LostItem build() {
            return new LostItem(title, description, location, lostDate, isResolved, reportedBy);
        }
    }
}

