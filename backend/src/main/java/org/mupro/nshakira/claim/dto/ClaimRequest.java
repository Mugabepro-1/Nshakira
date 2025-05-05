package org.mupro.nshakira.claim.dto;

public record ClaimRequest(
        Long itemId,
        String itemType, // "LOST" or "FOUND"
        String reason) {
}
