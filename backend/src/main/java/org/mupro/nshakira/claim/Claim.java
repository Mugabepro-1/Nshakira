package org.mupro.nshakira.claim;

import jakarta.persistence.*;
import org.mupro.nshakira.user.User;

@Entity
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long itemId;

    private String itemType; // "LOST" or "FOUND"

    @ManyToOne
    @JoinColumn(name = "claimer_id")
    private User claimer;

    private String reason;

    private boolean approved = false;

    public Claim() {}

    public Claim(Long itemId, String itemType, User claimer, String reason, boolean approved) {
        this.itemId = itemId;
        this.itemType = itemType;
        this.claimer = claimer;
        this.reason = reason;
        this.approved = approved;
    }

    // === Getters and Setters ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public User getClaimer() {
        return claimer;
    }

    public void setClaimer(User claimer) {
        this.claimer = claimer;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
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
