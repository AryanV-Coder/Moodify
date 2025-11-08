package com.moodify.moodify.service;

import com.moodify.moodify.enums.Mood;

public class EnergeticMood extends MoodType{
    public EnergeticMood(){
        super(Mood.ENERGETIC);
    }

    @Override
    public String getMessage(){
        return "You are looking Energetic today. Let's play something that matches your vibe.";
    }
}
