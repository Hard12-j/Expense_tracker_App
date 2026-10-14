package com.expense.service.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@NoArgsConstructor
@Entity
public class Expense {

    @Id
    @Column(name="id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "user_id")
    @JsonProperty("user_id")
    private String userId;

    @Column(name = "amount")
    @JsonProperty("amount")
    private String amount;

    @Column(name = "currency")
    @JsonProperty("currency")
    private String currency;

    @Column(name="Merchant")
    @JsonProperty("merchant")
    private String merchant;

    @Column(name = "created_at")
    @JsonProperty("created_at")
    private Timestamp createdAt;

    @PrePersist
    @PreUpdate
    public void generateExternalId() {
        if(this.externalId == null){
            this.externalId = UUID.randomUUID().toString();
        }

        if(this.createdAt == null){
            this.createdAt = new Timestamp(Instant.now().toEpochMilli());
        }
    }
}
