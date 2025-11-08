package com.moodify.moodify.entity;

import com.moodify.moodify.service.MoodType;

import java.util.List;

public class Song {

    private String name;
    private List<MoodType> moods;
    private String link;

    public Song(String name, List<MoodType> moods, String link) {
        this.name = name;
        this.moods = moods;
        this.link = link;
    }

    public String getName() {
        return name;
    }

    public List<MoodType> getMoods() {
        return moods;
    }

    public String getLink() {
        return link;
    }
}
