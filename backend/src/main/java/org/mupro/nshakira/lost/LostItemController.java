package org.mupro.nshakira.lost;

import org.mupro.nshakira.lost.dto.LostItemRequest;
import org.mupro.nshakira.lost.dto.LostItemResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lost-items")
public class LostItemController {

    private final LostItemService lostItemService;

    public LostItemController(LostItemService lostItemService) {
        this.lostItemService = lostItemService;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<LostItemResponse> reportLostItem(
            @ModelAttribute LostItemRequest request,
            Authentication authentication) {
        try {
            LostItemResponse response = lostItemService.reportLostItem(request, authentication);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<LostItemResponse>> getAllLostItems() {
        return ResponseEntity.ok(lostItemService.getAllLostItems());
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<LostItemResponse> getLostItemById(@PathVariable Long id) {
        return ResponseEntity.ok(lostItemService.getLostItemById(id));
    }
}
