package com.coingecko.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.DecimalMin;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO: CryptoPriceDTO
 * Responsabilidade: Transportar dados de preço com validação.
 * SOLID - Single Responsibility: Apenas transporta dados de preço validados
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoPriceDTO implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço USD deve ser maior que zero")
    @JsonProperty("priceUsd")
    private BigDecimal priceUsd;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço EUR deve ser maior que zero")
    @JsonProperty("priceEur")
    private BigDecimal priceEur;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço BRL deve ser maior que zero")
    @JsonProperty("priceBrl")
    private BigDecimal priceBrl;
    
    @DecimalMin(value = "0.0", message = "Volume 24h deve ser não-negativo")
    @JsonProperty("volume24hUsd")
    private BigDecimal volume24hUsd;
    
    @JsonProperty("priceChangePercentage24h")
    private BigDecimal priceChangePercentage24h;
    
    @DecimalMin(value = "0.0", message = "Market cap deve ser não-negativo")
    @JsonProperty("marketCap")
    private BigDecimal marketCap;
    
    @JsonProperty("timestamp")
    private LocalDateTime timestamp;
}

