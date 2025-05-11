package pl.ft.FoodTracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    ProductRepository productRepository;


    @GetMapping("")
    public List<Product> getAll() {
        return productRepository.getAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable("id") int id) {
        return productRepository.getById(id);
    }

    @PostMapping("")
    public int add(@RequestBody List<Product> products) {
        return productRepository.save(products);
    }

    @PutMapping("/{id}")
    public int update(@PathVariable("id") int id, @RequestBody Product updatedProduct) {
        Product product = productRepository.getById(id);

        if (product != null) {
            product.setName(updatedProduct.getName());
            product.setExpiryDate(updatedProduct.getExpiryDate());

            productRepository.update(product);

            return 1;
        } else {
            return -1;
        }
    }

    @PatchMapping("/{id}")
    public int partiallyUpdate(@PathVariable("id") int id, @RequestBody Product updatedProduct) {
        Product product = productRepository.getById(id);

        if (product != null) {
            if (updatedProduct.getName() != null) product.setName(updatedProduct.getName());
            if (updatedProduct.getExpiryDate() != null) product.setExpiryDate(updatedProduct.getExpiryDate());

            productRepository.update(product);

            return 1;
        } else {
            return -1;
        }
    }

    @DeleteMapping("/{id}")
    public int delete(@PathVariable("id") int id) {
        return productRepository.delete(id);
    }



}
