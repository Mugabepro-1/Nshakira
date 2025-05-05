package org.mupro.nshakira.claim;


import org.mupro.nshakira.claim.dto.ClaimRequest;
import org.mupro.nshakira.claim.dto.ClaimResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitClaim(@RequestBody ClaimRequest request) {
        claimService.submitClaim(request);
        return ResponseEntity.ok("Claim submitted successfully.");
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ClaimResponse>> getPendingClaims() {
        return ResponseEntity.ok(claimService.getPendingClaims());
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveClaim(@PathVariable Long id) {
        claimService.approveClaim(id);
        return ResponseEntity.ok("Claim approved.");
    }
}