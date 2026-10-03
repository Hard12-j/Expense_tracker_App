package com.example.user.consumer;

import com.example.user.entities.UserInfo;
import com.example.user.entities.UserInfoDto;
import com.example.user.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import com.example.user.repository.UserRepository;

import org.springframework.stereotype.Component;

@Component
public class AuthServiceConsumer {

    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @KafkaListener(topics = "${spring.kafka.topic.name}", groupId = "${spring.kafka.consumer.group-id}")
    public void listen(UserInfoDto eventData){
        try{
            //Todo: make it transactional to handle idempotency and validate email, phoneNumber etc. can use redis distributed lock
            userService.createOrUpdateUser(eventData);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println("AuthSericeConsumer: exception is thrown while consuming kafka event");
        }
    }
}
