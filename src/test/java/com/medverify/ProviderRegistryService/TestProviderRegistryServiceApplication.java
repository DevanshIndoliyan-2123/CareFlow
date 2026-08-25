package com.medverify.ProviderRegistryService;

import org.springframework.boot.SpringApplication;

public class TestProviderRegistryServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(ProviderRegistryServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
