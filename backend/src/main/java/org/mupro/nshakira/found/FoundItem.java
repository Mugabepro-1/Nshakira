package org.mupro.nshakira.found;

import jakarta.persistence.*;
import org.mupro.nshakira.user.User;

import java.time.LocalDateTime;

@Entity
public class FoundItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String location;

    private LocalDateTime foundDate;

    private boolean isReturned = false;

    private String filePath;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User reportedBy;

    public FoundItem() {}

    public FoundItem(String title, String description, String location, LocalDateTime foundDate, boolean isReturned,String filePath, User reportedBy) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.foundDate = foundDate;
        this.filePath = filePath;
    }

    public FoundItem(String title, String description, String location, LocalDateTime foundDate, boolean isReturned, User reportedBy) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.foundDate = foundDate;
        this.isReturned = isReturned;
        this.reportedBy = reportedBy;
    }

    public FoundItem(String title, String description, String location, LocalDateTime foundDate, String filePath) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.foundDate = foundDate;
        this.filePath = filePath;
    }

    // Getters and setters
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

    public LocalDateTime getFoundDate() {
        return foundDate;
    }

    public void setFoundDate(LocalDateTime foundDate) {
        this.foundDate = foundDate;
    }

    public boolean isReturned() {
        return isReturned;
    }

    public void setReturned(boolean returned) {
        isReturned = returned;
    }

    public User getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(User reportedBy) {
        this.reportedBy = reportedBy;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    // === Builder Pattern ===

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String title;
        private String description;
        private String location;
        private LocalDateTime foundDate;
        private boolean isReturned = false;
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

        public Builder foundDate(LocalDateTime foundDate) {
            this.foundDate = foundDate;
            return this;
        }

        public Builder isReturned(boolean isReturned) {
            this.isReturned = isReturned;
            return this;
        }

        public Builder reportedBy(User reportedBy) {
            this.reportedBy = reportedBy;
            return this;
        }

        public FoundItem build() {
            return new FoundItem(title, description, location, foundDate, isReturned, reportedBy);
        }
    }
}
