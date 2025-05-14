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
    public String getRecipes() {
        List<Product> products = productRepository.getAll();

        StringBuilder productList = new StringBuilder();
        for (Product product : products) {
            productList.append(product.getName()).append(", ");
        }

        String prompt = "Podaj 3 krótkie przepisy, które można zrobić z tych składników(PAMIĘTAJ ABY UŻYWAĆ TYLKO TYCH SKLADNIKÓW, zadne inne z poza listy nie sa akceptowalne!!!): " +
                productList.toString();

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

            return messageData.get("content").toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Błąd podczas pobierania przepisów: " + e.getMessage();
        }
    }
}