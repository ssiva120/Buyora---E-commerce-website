package com.buyora;

import com.buyora.model.Category;
import com.buyora.model.Product;
import com.buyora.model.Role;
import com.buyora.model.User;
import com.buyora.repository.CategoryRepository;
import com.buyora.repository.ProductRepository;
import com.buyora.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BuyoraApplication {

    public static void main(String[] args) {
        SpringApplication.run(BuyoraApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository,
                                          CategoryRepository categoryRepository,
                                          ProductRepository productRepository,
                                          PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                // 1. Seed Admin User
                User admin = new User(
                        "admin@buyora.com",
                        passwordEncoder.encode("admin123"),
                        "BuyOra Administrator",
                        "+1-800-BUYORA",
                        "100 Tech Park, Silicon Valley, CA",
                        Role.ROLE_ADMIN
                );
                userRepository.save(admin);

                // 2. Seed Demo Customer User
                User customer = new User(
                        "john@example.com",
                        passwordEncoder.encode("password123"),
                        "John Doe",
                        "+1-555-0199",
                        "456 Elm Street, New York, NY",
                        Role.ROLE_CUSTOMER
                );
                userRepository.save(customer);

                // 3. Seed Categories
                Category electronics = new Category("Electronics", "electronics", "Laptops, smart gadgets, audio, and accessories", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80");
                Category fashion = new Category("Fashion", "fashion", "Trendy clothing, footwear, and stylish essentials", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80");
                Category home = new Category("Home & Kitchen", "home-kitchen", "Premium cookware, decor, and smart home items", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80");
                Category books = new Category("Books", "books", "Bestselling novels, programming guides, and non-fiction", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80");

                categoryRepository.save(electronics);
                categoryRepository.save(fashion);
                categoryRepository.save(home);
                categoryRepository.save(books);

                // 4. Seed Products
                // Electronics
                Product p1 = new Product(
                        "AeroBook Pro 15",
                        "High performance 15.6-inch laptop with 16GB RAM, 512GB SSD, and all-day battery life.",
                        999.99,
                        25,
                        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
                        "AeroTech",
                        electronics
                );
                p1.setRating(4.8);
                p1.setReviewCount(128);

                Product p2 = new Product(
                        "Pulse ANC Wireless Headphones",
                        "Active noise-cancelling over-ear headphones with 40-hour playtime and deep bass sound.",
                        149.99,
                        40,
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
                        "PulseSound",
                        electronics
                );
                p2.setRating(4.6);
                p2.setReviewCount(94);

                Product p3 = new Product(
                        "SmartFit V3 Fitness Smartwatch",
                        "Track heart rate, SpO2, sleep stages, and GPS workouts with water-resistant casing.",
                        79.99,
                        50,
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
                        "SmartFit",
                        electronics
                );
                p3.setRating(4.5);
                p3.setReviewCount(62);

                // Fashion
                Product p4 = new Product(
                        "Classic Denim Jacket",
                        "Vintage washed premium cotton denim jacket with durable buttons and comfortable fit.",
                        69.99,
                        30,
                        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
                        "UrbanStyle",
                        fashion
                );
                p4.setRating(4.4);
                p4.setReviewCount(45);

                Product p5 = new Product(
                        "Minimalist Canvas Sneakers",
                        "Lightweight breathable casual sneakers perfect for everyday walking and casual outings.",
                        49.99,
                        35,
                        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
                        "SoleCraft",
                        fashion
                );
                p5.setRating(4.7);
                p5.setReviewCount(88);

                // Home
                Product p6 = new Product(
                        "Barista Pour-Over Coffee Maker",
                        "Handcrafted glass carafe with permanent stainless steel filter for rich, aromatic brew.",
                        34.99,
                        20,
                        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80",
                        "BrewMaster",
                        home
                );
                p6.setRating(4.9);
                p6.setReviewCount(110);

                Product p7 = new Product(
                        "Aromatherapy Ceramic Diffuser",
                        "Ultrasonic essential oil diffuser with 7 ambient LED colors and auto-shutoff timer.",
                        29.99,
                        45,
                        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
                        "ZenLiving",
                        home
                );
                p7.setRating(4.3);
                p7.setReviewCount(31);

                // Books
                Product p8 = new Product(
                        "Clean Code & Architecture Guide",
                        "Comprehensive handbook of agile software craft, refactoring techniques, and design patterns.",
                        39.99,
                        60,
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
                        "TechPress",
                        books
                );
                p8.setRating(4.9);
                p8.setReviewCount(215);

                productRepository.save(p1);
                productRepository.save(p2);
                productRepository.save(p3);
                productRepository.save(p4);
                productRepository.save(p5);
                productRepository.save(p6);
                productRepository.save(p7);
                productRepository.save(p8);

                System.out.println(">>> BuyOra: Seed data initialized successfully!");
                System.out.println(">>> Admin Account: admin@buyora.com / admin123");
                System.out.println(">>> Customer Account: john@example.com / password123");
            }
        };
    }
}
