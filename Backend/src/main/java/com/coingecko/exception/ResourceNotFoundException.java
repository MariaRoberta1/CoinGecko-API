package com.coingecko.exception;

import org.springframework.http.HttpStatus;

/**
 * Exceção para recursos não encontrados.
 * Responsabilidade: Indicar quando um recurso solicitado não existe.
 * Retorna: HTTP 404 NOT_FOUND
 */
public class ResourceNotFoundException extends ApiException {
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(
            String.format("%s não encontrado com %s: '%s'", resourceName, fieldName, fieldValue),
            "RESOURCE_NOT_FOUND",
            HttpStatus.NOT_FOUND
        );
    }
    
    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND", HttpStatus.NOT_FOUND);
    }
}
