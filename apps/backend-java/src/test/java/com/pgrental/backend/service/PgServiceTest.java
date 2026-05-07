package com.pgrental.backend.service;

import com.pgrental.backend.entity.Pg;
import com.pgrental.backend.repository.PgRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PgServiceTest {

    @Mock
    private PgRepository pgRepository;

    @Mock
    private GoogleMapsService googleMapsService;

    @InjectMocks
    private PgService pgService;

    private Pg testPg;

    @BeforeEach
    void setUp() {
        testPg = Pg.builder()
                .id("1")
                .name("Test PG")
                .lat(28.0)
                .lng(77.0)
                .build();
    }

    @Test
    void getNearbyPgs_ShouldReturnPage() {
        Page<Pg> pgPage = new PageImpl<>(List.of(testPg));
        when(pgRepository.findNearby(anyDouble(), anyDouble(), anyDouble(), any(PageRequest.class)))
                .thenReturn(pgPage);

        Page<Pg> result = pgService.getNearbyPgs(28.0, 77.0, 1, 10);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(pgRepository).findNearby(eq(28.0), eq(77.0), eq(2.0), any(PageRequest.class));
    }

    @Test
    void getPgById_WhenFound_ShouldReturnPg() {
        when(pgRepository.findById("1")).thenReturn(Optional.of(testPg));

        Pg result = pgService.getPgById("1");

        assertNotNull(result);
        assertEquals("Test PG", result.getName());
    }

    @Test
    void getPgById_WhenNotFound_ShouldThrowException() {
        when(pgRepository.findById("invalid")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> pgService.getPgById("invalid"));
    }
}
