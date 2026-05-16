package com.coingecko;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Classe Principal: CoinGeckoApplication
 * Responsabilidade: Iniciar aplicação Spring Boot com cache habilitado.
 */
@SpringBootApplication
@EnableCaching
public class CoinGeckoApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(CoinGeckoApplication.class, args);
    }
}
