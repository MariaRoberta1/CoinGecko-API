package com.coingecko.service.impl;

import com.coingecko.dto.CryptoCurrencyDTO;
import com.coingecko.exception.ResourceNotFoundException;
import com.coingecko.model.Cryptocurrency;
import com.coingecko.model.CryptoCurrencyPrice;
import com.coingecko.repository.CryptocurrencyRepository;
import com.coingecko.repository.CryptoCurrencyPriceRepository;
import com.coingecko.service.CoinGeckoApiService;
import com.coingecko.service.CryptoCurrencyService;
import com.coingecko.service.DtoMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementação: CryptoCurrencyServiceImpl
 * Padrão: Service Pattern - encapsula a lógica de negócio
 * Responsabilidade: Gerenciar operações com criptomoedas com cache e validações
 * SOLID - Dependency Injection: Recebe dependências via construtor
 * SOLID - Single Responsibility: Apenas gerencia criptomoedas
 */
@Slf4j
@Service
@Transactional
public class CryptoCurrencyServiceImpl implements CryptoCurrencyService {
    
    private final CryptocurrencyRepository cryptoRepository;
    private final CryptoCurrencyPriceRepository priceRepository;
    private final CoinGeckoApiService coinGeckoApiService;
    private final DtoMapper dtoMapper;
    
    public CryptoCurrencyServiceImpl(
            CryptocurrencyRepository cryptoRepository,
            CryptoCurrencyPriceRepository priceRepository,
            CoinGeckoApiService coinGeckoApiService,
            DtoMapper dtoMapper) {
        this.cryptoRepository = cryptoRepository;
        this.priceRepository = priceRepository;
        this.coinGeckoApiService = coinGeckoApiService;
        this.dtoMapper = dtoMapper;
    }
    
    @Override
    @Cacheable(value = "cryptos", key = "#id")
    public Optional<CryptoCurrencyDTO> findById(String id) {
        log.debug("Buscando cripto por ID: {}", id);
        return cryptoRepository.findById(id)
                .map(dtoMapper::toDTO);
    }
    
    @Override
    @Cacheable(value = "cryptosBySymbol", key = "#symbol")
    public Optional<CryptoCurrencyDTO> findBySymbol(String symbol) {
        log.debug("Buscando cripto por símbolo: {}", symbol);
        return cryptoRepository.findBySymbol(symbol)
                .map(dtoMapper::toDTO);
    }
    
