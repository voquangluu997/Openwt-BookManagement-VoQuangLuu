package springtraining.luuquangbookmanagement.pagination.dto;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class PaginationResponseDTO {
    private int currentPage;

    private long totalItems;

    private int totalPages;
}
