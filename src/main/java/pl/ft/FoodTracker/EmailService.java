package pl.ft.FoodTracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendExpiringProductsEmail(List<Product> products) {
        String subject = "🕐 Termin ważności Twoich produktów kończy się za 7 dni!";
        StringBuilder text = new StringBuilder("Termin poniższych produktów skończy się w ciągu 7 dni:\n\n");

        for (Product p : products) {
            text.append("- ").append(p.getName())
                    .append(" → ").append(p.getExpiryDate()).append("\n");
        }

        text.append("\nZajrzyj na stronę, aby sprawdzić, co możesz z nich przyrządzić!");

        SimpleMailMessage message = new SimpleMailMessage();
        String to = "zebrowska2137@gmail.com";
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text.toString());
        mailSender.send(message);
    }

}

