package org.globe42.storage;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Config class for Google Cloud Storage beans. See the README for useful links regarding Google Cloud Storage.
 * @author JB Nizet
 */
@Configuration
public class StorageConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(StorageConfig.class);

    /**
     * The JSON string containing the credentials, loaded from the property
     * <code>globe42.googleCloudStorageCredentials</code>. If not
     * null (typically in production, on clever cloud, where the whole JSON credentials are stored in an environment
     * variable) then this is used as the source of the google credentials.
     */
    private final String credentials;

    /**
     * The path to the json file containing the credentials, loaded from the property
     * <code>globe42.googleCloudStorageCredentialsPath</code>. Only used if {@link #credentials} is null.
     * Typically used in dev mode, where specifying a file path in a command-line property is easier.
     */
    private final File credentialsPath;

    public StorageConfig(@Value("${globe42.googleCloudStorageCredentials:#{null}}") String credentials,
                         @Value("${globe42.googleCloudStorageCredentialsPath:#{null}}") File credentialsPath) {
        this.credentials = credentials;
        this.credentialsPath = credentialsPath;
    }

    @Bean
    public Storage storage() throws IOException {
        if (this.credentials != null) {
            LOGGER.info("Property globe42.googleCloudStorageCredentials is set." +
                            " Using its value as Google Cloud Storage JSON credentials");
            InputStream in = new ByteArrayInputStream(this.credentials.getBytes(StandardCharsets.UTF_8));
            return StorageOptions
                .newBuilder()
                .setCredentials(GoogleCredentials.fromStream(in))
                .build()
                .getService();
        }
        else if (this.credentialsPath != null) {
            LOGGER.info("Property globe42.googleCloudStorageCredentialsPath is set." +
                            " Using its value as a JSON file path to the Google Cloud Storage credentials");
            try (InputStream in = new FileInputStream(this.credentialsPath)) {
                return StorageOptions
                    .newBuilder()
                    .setCredentials(GoogleCredentials.fromStream(in))
                    .build()
                    .getService();
            }
        }
        else {
            LOGGER.warn("Neither property globe42.googleCloudStorageCredentials nor globe42.googleCloudStorageCredentials is set." +
                            " Using default instance credentials.");
            return StorageOptions.getDefaultInstance().getService();
        }
    }
}
