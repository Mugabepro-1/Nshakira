package org.mupro.nshakira.claim;

import org.mupro.nshakira.claim.dto.ClaimRequest;
import org.mupro.nshakira.claim.dto.ClaimResponse;
import org.mupro.nshakira.user.User;
import org.mupro.nshakira.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    public ClaimService(ClaimRepository claimRepository, UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
    }

    public void submitClaim(ClaimRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Claim claim = Claim.builder()
                .itemId(request.itemId())
                .itemType(request.itemType())
                .reason(request.reason())
                .claimer(user)
                .build();

        claimRepository.save(claim);
    }

    public List<ClaimResponse> getPendingClaims() {
        return claimRepository.findByApprovedFalse().stream()
                .map(claim -> new ClaimResponse(
                        claim.getId(),
                        claim.getClaimer().getEmail(),
                        claim.getItemId(),
                        claim.getItemType(),
                        claim.getReason(),
                        claim.isApproved()
                ))
                .collect(Collectors.toList());
    }

    public void approveClaim(Long claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setApproved(true);
        claimRepository.save(claim);
    }
}
