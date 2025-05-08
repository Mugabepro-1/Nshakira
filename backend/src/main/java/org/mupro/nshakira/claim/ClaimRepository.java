package org.mupro.nshakira.claim;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByApprovedFalse();

    List<Claim> findByApprovedTrue();
}
