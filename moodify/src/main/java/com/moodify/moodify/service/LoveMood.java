package com.moodify.moodify.service;

import com.moodify.moodify.enums.Mood;

public class LoveMood extends MoodType{
    public LoveMood(){
        super(Mood.LOVE);
    }

    @Override
    public String getMessage(){
        return "You are in Love. Let's make you feel it deeper.";
    }
}
