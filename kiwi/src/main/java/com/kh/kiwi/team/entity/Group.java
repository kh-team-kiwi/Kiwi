package com.kh.kiwi.team.entity;

import com.kh.kiwi.auth.entity.Member;
import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
@Builder
@Table(name="GROUP_LIST")
@IdClass(GroupId.class)
public class Group {
    @Id
    @Column(name = "MEMBER_ID")
    private String memberId;
    @Id
    @Column(name = "TEAM")
    private String team;
    /*
    * MEMBER/ADMIN/OWNER
    * */
    private String role;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", insertable = false, updatable = false)
    private Member member;
}
