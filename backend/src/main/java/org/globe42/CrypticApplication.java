package org.globe42;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class CrypticApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext run = SpringApplication.run(CrypticApplication.class, args);
	}
}
