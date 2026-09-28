package com.example.reliefcamp.Exception;

public class CampCapacityExceededException extends RuntimeException {

    public CampCapacityExceededException(String message) {
        super(message);
    }
}