package com.onlineexam.questionbank.entity;


//import com.example.demo.Entity.Exam;

//import com.example.demo.Entity.Exam;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
@Entity
@Table(name="Question")
public class Question {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int questionId;
	
	@Column(unique=true,nullable=false)
	private String text;
	
	@NotBlank(message = "Category cannot be blank")
	private String category;
	
	@NotBlank(message = "Difficulty cannot be blank")
	private String difficulty;
	
	@NotBlank(message = "Option1 cannot be blank")
	@Pattern(regexp = "^[a-zA-Z0-9 ]+$", message = "Option1 must not contain special characters")
	private String option1;
	
	@NotBlank(message = "Option2 cannot be blank")
	@Pattern(regexp = "^[a-zA-Z0-9 ]+$", message = "Option2 must not contain special characters")
	private String option2;
	
	private String correctAnswer;
			
	public Question() {
		
	}

	/**
	 * Used for testing purpose
	 * @param id
	 */
	public void setId(int id) {
		// TODO Auto-generated method stub
		questionId=id;
		
	}
	
}
