package org.mupro.nshakira.lost;

import org.mupro.nshakira.lost.dto.LostItemRequest;
import org.mupro.nshakira.lost.dto.LostItemResponse;
import org.mupro.nshakira.user.User;
import org.mupro.nshakira.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LostItemService {

    private final LostItemRepository repository;
    private final UserRepository userRepository;

    public LostItemService(LostItemRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public LostItemResponse reportLostItem(LostItemRequest request, Authentication authentication) throws IOException {
        String email = authentication.getName();
        User reporter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fileName = null;
        MultipartFile image = request.getImage();
        if (image != null && !image.isEmpty()) {
            fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path path = Paths.get("uploads", fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, image.getBytes());
        }

        LostItem item = new LostItem(
                request.getTitle(),
                request.getDescription(),
                request.getLocation(),
                request.getLostDate(),
                fileName != null ? "/uploads/" + fileName : null
        );
        item.setReportedBy(reporter);

        LostItem saved = repository.save(item);
        return mapToResponse(saved);
    }

    public List<LostItemResponse> getAllLostItems() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public LostItemResponse getLostItemById(Long id) {
        LostItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost item not found with id: " + id));
        return mapToResponse(item);
    }

    private LostItemResponse mapToResponse(LostItem item) {
        return new LostItemResponse(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getLocation(),
                item.getLostDate(),
                item.isResolved(),
                item.getImagePath(),
                item.getReportedBy()
        );
    }

    public void markAsResolved(Long itemId) {
        LostItem item = repository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setResolved(true);
        repository.save(item);
    }
}
