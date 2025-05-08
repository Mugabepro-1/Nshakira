package org.mupro.nshakira.token;

import org.mupro.nshakira.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    List<Token> findAllByUser(User user);

    Optional<Token> findByToken(String token);
    List<Token> findAllValidTokenByUser(User user);
}
