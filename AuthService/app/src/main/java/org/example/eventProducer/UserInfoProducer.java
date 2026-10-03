package org.example.eventProducer;

import org.example.model.UserInfoDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class UserInfoProducer {
    private final KafkaTemplate<String, UserInfoEvent> kafkaTemplate;

    @Value("${spring.kafka.topic.name}")
    private String TOPIC_NAME;


    @Autowired
    public UserInfoProducer(KafkaTemplate<String, UserInfoEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendEventToKafka(UserInfoEvent eventData) {
        try {
            Message<UserInfoEvent> message = MessageBuilder.withPayload(eventData)
                    .setHeader(KafkaHeaders.TOPIC, TOPIC_NAME).build();
            kafkaTemplate.send(message).whenComplete((result, ex) -> {
                if (ex != null) {
                    System.err.println("Failed to send event to Kafka topic " + TOPIC_NAME + ": " + ex.getMessage());
                } else {
                    System.out.println("Successfully sent event to Kafka topic " + TOPIC_NAME);
                }
            });
        } catch (Exception ex) {
            System.err.println("Exception while sending event to Kafka: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
