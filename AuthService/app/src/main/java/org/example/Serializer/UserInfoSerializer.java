package org.example.Serializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Serializer;
import org.example.eventProducer.UserInfoEvent;

import java.util.Map;

public class UserInfoSerializer implements Serializer<UserInfoEvent> {

    @Override
    public void configure(Map<String, ?> configs, boolean isKey) {

    }

    @Override
    public byte[] serialize(String topic, UserInfoEvent data) {
        byte[] retval = null;
        ObjectMapper mapper = new ObjectMapper();
        try {
            retval = mapper.writeValueAsBytes(data);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return retval;
    }

    @Override
    public void close(){

    }

}
