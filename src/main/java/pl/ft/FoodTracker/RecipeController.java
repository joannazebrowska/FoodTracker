package pl.ft.FoodTracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/recipes")
@CrossOrigin(origins = "*")
public class RecipeController {

    @Autowired
    private ProductRepository productRepository;

    @Value("${groq.api.key}")
    private String apiKey;

    private final String API_URL = "https://api.groq.com/openai/v1/chat/completions";

    @GetMapping("")
    public ResponseEntity<Map<String, String>> getRecipes() {
        List<Product> products = productRepository.getAll();

        StringBuilder productList = new StringBuilder();
        for (Product product : products) {
            productList.append(product.getName()).append(", ");
        }

        String prompt = "Podaj dokładnie 3 krótkie przepisy kulinarne, używając wyłącznie następujących składników (każdy z poza listy jest niedozwolony!): " +
                productList.toString() +
                ". Zwróć wynik w następującym formacie, bez numerowania i bez dodatkowych komentarzy:\n\n" +
                "===\nTytuł przepisu 1\nSkładniki i sposób przygotowania...\n===\nTytuł przepisu 2\nSkładniki i sposób przygotowania...\n===\nTytuł przepisu 3\nSkładniki i sposób przygotowania...\n\n" +
                "Nie dodawaj żadnych dodatkowych informacji, tylko 3 przepisy w takim formacie jak powyżej.";


        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "meta-llama/llama-4-scout-17b-16e-instruct");
        requestBody.put("messages", List.of(message));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(API_URL, entity, Map.class);

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            Map<String, Object> messageData = (Map<String, Object>) choices.get(0).get("message");
            String content = messageData.get("content").toString();

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("recipes", content);

            return ResponseEntity
                    .ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(responseBody);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Błąd podczas pobierania przepisów: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
