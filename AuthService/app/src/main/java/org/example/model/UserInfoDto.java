package org.example.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.entities.UserInfo;

@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserInfoDto extends UserInfo {

    @NonNull
    @JsonProperty("first_name")
    @JsonAlias({"firstName", "first_name"})
    private String firstName;

    @NonNull
    @JsonProperty("last_name")
    @JsonAlias({"lastName", "last_name"})
    private String lastName;

    @NonNull
    @JsonProperty("phone_number")
    @JsonAlias({"phoneNumber", "phone_number"})
    private Long phoneNumber;

    @NonNull
    @JsonProperty("email")
    private String email;
}
