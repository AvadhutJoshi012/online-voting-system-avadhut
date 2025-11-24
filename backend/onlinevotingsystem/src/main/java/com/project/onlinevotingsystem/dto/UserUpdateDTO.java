package com.project.onlinevotingsystem.dto;

import com.project.onlinevotingsystem.entity.Gender;
import lombok.Data;

@Data
public class UserUpdateDTO {
    private String email;
    private String password;
    private String phoneNumber;
    private Gender gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String profileImageUrl;
    private String panCardNumber;
    private String passportNumber;
}
