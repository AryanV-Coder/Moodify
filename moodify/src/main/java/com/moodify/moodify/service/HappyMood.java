package com.moodify.moodify.service;

import com.moodify.moodify.enums.Mood;

public class HappyMood extends MoodType{
    public HappyMood(){
        super(Mood.HAPPY);
    }

    @Override
    public String getMessage(){
        return "You are looking Happy and glowing with positivity! Let's make your day better with music.";
    }
}
