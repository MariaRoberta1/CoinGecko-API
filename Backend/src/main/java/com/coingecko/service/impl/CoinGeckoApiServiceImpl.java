package com.coingecko.service.impl;

import com.coingecko.dto.CryptoCurrencyDTO;
import com.coingecko.dto.CryptoPriceDTO;
import com.coingecko.exception.ExternalApiException;
import com.coingecko.service.CoinGeckoApiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Implementação: CoinGeckoApiServiceImpl
 * Padrão: Adapter Pattern - adapta CoinGecko API para nossa aplicação
 * Responsabilidade: Consumir dados da API do CoinGecko com tratamento de erros robusto
 * SOLID - Dependency Inversion: Implementa interface CoinGeckoApiService
 */
@Slf4j
@Service
public class CoinGeckoApiServiceImpl implements CoinGeckoApiService {
    
    private static final String COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
    private static final String API_NAME = "CoinGecko";
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Value("${coingecko.api.enabled:true}")
    private boolean apiEnabled;
    
    public CoinGeckoApiServiceImpl(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }
    
    @Override
    public Optional<CryptoCurrencyDTO> getCryptocurrencyData(String cryptoId) {
        try {
            if (!isApiAvailable()) {
                log.warn("CoinGecko API está desabilitada");
                return Optional.empty();
            }
            
            log.debug("Obtendo dados de CoinGecko para: {}", cryptoId);
            
            String url = buildCoinGeckoUrl(cryptoId);
            String response = restTemplate.getForObject(url, String.class);
            
            if (response == null || response.isEmpty()) {
                log.warn("Resposta vazia de CoinGecko para: {}", cryptoId);
                return Optional.empty();
            }
            
            JsonNode rootNode = objectMapper.readTree(response);
            
            if (rootNode.has(cryptoId)) {
                log.debug("Parseando resposta para cripto: {}", cryptoId);
                return parseApiResponse(cryptoId, rootNode.get(cryptoId));
            }
            
            log.warn("Cripto não encontrada em resposta de CoinGecko: {}", cryptoId);
            return Optional.empty();
            
        } catch (RestClientException e) {
            log.error("Erro de conectividade com CoinGecko API para cripto: {}", cryptoId, e);
            throw new ExternalApiException(API_NAME, "Erro ao conectar à API", e);
        } catch (Exception e) {
            log.error("Erro inesperado ao consumir CoinGecko API para cripto: {}", cryptoId, e);
            throw new ExternalApiException(API_NAME, "Erro ao processar resposta", e);
        }
    }
    
    @Override
    public boolean isApiAvailable() {
        return apiEnabled;
    }
    
    private String buildCoinGeckoUrl(String cryptoId) {
        return String.format(
                "%s/simple/price?ids=%s&vs_currencies=usd,eur,brl&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true",
                COINGECKO_API_URL,
                cryptoId.toLowerCase()
        );
    }
    
    private Optional<CryptoCurrencyDTO> parseApiResponse(String cryptoId, JsonNode data) {
        try {
            CryptoCurrencyDTO dto = new CryptoCurrencyDTO();
            dto.setId(cryptoId);
            dto.setLastUpdated(LocalDateTime.now());
            
            CryptoPriceDTO priceDTO = parsePriceData(data);
            dto.setPrice(priceDTO);
            
            log.debug("Cripto parseada com sucesso: {}", cryptoId);
            return Optional.of(dto);
            
        } catch (NumberFormatException e) {
            log.error("Erro ao converter valores numéricos da API para cripto: {}", cryptoId, e);
            throw new ExternalApiException(API_NAME, "Erro ao parsear preços", e);
        } catch (Exception e) {
            log.error("Erro ao parsear resposta da API para cripto: {}", cryptoId, e);
            throw new ExternalApiException(API_NAME, "Erro ao processar dados", e);
        }
    }
    
    private CryptoPriceDTO parsePriceData(JsonNode data) {
        CryptoPriceDTO priceDTO = new CryptoPriceDTO();
        
        priceDTO.setPriceUsd(safeGetBigDecimal(data, "usd"));
        priceDTO.setPriceEur(safeGetBigDecimal(data, "eur"));
        priceDTO.setPriceBrl(safeGetBigDecimal(data, "brl"));
        priceDTO.setMarketCap(safeGetBigDecimal(data, "usd_market_cap"));
        priceDTO.setVolume24hUsd(safeGetBigDecimal(data, "usd_24h_vol"));
        priceDTO.setPriceChangePercentage24h(safeGetBigDecimal(data, "usd_24h_change"));
        priceDTO.setTimestamp(LocalDateTime.now());
        
        return priceDTO;
    }
    
    private BigDecimal safeGetBigDecimal(JsonNode node, String field) {
        try {
            if (node.has(field) && !node.get(field).isNull()) {
                return new BigDecimal(node.get(field).asText());
            }
        } catch (NumberFormatException e) {
            log.warn("Erro ao converter campo '{}' para BigDecimal", field, e);
        }
        return null;
    }
}
