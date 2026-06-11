package com.academic.pathway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Academic Pathway Backend Running Successfully 🚀";
    }

    @GetMapping("/health")
    public String health() {
        return "UP";
    }
}