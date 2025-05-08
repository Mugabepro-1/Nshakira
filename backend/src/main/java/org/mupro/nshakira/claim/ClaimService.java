package org.mupro.nshakira.claim;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.mupro.nshakira.claim.dto.ClaimRequest;
import org.mupro.nshakira.claim.dto.ClaimResponse;
import org.mupro.nshakira.user.User;
import org.mupro.nshakira.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
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
                        claim.getId(),
                        claim.getItemName(),
                        claim.getDescription(),
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

    public byte[] generateApprovedClaimsPdf() throws DocumentException, IOException{
        List<Claim> approvedClaims = claimRepository.findByApprovedTrue();

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);

        document.open();

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        Font bodyFont  =FontFactory.getFont(FontFactory.HELVETICA);

        document.add(new Paragraph("Approved claims", headerFont));
        document.add(Chunk.NEWLINE);

        for(Claim claim : approvedClaims){
            document.add(new Paragraph("ID: " + claim.getId(), bodyFont));
            document.add(new Paragraph("Title: " + claim.getItemName(), bodyFont));
            document.add(new Paragraph("Descrition: " + claim.getDescription(), bodyFont));
            document.add(Chunk.NEWLINE);
        }

        document.close();
        return out.toByteArray();
    }
}
