package org.example.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.entities.UserInfo;
import org.example.eventProducer.UserInfoEvent;
import org.example.eventProducer.UserInfoProducer;
import org.example.model.UserInfoDto;
import org.example.respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Component
@Data
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final UserInfoProducer userInfoProducer;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserInfo user = userRepository.findByUserName(username);
        if(user == null){
            throw new UsernameNotFoundException("could not found user...!!");
        }
        return new CustomUserDetails(user);
    }

    public String getUserByUsername(String userName){
        return Optional.of(userRepository.findByUserName(userName)).map(UserInfo::getUserId).orElse(null);
    }

    public UserInfo checkIfUserAlreaadyExists(UserInfoDto userInfoDto){
        if (userInfoDto == null || userInfoDto.getUserName() == null || userInfoDto.getUserName().trim().isEmpty()) {
            return null;
        }
        return userRepository.findByUserName(userInfoDto.getUserName());
    }

    public Boolean signUpUser(UserInfoDto userInfoDto){
        if (userInfoDto == null || userInfoDto.getUserName() == null || userInfoDto.getUserName().trim().isEmpty() ||
                userInfoDto.getPassword() == null || userInfoDto.getPassword().trim().isEmpty()) {
            return false;
        }
        if(Objects.nonNull(checkIfUserAlreaadyExists(userInfoDto))){
            return false;
        }
        userInfoDto.setPassword(passwordEncoder.encode(userInfoDto.getPassword()));
        String userId = UUID.randomUUID().toString();
        userRepository.save(new UserInfo(userId, userInfoDto.getUserName(), userInfoDto.getPassword(), new HashSet<>()));
        userInfoProducer.sendEventToKafka(userInfoEventToPublish(userInfoDto, userId));
        return true;
    }

    private UserInfoEvent userInfoEventToPublish(UserInfoDto userInfoDto, String userId){
        return UserInfoEvent.builder()
                .userId(userId)
                .firstName(userInfoDto.getFirstName())
                .lastName(userInfoDto.getLastName())
                .email(userInfoDto.getEmail())
                .phoneNumber(userInfoDto.getPhoneNumber())
                .build();
    }
}
