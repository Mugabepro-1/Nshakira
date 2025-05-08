package org.mupro.nshakira.claim;

import jakarta.persistence.*;
import org.mupro.nshakira.user.User;

@Entity
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName; // "LOST" or "FOUND"

    @ManyToOne
    @JoinColumn(name = "claimer_id")
    private User claimer;

    private String description;

    private boolean approved = false;

    public Claim() {}

    public Claim(Long itemId, String itemType, User claimer, String reason, boolean approved) {
        this.itemName = itemType;
        this.claimer = claimer;
        this.description = reason;
        this.approved = approved;
    }

    // === Getters and Setters ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemType) {
        this.itemName = itemType;
    }

    public User getClaimer() {
        return claimer;
    }

    public void setClaimer(User claimer) {
        this.claimer = claimer;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String reason) {
        this.description = reason;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    // === Builder Pattern ===

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long itemId;
        private String itemType;
        private User claimer;
        private String reason;
        private boolean approved = false;

        public Builder itemId(Long itemId) {
            this.itemId = itemId;
            return this;
        }

        public Builder itemType(String itemType) {
            this.itemType = itemType;
            return this;
        }

        public Builder claimer(User claimer) {
            this.claimer = claimer;
            return this;
        }

        public Builder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public Builder approved(boolean approved) {
            this.approved = approved;
            return this;
        }

        public Claim build() {
            return new Claim(itemId, itemType, claimer, reason, approved);
        }
    }
}
