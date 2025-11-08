package com.moodify.moodify.service;

import com.moodify.moodify.enums.Mood;

public class SadMood extends MoodType{
    public SadMood(){ super(Mood.SAD);}

    @Override
    public String getMessage(){
        return "You are looking Sad. Let's lift your mood with a calm track.";
    }
}
