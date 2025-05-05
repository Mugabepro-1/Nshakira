package org.mupro.nshakira.found;

import org.mupro.nshakira.found.dto.FoundItemRequest;
import org.mupro.nshakira.found.dto.FoundItemResponse;
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
public class FoundItemService {

    private final FoundItemRepository repository;
    private final UserRepository userRepository;

    public FoundItemService(FoundItemRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public FoundItemResponse reportFoundItem(FoundItemRequest request, Authentication authentication) throws IOException {
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

        FoundItem item = new FoundItem(
                request.getTitle(),
                request.getDescription(),
                request.getLocation(),
                request.getFoundDate(),
                fileName != null ? "/uploads/" + fileName : null
        );
        item.setReportedBy(reporter);

        FoundItem saved = repository.save(item);
        return mapToResponse(saved);
    }

    public List<FoundItemResponse> getAllFoundItems() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FoundItemResponse getFoundItemById(Long id) {
        FoundItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Found item not found with id: " + id));
        return mapToResponse(item);
    }

    private FoundItemResponse mapToResponse(FoundItem item) {
        return new FoundItemResponse(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getLocation(),
                item.getFoundDate(),
                item.isReturned(),
                item.getFilePath(),
                item.getReportedBy()
        );
    }


    public void markAsReturned(Long itemId) {
        FoundItem item = repository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setReturned(true);
        repository.save(item);
    }
}


