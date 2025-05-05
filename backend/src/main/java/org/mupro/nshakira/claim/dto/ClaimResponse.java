package org.mupro.nshakira.claim.dto;

public record ClaimResponse(
        Long claimId,
        String claimerEmail,
        Long itemId,
        String itemType,
        String reason,
        boolean approved) {
}
