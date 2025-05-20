package pl.ft.FoodTracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<Product> getAll() {
        return jdbcTemplate.query(
                "SELECT id, name, expiry_date FROM product ORDER BY id",
                BeanPropertyRowMapper.newInstance(Product.class)
        );
    }

    public Product getById(int id) {
        return jdbcTemplate.queryForObject(
                "SELECT id, name, expiry_date FROM product WHERE id = ?",
                BeanPropertyRowMapper.newInstance(Product.class),
                id
        );
    }

    public int save(List<Product> products) {
        products.forEach(product -> jdbcTemplate.update(
                "INSERT INTO product(name, expiry_date) VALUES(?, ?)",
                product.getName(),
                product.getExpiryDate()
        ));
        return 1;
    }

    public int update(Product product) {
        return jdbcTemplate.update(
                "UPDATE product SET name = ?, expiry_date = ? WHERE id = ?",
                product.getName(),
                product.getExpiryDate(),
                product.getId()
        );
    }

    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM product WHERE id = ?", id);
    }
}
