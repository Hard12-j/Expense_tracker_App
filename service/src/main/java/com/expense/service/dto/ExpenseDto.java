package com.expense.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;
import tools.jackson.databind.json.JsonMapper;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExpenseDto {

    private static final JsonMapper MAPPER = JsonMapper.builder()
            .propertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
            .build();

    private String externalId;

    @NonNull
    @JsonProperty(value = "amount")
    private String amount;

    @JsonProperty(value = "user_id")
    private String userId;

    @JsonProperty(value = "merchant")
    private String merchant;

    @JsonProperty(value = "currency")
    private String currency;

    @JsonProperty(value = "created_at")
    private Timestamp createdAt;

    public ExpenseDto(String json){
        try{
            ExpenseDto expense = MAPPER.readValue(json, ExpenseDto.class);
            this.externalId = expense.getExternalId();
            this.amount = expense.getAmount();
            this.userId = expense.getUserId();
            this.merchant = expense.getMerchant();
            this.currency = expense.getCurrency();
            this.createdAt = expense.getCreatedAt();
        }catch(Exception e){
            throw new RuntimeException("failed to deserialize ExpenseDto from Json", e);
        }
    }
}
