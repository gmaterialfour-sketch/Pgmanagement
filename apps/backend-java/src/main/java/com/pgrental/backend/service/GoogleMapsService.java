package com.pgrental.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleMapsService {

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${google.maps.api.key:}")
    private String apiKey;

    private static final String PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place";
    private static final String GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

    public Mono<List<Map<String, Object>>> searchNearby(double lat, double lng, String keyword) {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Google Maps API Key is missing. Skipping external search.");
            return Mono.just(new ArrayList<>());
        }

        return webClientBuilder.build()
                .get()
                .uri(PLACES_BASE_URL + "/nearbysearch/json?location=" + lat + "," + lng +
                        "&radius=2000&type=lodging&keyword=" + keyword + "&key=" + apiKey)
                .retrieve()
                .bodyToMono(String.class)
                .map(this::parsePlacesResponse);
    }

    public Mono<Map<String, Object>> getPlaceDetails(String placeId) {
        if (apiKey == null || apiKey.isEmpty()) return Mono.just(new HashMap<>());

        return webClientBuilder.build()
                .get()
                .uri(PLACES_BASE_URL + "/details/json?place_id=" + placeId + "&fields=name,rating,formatted_phone_number,website,reviews,geometry&key=" + apiKey)
                .retrieve()
                .bodyToMono(String.class)
                .map(this::parseDetailsResponse);
    }

    private List<Map<String, Object>> parsePlacesResponse(String response) {
        List<Map<String, Object>> results = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode resultsNode = root.get("results");
            if (resultsNode != null && resultsNode.isArray()) {
                for (JsonNode node : resultsNode) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", node.get("name").asText());
                    map.put("placeId", node.get("place_id").asText());
                    map.put("address", node.get("vicinity").asText());
                    map.put("rating", node.has("rating") ? node.get("rating").asDouble() : 0.0);
                    if (node.has("geometry") && node.get("geometry").has("location")) {
                        map.put("lat", node.get("geometry").get("location").get("lat").asDouble());
                        map.put("lng", node.get("geometry").get("location").get("lng").asDouble());
                    }
                    results.add(map);
                }
            }
        } catch (Exception e) {
            log.error("Error parsing Google Places response", e);
        }
        return results;
    }

    private Map<String, Object> parseDetailsResponse(String response) {
        Map<String, Object> result = new HashMap<>();
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode resultNode = root.get("result");
            if (resultNode != null) {
                result.put("name", resultNode.get("name").asText());
                result.put("phone", resultNode.has("formatted_phone_number") ? resultNode.get("formatted_phone_number").asText() : null);
                result.put("website", resultNode.has("website") ? resultNode.get("website").asText() : null);
                result.put("rating", resultNode.has("rating") ? resultNode.get("rating").asDouble() : 0.0);
                
                List<Map<String, Object>> reviews = new ArrayList<>();
                if (resultNode.has("reviews")) {
                    for (JsonNode reviewNode : resultNode.get("reviews")) {
                        Map<String, Object> r = new HashMap<>();
                        r.put("author", reviewNode.get("author_name").asText());
                        r.put("rating", reviewNode.get("rating").asInt());
                        r.put("text", reviewNode.get("text").asText());
                        r.put("time", reviewNode.get("relative_time_description").asText());
                        reviews.add(r);
                    }
                }
                result.put("reviews", reviews);
            }
        } catch (Exception e) {
            log.error("Error parsing Google Details response", e);
        }
        return result;
    }
}
