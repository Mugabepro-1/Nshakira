package org.mupro.nshakira.found;

import org.mupro.nshakira.found.dto.FoundItemRequest;
import org.mupro.nshakira.found.dto.FoundItemResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/found-items")
public class FoundItemController {

    private final FoundItemService foundItemService;

    public FoundItemController(FoundItemService foundItemService) {
        this.foundItemService = foundItemService;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<FoundItemResponse> reportFoundItem(
            @ModelAttribute FoundItemRequest request,
            Authentication authentication) {
        try {
            FoundItemResponse response = foundItemService.reportFoundItem(request, authentication);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<FoundItemResponse>> getAllFoundItems() {
        return ResponseEntity.ok(foundItemService.getAllFoundItems());
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<FoundItemResponse> getFoundItemById(@PathVariable Long id) {
        return ResponseEntity.ok(foundItemService.getFoundItemById(id));
    }
}
