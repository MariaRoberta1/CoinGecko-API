package com.coingecko.exception;

import org.springframework.http.HttpStatus;

/**
 * Exceção para erro interno do servidor.
 * Responsabilidade: Indicar erro inesperado na aplicação.
 * Retorna: HTTP 500 INTERNAL_SERVER_ERROR
 */
public class InternalServerException extends ApiException {
    
    public InternalServerException(String message) {
        super(message, "INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    public InternalServerException(String message, Throwable cause) {
        super(message, "INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }
}
