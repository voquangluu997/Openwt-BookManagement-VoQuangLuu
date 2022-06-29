package springtraining.luuquangbookmanagement.exceptions;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Data
@AllArgsConstructor(access = AccessLevel.PUBLIC)
class ErrorModel {
    private String message;
    private String path;
}

public class GlobalControllerExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorModel> handleException(Exception ex, ServletWebRequest request) {
        return new ResponseEntity<>(new ErrorModel(ex.getMessage(), request.getRequest().getRequestURI()), HttpStatus.NOT_FOUND);
    }

}
