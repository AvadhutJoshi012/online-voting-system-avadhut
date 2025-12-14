package com.project.onlinevotingsystem.dto;

import com.project.onlinevotingsystem.entity.Gender;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String aadharNumber;
    private String voterIdNumber;
    private String profileImageUrl;
}
