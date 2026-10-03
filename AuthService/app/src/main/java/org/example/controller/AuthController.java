package org.example.controller;

import lombok.AllArgsConstructor;
import org.example.entities.RefreshTokens;
import org.example.model.UserInfoDto;
import org.example.response.JwtResponseDto;
import org.example.service.JwtService;
import org.example.service.RefreshTokenService;
import org.example.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
public class AuthController {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("auth/v1/signup")
    public ResponseEntity SignUp(@RequestBody UserInfoDto userInfoDto){
        try{
            if (userInfoDto == null || userInfoDto.getUserName() == null || userInfoDto.getUserName().trim().isEmpty()) {
                return new ResponseEntity<>("Username is required", HttpStatus.BAD_REQUEST);
            }
            if (userInfoDto.getPassword() == null || userInfoDto.getPassword().trim().isEmpty()) {
                return new ResponseEntity<>("Password is required", HttpStatus.BAD_REQUEST);
            }
            Boolean isSignUped = userDetailsService.signUpUser(userInfoDto);
            if(Boolean.FALSE.equals(isSignUped)){
                return new ResponseEntity<>("Already Exist", HttpStatus.BAD_REQUEST);
            }
            RefreshTokens refreshToken = refreshTokenService.createRefreshToken(userInfoDto.getUserName());
            String jwtToken = jwtService.GenerateToken(userInfoDto.getUserName());
            return new ResponseEntity<>(JwtResponseDto.builder().accessToken(jwtToken).
                    token(refreshToken.getToken()).build(), HttpStatus.OK);
        }catch (Exception ex){
            ex.printStackTrace();
            return new ResponseEntity<>("Exception in User Service: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
