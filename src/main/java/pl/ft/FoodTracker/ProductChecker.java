package pl.ft.FoodTracker;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductChecker {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 8 * * *", zone = "Europe/Warsaw")
    public void checkExpiringProducts() {
        List<Product> expiringSoon = productRepository.getExpiringInNext7Days();

        if (expiringSoon.isEmpty()) {
            System.out.println("brak produktów do sprawdzenia.");
        } else {
            System.out.println("produkty konczace się w ciagu 7 dni:");
            for (Product p : expiringSoon) {
                System.out.println("- " + p.getName() + " → " + p.getExpiryDate());
            }

            // DODANE: wysyłanie maila
            emailService.sendExpiringProductsEmail(expiringSoon);
            System.out.println("email z produktami zostal wyslany.");
        }
    }

    @PostConstruct
    public void runAtStartup() {
        checkExpiringProducts();
    }
}

