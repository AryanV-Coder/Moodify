package com.moodify.moodify.service;

import com.moodify.moodify.enums.Mood;

public abstract class MoodType {
    private Mood mood;

    public MoodType(Mood mood){
        this.mood = mood;
    }

    public Mood getMood(){
        return mood;
    }

    public abstract String getMessage();
}