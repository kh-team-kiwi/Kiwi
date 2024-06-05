package com.kh.kiwi.team.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class GroupId implements Serializable {
    private String memberId;
    private String team;
}