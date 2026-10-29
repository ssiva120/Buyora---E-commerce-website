package com.buyora.service;

import com.buyora.dto.AddToCartRequest;
import com.buyora.dto.CartDTO;
import com.buyora.dto.CartItemDTO;
import com.buyora.exception.BadRequestException;
import com.buyora.exception.ResourceNotFoundException;
import com.buyora.model.Cart;
import com.buyora.model.CartItem;
import com.buyora.model.Product;
import com.buyora.model.User;
import com.buyora.repository.CartItemRepository;
import com.buyora.repository.CartRepository;
import com.buyora.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    @Transactional(readOnly = true)
    public CartDTO getCartDTO() {
        User user = authService.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        return mapToDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(AddToCartRequest request) {
        User user = authService.getCurrentUser();
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Not enough stock available. Available: " + product.getStockQuantity());
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQuantity) {
                throw new BadRequestException("Cannot add more items than available stock (" + product.getStockQuantity() + ")");
            }
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(cart, product, request.getQuantity());
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return mapToDTO(cart);
    }

    @Transactional
    public CartDTO updateItemQuantity(Long itemId, Integer quantity) {
        if (quantity <= 0) {
            return removeItem(itemId);
        }

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (item.getProduct().getStockQuantity() < quantity) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + item.getProduct().getStockQuantity() + ")");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return mapToDTO(item.getCart());
    }

    @Transactional
    public CartDTO removeItem(Long itemId) {
        User user = authService.getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return mapToDTO(cart);
    }

    @Transactional
    public void clearCart(Cart cart) {
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public CartDTO mapToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());

        List<CartItemDTO> itemDTOs = new ArrayList<>();
        double total = 0.0;
        int totalItems = 0;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                CartItemDTO itemDTO = new CartItemDTO();
                itemDTO.setId(item.getId());
                itemDTO.setProductId(item.getProduct().getId());
                itemDTO.setProductName(item.getProduct().getName());
                itemDTO.setProductImageUrl(item.getProduct().getImageUrl());
                itemDTO.setPrice(item.getProduct().getPrice());
                itemDTO.setQuantity(item.getQuantity());
                itemDTO.setStockQuantity(item.getProduct().getStockQuantity());
                
                double subTotal = item.getProduct().getPrice() * item.getQuantity();
                itemDTO.setSubTotal(subTotal);

                total += subTotal;
                totalItems += item.getQuantity();
                itemDTOs.add(itemDTO);
            }
        }

        dto.setItems(itemDTOs);
        dto.setTotalAmount(Math.round(total * 100.0) / 100.0);
        dto.setTotalItems(totalItems);
        return dto;
    }
}
