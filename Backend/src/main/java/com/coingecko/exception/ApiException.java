package com.coingecko.exception;

import org.springframework.http.HttpStatus;

/**
 * Exceção base para todas as exceções da API.
 * Responsabilidade: Prover exceção customizada para tratamento centralizado.
 */
public class ApiException extends RuntimeException {
    
    private final String code;
    private final HttpStatus statusCode;
    
    public ApiException(String message, String code, HttpStatus statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
    
    public ApiException(String message, String code, HttpStatus statusCode, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.statusCode = statusCode;
    }
    
    public String getCode() {
        return code;
    }
    
    public HttpStatus getStatusCode() {
        return statusCode;
    }
}
