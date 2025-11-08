package com.moodify.moodify.controller;

import com.moodify.moodify.service.AIServiceClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MoodifyController {

    @Autowired
    private AIServiceClient aiServiceClient;

    @PostMapping("/analyse")
    public String analyse(@RequestParam("image") MultipartFile image) {
        try {
            byte[] imageBytes = image.getBytes();
            String fileName = image.getOriginalFilename();
            System.out.println("✅ Image received successfully, size : " + imageBytes.length + " bytes, " + "filename : " + fileName);

            String mood = aiServiceClient.getMoodFromImage(imageBytes, fileName);
            System.out.println("RESPONSE FROM FASTAPI : " + mood);

            return mood;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing image: " + e.getMessage();
        }
    }
}
