package com.coingecko.exception;

import org.springframework.http.HttpStatus;

/**
 * Exceção para erro na API externa (CoinGecko).
 * Responsabilidade: Indicar quando chamada à API externa falha.
 * Retorna: HTTP 503 SERVICE_UNAVAILABLE
 */
public class ExternalApiException extends ApiException {
    
    public ExternalApiException(String apiName, String message) {
        super(
            String.format("Erro na API externa %s: %s", apiName, message),
            "EXTERNAL_API_ERROR",
            HttpStatus.SERVICE_UNAVAILABLE
        );
    }
    
    public ExternalApiException(String apiName, String message, Throwable cause) {
        super(
            String.format("Erro na API externa %s: %s", apiName, message),
            "EXTERNAL_API_ERROR",
            HttpStatus.SERVICE_UNAVAILABLE,
            cause
        );
    }
}
