package org.globe42.storage;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Config class for Google Cloud Storage beans. See the README for useful links regarding Google Cloud Storage.
 * @author JB Nizet
 */
@Configuration
@EnableConfigurationProperties(StorageProperties.class)
public class StorageConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(StorageConfig.class);

    private final StorageProperties properties;

    public StorageConfig(StorageProperties properties) {
        this.properties = properties;
    }

    @Bean
    public Storage storage() throws IOException {
        if (properties.getCredentials() != null) {
            LOGGER.info("Property globe42.google-cloud-storage.credentials is set." +
                            " Using its value as Google Cloud Storage JSON credentials");
            InputStream in = new ByteArrayInputStream(properties.getCredentials().getBytes(StandardCharsets.UTF_8));
            return StorageOptions
                .newBuilder()
                .setCredentials(GoogleCredentials.fromStream(in))
                .build()
                .getService();
        }
        else if (properties.getCredentialsPath() != null) {
            LOGGER.info("Property globe42.google-cloud-storage.credentials-path is set." +
                            " Using its value as a JSON file path to the Google Cloud Storage credentials");
            try (InputStream in = new FileInputStream(properties.getCredentialsPath())) {
                return StorageOptions
                    .newBuilder()
                    .setCredentials(GoogleCredentials.fromStream(in))
                    .build()
                    .getService();
            }
        }
        else {
            LOGGER.warn("Neither property globe42.google-cloud-storage.credentials nor globe42.google-cloud-storage.credentials-path is set." +
                            " Using default instance credentials.");
            return StorageOptions.getDefaultInstance().getService();
        }
    }
}
