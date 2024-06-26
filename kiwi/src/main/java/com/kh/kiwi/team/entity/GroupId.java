package com.kh.kiwi.team.entity;

import lombok.*;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class GroupId implements Serializable {
    private String memberId;
    private String team;
}