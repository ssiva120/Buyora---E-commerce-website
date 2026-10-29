package com.buyora.dto;

import java.util.ArrayList;
import java.util.List;

public class CartDTO {
    private Long id;
    private List<CartItemDTO> items = new ArrayList<>();
    private Double totalAmount = 0.0;
    private Integer totalItems = 0;

    public CartDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<CartItemDTO> getItems() { return items; }
    public void setItems(List<CartItemDTO> items) { this.items = items; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }
}
