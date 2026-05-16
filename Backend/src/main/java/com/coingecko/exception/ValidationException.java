package com.coingecko.exception;

import org.springframework.http.HttpStatus;

/**
 * Exceção para erros de validação.
 * Responsabilidade: Indicar quando dados enviados não são válidos.
 * Retorna: HTTP 400 BAD_REQUEST
 */
public class ValidationException extends ApiException {
    
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST);
    }
    
    public ValidationException(String fieldName, String message) {
        super(
            String.format("Campo '%s': %s", fieldName, message),
            "VALIDATION_ERROR",
            HttpStatus.BAD_REQUEST
        );
    }
}
