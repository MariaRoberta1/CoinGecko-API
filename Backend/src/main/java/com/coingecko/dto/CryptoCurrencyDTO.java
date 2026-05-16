package com.coingecko.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO: CryptoCurrencyDTO
 * Responsabilidade: Transferir dados de criptomoeda para cliente com validação.
 * SOLID - Dependency Inversion: Depende de abstração, não de entidades concretas
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoCurrencyDTO implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @NotBlank(message = "ID não pode estar vazio")
    @Size(min = 1, max = 100, message = "ID deve ter entre 1 e 100 caracteres")
    @JsonProperty("id")
    private String id;
    
    @NotBlank(message = "Símbolo não pode estar vazio")
    @Size(min = 1, max = 10, message = "Símbolo deve ter entre 1 e 10 caracteres")
    @JsonProperty("symbol")
    private String symbol;
    
    @NotBlank(message = "Nome não pode estar vazio")
    @Size(min = 1, max = 100, message = "Nome deve ter entre 1 e 100 caracteres")
    @JsonProperty("name")
    private String name;
    
    @Size(max = 1000, message = "Descrição não pode ter mais de 1000 caracteres")
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("imageUrl")
    private String imageUrl;
    
    @JsonProperty("marketCapRank")
    private Long marketCapRank;
    
    @Valid
    @JsonProperty("price")
    private CryptoPriceDTO price;
    
    @JsonProperty("lastUpdated")
    private LocalDateTime lastUpdated;
}

