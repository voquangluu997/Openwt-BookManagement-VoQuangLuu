package springtraining.luuquangbookmanagement.pagination.dto;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class PaginationFilterDTO {

    private String search;

    private int page;

    private int limit;

    private String orderBy;

}
