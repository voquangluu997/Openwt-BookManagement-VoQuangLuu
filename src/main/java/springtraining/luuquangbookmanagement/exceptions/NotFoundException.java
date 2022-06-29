package springtraining.luuquangbookmanagement.exceptions;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String reason) {
        super(reason);
    }
}