    @Override
    @Cacheable(value = "allCryptos")
    public List<CryptoCurrencyDTO> findAll() {
        log.debug("Listando todas as criptomoedas");
        return cryptoRepository.findAll()
                .stream()
                .map(dtoMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<CryptoCurrencyDTO> searchBySymbol(String symbol) {
        log.debug("Buscando criptos com símbolo: {}", symbol);
        return cryptoRepository.findBySymbolContainingIgnoreCase(symbol)
                .stream()
                .map(dtoMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Cacheable(value = "topCryptos")
    public List<CryptoCurrencyDTO> getTopCryptos() {
        log.debug("Obtendo top 10 criptomoedas");
        return cryptoRepository.findByOrderByMarketCapRankAsc()
                .stream()
                .limit(10)
                .map(dtoMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @CacheEvict(value = {"allCryptos", "topCryptos"}, allEntries = true)
    public CryptoCurrencyDTO save(CryptoCurrencyDTO cryptoDTO) {
        log.info("Salvando criptomoeda: {}", cryptoDTO.getId());
        
        Cryptocurrency crypto = dtoMapper.toEntity(cryptoDTO);
        crypto.setLastUpdated(LocalDateTime.now());
        
        Cryptocurrency saved = cryptoRepository.save(crypto);
        
        if (cryptoDTO.getPrice() != null) {
            saveCryptoPrice(saved, cryptoDTO);
        }
        
        return dtoMapper.toDTO(saved);
    }
    
    @Override
    @CacheEvict(value = {"cryptos", "cryptosBySymbol", "allCryptos", "topCryptos"}, allEntries = true)
    public void delete(String id) {
        log.info("Deletando criptomoeda: {}", id);
        if (!cryptoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Criptomoeda", "ID", id);
        }
        cryptoRepository.deleteById(id);
    }
    
    @Override
    @CacheEvict(value = {"cryptos", "cryptosBySymbol", "allCryptos", "topCryptos"}, allEntries = true)
    public void updateFromCoinGecko(String id) {
        log.info("Atualizando criptomoeda de CoinGecko: {}", id);
        
        Optional<CryptoCurrencyDTO> apiData = coinGeckoApiService.getCryptocurrencyData(id);
        
        if (apiData.isPresent()) {
            CryptoCurrencyDTO dto = apiData.get();
            Cryptocurrency existing = cryptoRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Criptomoeda", "ID", id));
            
            existing.setLastUpdated(LocalDateTime.now());
            
            if (dto.getPrice() != null) {
                priceRepository.findByCryptocurrency_Id(id)
                        .ifPresentOrElse(
                                price -> updateCryptoPrice(price, dto),
                                () -> saveCryptoPriceFromDTO(existing, dto)
                        );
            }
            
            cryptoRepository.save(existing);
            log.info("Atualizado dados de cripto: {}", id);
        } else {
            log.warn("Dados não encontrados na API CoinGecko para: {}", id);
        }
    }
    
    private void saveCryptoPrice(Cryptocurrency crypto, CryptoCurrencyDTO dto) {
        CryptoCurrencyPrice price = new CryptoCurrencyPrice();
        price.setCryptocurrency(crypto);
        price.setPriceUsd(dto.getPrice().getPriceUsd());
        price.setPriceEur(dto.getPrice().getPriceEur());
        price.setPriceBrl(dto.getPrice().getPriceBrl());
        price.setVolume24hUsd(dto.getPrice().getVolume24hUsd());
        price.setPriceChangePercentage24h(dto.getPrice().getPriceChangePercentage24h());
        price.setMarketCap(dto.getPrice().getMarketCap());
        price.setTimestamp(LocalDateTime.now());
        
        priceRepository.save(price);
        log.debug("Preço salvo para cripto: {}", crypto.getId());
    }
    
    private void saveCryptoPriceFromDTO(Cryptocurrency crypto, CryptoCurrencyDTO dto) {
        CryptoCurrencyPrice price = new CryptoCurrencyPrice();
        price.setCryptocurrency(crypto);
        price.setPriceUsd(dto.getPrice().getPriceUsd());
        price.setPriceEur(dto.getPrice().getPriceEur());
        price.setPriceBrl(dto.getPrice().getPriceBrl());
        price.setVolume24hUsd(dto.getPrice().getVolume24hUsd());
        price.setPriceChangePercentage24h(dto.getPrice().getPriceChangePercentage24h());
        price.setMarketCap(dto.getPrice().getMarketCap());
        price.setTimestamp(LocalDateTime.now());
        
        priceRepository.save(price);
        log.debug("Preço inicial salvo para cripto: {}", crypto.getId());
    }
    
    private void updateCryptoPrice(CryptoCurrencyPrice price, CryptoCurrencyDTO dto) {
        price.setPriceUsd(dto.getPrice().getPriceUsd());
        price.setPriceEur(dto.getPrice().getPriceEur());
        price.setPriceBrl(dto.getPrice().getPriceBrl());
        price.setVolume24hUsd(dto.getPrice().getVolume24hUsd());
        price.setPriceChangePercentage24h(dto.getPrice().getPriceChangePercentage24h());
        price.setMarketCap(dto.getPrice().getMarketCap());
        price.setTimestamp(LocalDateTime.now());
        
        priceRepository.save(price);
        log.debug("Preço atualizado para cripto: {}", price.getCryptocurrency().getId());
    }
}
