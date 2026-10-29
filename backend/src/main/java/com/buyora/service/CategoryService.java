package com.buyora.service;

import com.buyora.dto.CategoryDTO;
import com.buyora.exception.BadRequestException;
import com.buyora.exception.ResourceNotFoundException;
import com.buyora.model.Category;
import com.buyora.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return mapToDTO(category);
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        String slug = dto.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");
        if (categoryRepository.existsBySlug(slug)) {
            throw new BadRequestException("Category already exists with name: " + dto.getName());
        }

        Category category = new Category(dto.getName(), slug, dto.getDescription(), dto.getImageUrl());
        Category saved = categoryRepository.save(category);
        return mapToDTO(saved);
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setImageUrl(dto.getImageUrl());

        Category updated = categoryRepository.save(category);
        return mapToDTO(updated);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO mapToDTO(Category c) {
        return new CategoryDTO(c.getId(), c.getName(), c.getSlug(), c.getDescription(), c.getImageUrl());
    }
}
