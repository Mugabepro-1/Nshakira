package org.mupro.nshakira.lost.dto;

import java.time.LocalDateTime;

public record LostItemResponse(
        Long id,
        String title,
        String description,
        String location,
        LocalDateTime lostDate,
        boolean isResolved,
        String imageUrl,
        org.mupro.nshakira.user.User reportedBy
) {}
