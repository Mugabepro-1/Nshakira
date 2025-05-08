package org.mupro.nshakira.claim;


import com.itextpdf.text.DocumentException;
import org.mupro.nshakira.claim.dto.ClaimRequest;
import org.mupro.nshakira.claim.dto.ClaimResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/submit")
    public ResponseEntity<String> submitClaim(@RequestBody ClaimRequest request) {
        claimService.submitClaim(request);
        return ResponseEntity.ok("Claim submitted successfully.");
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ClaimResponse>> getPendingClaims() {
        return ResponseEntity.ok(claimService.getPendingClaims());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveClaim(@PathVariable Long id) {
        claimService.approveClaim(id);
        return ResponseEntity.ok("Claim approved.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/approved/pdf")
    public ResponseEntity<byte[]> downloadApprovedClaimsPdf() throws DocumentException, IOException {
        byte[] pdf = claimService.generateApprovedClaimsPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "approved_claims.pdf");

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

}